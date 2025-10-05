import { pgTable, uuid, text, integer, boolean, timestamp, jsonb, index, pgEnum } from 'drizzle-orm/pg-core';

// Enums for consistent types
export const userRoleEnum = pgEnum('user_role', ['buyer', 'seller', 'both', 'admin']);
export const bookConditionEnum = pgEnum('book_condition', ['new', 'like-new', 'very-good', 'good', 'acceptable']);
export const bookStatusEnum = pgEnum('book_status', ['draft', 'active', 'pending', 'sold', 'removed']);
export const transactionStatusEnum = pgEnum('transaction_status', [
  'pending', 'authorized', 'shipped', 'delivered', 'completed', 'disputed', 'refunded', 'cancelled'
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  username: text('username').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  
  // Universal account - role field deprecated but kept for backward compatibility
  role: userRoleEnum('role').default('buyer').notNull(),
  
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
  localPickupAvailable: boolean('local_pickup_available').default(false),
  
  // Special editions
  isSpecialEdition: boolean('is_special_edition').default(false),
  specialEditionDetails: jsonb('special_edition_details').$type<{
    paintedEdges?: boolean;
    signedCopy?: boolean;
    firstEdition?: boolean;
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
  
  // Financial (cents)
  bookPriceCents: integer('book_price_cents').notNull(),
  shippingPriceCents: integer('shipping_price_cents').default(0),
  platformFeeCents: integer('platform_fee_cents').notNull(), // 7%
  sellerPayoutCents: integer('seller_payout_cents').notNull(),
  totalCents: integer('total_cents').notNull(),
  
  // Stripe
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  stripeTransferId: text('stripe_transfer_id'),
  stripeRefundId: text('stripe_refund_id'),
  
  // Status flow
  status: transactionStatusEnum('status').default('pending').notNull(),
  
  // Milestones
  authorizedAt: timestamp('authorized_at'),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
  inspectionEndsAt: timestamp('inspection_ends_at'),
  completedAt: timestamp('completed_at'),
  disputedAt: timestamp('disputed_at'),
  
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
  userId: uuid('user_id').references(() => users.id).notNull(),
  bookId: uuid('book_id').references(() => books.id).notNull(),
  notifyOnPriceDrop: boolean('notify_on_price_drop').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  transactionId: uuid('transaction_id').references(() => transactions.id),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  recipientId: uuid('recipient_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Performance indexes
export const booksSellerStatusIdx = index('books_seller_status_idx').on(books.sellerId, books.status);
export const booksTitleIdx = index('books_title_idx').on(books.title);
export const booksAuthorIdx = index('books_author_idx').on(books.author);
export const transactionsBuyerIdx = index('transactions_buyer_idx').on(transactions.buyerId);
export const transactionsSellerIdx = index('transactions_seller_idx').on(transactions.sellerId);
