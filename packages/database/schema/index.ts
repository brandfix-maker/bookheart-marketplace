import { pgTable, uuid, text, integer, boolean, timestamp, jsonb, index, pgEnum } from 'drizzle-orm/pg-core';

// Enums for consistent types
// All users can buy and sell. Seller features activate when they list their first book.
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const bookConditionEnum = pgEnum('book_condition', ['new', 'like-new', 'very-good', 'good', 'acceptable']);
export const bookStatusEnum = pgEnum('book_status', ['draft', 'active', 'pending', 'sold', 'removed']);
export const transactionTypeEnum = pgEnum('transaction_type', ['buy_now', 'accepted_offer', 'auction_win']);
export const transactionStatusEnum = pgEnum('transaction_status', [
  'pending_payment', 'paid', 'shipped', 'delivered', 'inspection_approved', 'disputed', 'completed', 'cancelled', 'refunded'
]);
export const offerStatusEnum = pgEnum('offer_status', ['pending', 'accepted', 'rejected', 'expired', 'countered']);
export const auctionStatusEnum = pgEnum('auction_status', ['active', 'ended', 'cancelled']);
export const reviewTypeEnum = pgEnum('review_type', ['seller', 'buyer']);
export const subscriptionBoxEnum = pgEnum('subscription_box', [
  'FairyLoot', 'OwlCrate', 'IllumiCrate', 'Locked Library', 'Alluria', 'Acrylipics', 'Bookish', 'Bookish Darkly'
]);
export const signatureTypeEnum = pgEnum('signature_type', ['hand', 'bookplate', 'digital']);
export const forumCategoryEnum = pgEnum('forum_category', [
  'new-releases', 'iso', 'collections', 'author-events', 'reading-challenges', 'feedback'
]);
export const notificationTypeEnum = pgEnum('notification_type', [
  'offer_received', 'offer_accepted', 'offer_rejected', 'offer_countered', 'message_received', 'book_sold'
]);
export const notificationRelatedTypeEnum = pgEnum('notification_related_type', [
  'offer', 'transaction', 'message', 'book'
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  username: text('username').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  
  // Universal account - user/admin only
  role: userRoleEnum('role').default('user').notNull(),
  
  // Activity tracking for progressive disclosure
  hasMadePurchase: boolean('has_made_purchase').default(false),
  hasListedItem: boolean('has_listed_item').default(false),
  lastBuyerActivity: timestamp('last_buyer_activity'),
  lastSellerActivity: timestamp('last_seller_activity'),
  
  // Seller onboarding
  sellerOnboardingCompleted: boolean('seller_onboarding_completed').default(false),
  sellerVerified: boolean('seller_verified').default(false),
  stripeAccountId: text('stripe_account_id'),
  stripeAccountStatus: text('stripe_account_status'),
  
  // Profile
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  location: text('location'), // For local pickup
  
  // Optional survey data (for analytics only)
  registrationSurvey: jsonb('registration_survey').$type<{
    whatBringsYouHere?: string;
    interests?: string[];
    heardAboutUs?: string;
  }>(),
  
  // System
  emailVerified: boolean('email_verified').default(false),
  refreshToken: text('refresh_token'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  
  // Future Stripe integration fields
  stripeCustomerId: text('stripe_customer_id'), // For buyers
  paymentMethodId: text('payment_method_id'), // Default payment method
  subscriptionStatus: text('subscription_status'), // For premium features
});

export const books = pgTable('books', {
  id: uuid('id').primaryKey().defaultRandom(),
  sellerId: uuid('seller_id').references(() => users.id).notNull(),
  
  // Core info
  title: text('title').notNull(),
  author: text('author').notNull(),
  isbn: text('isbn'),
  description: text('description'),
  
  // Romantasy specific
  seriesName: text('series_name'),
  seriesNumber: integer('series_number'),
  tropes: jsonb('tropes').$type<string[]>().default([]),
  spiceLevel: integer('spice_level'), // 0-5
  
  // Condition & pricing
  condition: bookConditionEnum('condition').notNull(),
  conditionNotes: text('condition_notes'),
  priceCents: integer('price_cents').notNull(),
  shippingPriceCents: integer('shipping_price_cents').default(0),
  acceptsOffers: boolean('accepts_offers').default(false),
  localPickupAvailable: boolean('local_pickup_available').default(false),
  
  // Location for distance calculations
  city: text('city'),
  state: text('state'),
  zipCode: text('zip_code'),
  
  // Special editions - enhanced structure
  isSpecialEdition: boolean('is_special_edition').default(false),
  subscriptionBox: subscriptionBoxEnum('subscription_box'),
  isSigned: boolean('is_signed').default(false),
  signatureType: signatureTypeEnum('signature_type'),
  specialEditionDetails: jsonb('special_edition_details').$type<{
    paintedEdges?: boolean;
    firstEdition?: boolean;
    dustJacket?: boolean;
    exclusiveCover?: boolean;
    sprayed?: boolean;
    customDustJacket?: boolean;
    details?: string;
  }>(),
  
  // Status
  status: bookStatusEnum('status').default('draft').notNull(),
  viewCount: integer('view_count').default(0),
  slug: text('slug').unique(),
  
  // Timestamps
  publishedAt: timestamp('published_at'),
  soldAt: timestamp('sold_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const bookImages = pgTable('book_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookId: uuid('book_id').references(() => books.id, { onDelete: 'cascade' }).notNull(),
  cloudinaryUrl: text('cloudinary_url').notNull(),
  cloudinaryPublicId: text('cloudinary_public_id').notNull(),
  altText: text('alt_text'),
  isPrimary: boolean('is_primary').default(false),
  order: integer('order').default(0),
  width: integer('width'),
  height: integer('height'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookId: uuid('book_id').references(() => books.id).notNull(),
  buyerId: uuid('buyer_id').references(() => users.id).notNull(),
  sellerId: uuid('seller_id').references(() => users.id).notNull(),
  
  // Transaction type
  transactionType: transactionTypeEnum('transaction_type').default('buy_now').notNull(),
  
  // Financial (cents)
  itemPriceCents: integer('item_price_cents').notNull(),
  shippingCents: integer('shipping_cents').default(0),
  platformFeeCents: integer('platform_fee_cents').notNull(), // 7%
  sellerPayoutCents: integer('seller_payout_cents').notNull(),
  totalCents: integer('total_cents').notNull(),
  
  // Stripe
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  stripeTransferId: text('stripe_transfer_id'),
  stripeRefundId: text('stripe_refund_id'),
  
  // Status flow
  status: transactionStatusEnum('status').default('pending_payment').notNull(),
  
  // Milestones
  paidAt: timestamp('paid_at'),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
  inspectionDeadline: timestamp('inspection_deadline'), // 72 hours after delivery
  inspectionApprovedAt: timestamp('inspection_approved_at'),
  completedAt: timestamp('completed_at'),
  disputedAt: timestamp('disputed_at'),
  cancelledAt: timestamp('cancelled_at'),
  refundedAt: timestamp('refunded_at'),
  
  // Shipping
  shippingMethod: text('shipping_method'),
  trackingNumber: text('tracking_number'),
  trackingCarrier: text('tracking_carrier'),
  
  // Local pickup
  pickupLocation: text('pickup_location'),
  pickupScheduledAt: timestamp('pickup_scheduled_at'),
  pickupConfirmedAt: timestamp('pickup_confirmed_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  transactionId: uuid('transaction_id').references(() => transactions.id).unique().notNull(),
  reviewerId: uuid('reviewer_id').references(() => users.id).notNull(),
  reviewedUserId: uuid('reviewed_user_id').references(() => users.id).notNull(),
  
  reviewType: reviewTypeEnum('review_type').notNull(),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  
  // Aspects
  conditionAccurate: boolean('condition_accurate'),
  shippingSpeed: integer('shipping_speed'), // 1-5
  communication: integer('communication'), // 1-5
  
  sellerResponse: text('seller_response'),
  sellerRespondedAt: timestamp('seller_responded_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const wishlists = pgTable('wishlists', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  bookId: uuid('book_id').references(() => books.id, { onDelete: 'cascade' }).notNull(),
  priceAlertThresholdCents: integer('price_alert_threshold_cents'), // Notify when book drops below this price
  notes: text('notes'),
  notifyOnPriceDrop: boolean('notify_on_price_drop').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  recipientId: uuid('recipient_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  bookId: uuid('book_id').references(() => books.id, { onDelete: 'set null' }), // Context for message
  transactionId: uuid('transaction_id').references(() => transactions.id, { onDelete: 'set null' }),
  messageText: text('message_text').notNull(),
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const offers = pgTable('offers', {
  id: uuid('id').primaryKey().defaultRandom(),
  buyerId: uuid('buyer_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  sellerId: uuid('seller_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  bookId: uuid('book_id').references(() => books.id, { onDelete: 'cascade' }).notNull(),
  
  offerAmountCents: integer('offer_amount_cents').notNull(),
  messageToSeller: text('message_to_seller'),
  status: offerStatusEnum('status').default('pending').notNull(),
  
  // 48-hour expiration from creation
  expiresAt: timestamp('expires_at').notNull(),
  
  // Counter offer
  counterOfferAmountCents: integer('counter_offer_amount_cents'),
  counterOfferMessage: text('counter_offer_message'),
  
  // Response tracking
  respondedAt: timestamp('responded_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const auctions = pgTable('auctions', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookId: uuid('book_id').references(() => books.id, { onDelete: 'cascade' }).unique().notNull(),
  sellerId: uuid('seller_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  startingBidCents: integer('starting_bid_cents').notNull(),
  currentBidCents: integer('current_bid_cents').notNull(),
  reservePriceCents: integer('reserve_price_cents'), // Nullable - optional reserve
  currentHighBidderId: uuid('current_high_bidder_id').references(() => users.id),
  
  status: auctionStatusEnum('status').default('active').notNull(),
  
  // Timing
  startTime: timestamp('start_time').defaultNow().notNull(),
  endTime: timestamp('end_time').notNull(),
  
  // Stats
  totalBids: integer('total_bids').default(0),
  uniqueBidders: integer('unique_bidders').default(0),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const auctionBids = pgTable('auction_bids', {
  id: uuid('id').primaryKey().defaultRandom(),
  auctionId: uuid('auction_id').references(() => auctions.id, { onDelete: 'cascade' }).notNull(),
  bidderId: uuid('bidder_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  bidAmountCents: integer('bid_amount_cents').notNull(),
  autoBidMaxCents: integer('auto_bid_max_cents'), // For automatic bidding
  
  isAutoBid: boolean('is_auto_bid').default(false), // Was this bid placed automatically?
  isWinningBid: boolean('is_winning_bid').default(false), // Updated when auction ends
  
  bidTime: timestamp('bid_time').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const forums = pgTable('forums', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: forumCategoryEnum('category').notNull(),
  threadTitle: text('thread_title').notNull(),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  isPinned: boolean('is_pinned').default(false),
  isLocked: boolean('is_locked').default(false),
  
  // Stats
  viewCount: integer('view_count').default(0),
  replyCount: integer('reply_count').default(0),
  
  // Last activity tracking
  lastPostId: uuid('last_post_id'),
  lastPostAt: timestamp('last_post_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const forumPosts = pgTable('forum_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  threadId: uuid('thread_id').references(() => forums.id, { onDelete: 'cascade' }).notNull(),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  postContent: text('post_content').notNull(), // Rich text
  parentPostId: uuid('parent_post_id').references((): any => forumPosts.id, { onDelete: 'cascade' }), // For nested replies
  
  // Voting
  upvotes: integer('upvotes').default(0),
  downvotes: integer('downvotes').default(0),
  
  // Moderation
  isEdited: boolean('is_edited').default(false),
  editedAt: timestamp('edited_at'),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  relatedId: uuid('related_id'),
  relatedType: notificationRelatedTypeEnum('related_type'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Performance indexes
export const booksSellerStatusIdx = index('books_seller_status_idx').on(books.sellerId, books.status);
// Index for searching the 'title' field in books.
// Note: Intended for JSONB array search, but using standard indexing due to Drizzle limitations (GIN not supported here).
export const booksTitleIdx = index('books_title_idx').on(books.title);
export const booksAuthorIdx = index('books_author_idx').on(books.author);
export const booksSubscriptionBoxIdx = index('books_subscription_box_idx').on(books.subscriptionBox);
export const booksTropesIdx = index('books_tropes_idx').on(books.tropes); // JSONB array search - using standard indexing due to Drizzle limitations
export const transactionsBuyerIdx = index('transactions_buyer_idx').on(transactions.buyerId);
export const transactionsSellerIdx = index('transactions_seller_idx').on(transactions.sellerId);
export const transactionsStatusIdx = index('transactions_status_idx').on(transactions.buyerId, transactions.sellerId, transactions.status);

export const offersSellerStatusIdx = index('offers_seller_status_idx').on(offers.sellerId, offers.status);
export const offersBuyerIdx = index('offers_buyer_idx').on(offers.buyerId);
export const offersBookIdx = index('offers_book_idx').on(offers.bookId);

export const auctionsStatusIdx = index('auctions_status_idx').on(auctions.status);
export const auctionsEndTimeIdx = index('auctions_end_time_idx').on(auctions.endTime);

export const auctionBidsAuctionIdx = index('auction_bids_auction_idx').on(auctionBids.auctionId);
export const auctionBidsBidderIdx = index('auction_bids_bidder_idx').on(auctionBids.bidderId);

export const reviewsReviewedUserIdx = index('reviews_reviewed_user_idx').on(reviews.reviewedUserId, reviews.rating);
export const reviewsReviewerIdx = index('reviews_reviewer_idx').on(reviews.reviewerId);

export const wishlistsUserIdx = index('wishlists_user_idx').on(wishlists.userId);
export const wishlistsBookIdx = index('wishlists_book_idx').on(wishlists.bookId);

export const messagesRecipientReadIdx = index('messages_recipient_read_idx').on(messages.recipientId, messages.isRead);
export const messagesSenderIdx = index('messages_sender_idx').on(messages.senderId);

export const forumsCategoryIdx = index('forums_category_idx').on(forums.category);
export const forumsLastPostIdx = index('forums_last_post_idx').on(forums.lastPostAt);

export const forumPostsThreadIdx = index('forum_posts_thread_idx').on(forumPosts.threadId);
export const forumPostsAuthorIdx = index('forum_posts_author_idx').on(forumPosts.authorId);

export const notificationsUserIdIdx = index('notifications_user_id_idx').on(notifications.userId);
export const notificationsIsReadIdx = index('notifications_is_read_idx').on(notifications.isRead);
export const notificationsCreatedAtIdx = index('notifications_created_at_idx').on(notifications.createdAt);
export const notificationsUserReadIdx = index('notifications_user_read_idx').on(notifications.userId, notifications.isRead);
export const notificationsUserCreatedIdx = index('notifications_user_created_idx').on(notifications.userId, notifications.createdAt);
