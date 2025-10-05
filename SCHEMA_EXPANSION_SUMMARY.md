# BookHeart Marketplace Schema Expansion

## Summary

The BookHeart database schema has been successfully expanded to support a complete romantasy book marketplace. This document outlines all the changes made to the database schema and TypeScript types.

## Schema Changes Overview

### New Enums Added

1. **transaction_type**: `'buy_now' | 'accepted_offer' | 'auction_win'`
2. **offer_status**: `'pending' | 'accepted' | 'rejected' | 'expired' | 'countered'`
3. **auction_status**: `'active' | 'ended' | 'cancelled'`
4. **review_type**: `'seller' | 'buyer'`
5. **subscription_box**: `'FairyLoot' | 'OwlCrate' | 'IllumiCrate' | 'Locked Library' | 'Alluria' | 'Acrylipics' | 'Bookish' | 'Bookish Darkly'`
6. **signature_type**: `'hand' | 'bookplate' | 'digital'`
7. **forum_category**: `'new-releases' | 'iso' | 'collections' | 'author-events' | 'reading-challenges' | 'feedback'`

### Enhanced Existing Tables

#### Books Table
**New Fields:**
- `acceptsOffers` (boolean) - Whether seller accepts offers
- `city`, `state`, `zipCode` (text) - Location for distance calculations
- `subscriptionBox` (enum) - Special edition subscription box provider
- `isSigned` (boolean) - Whether the book is signed
- `signatureType` (enum) - Type of signature (hand, bookplate, digital)

**Updated Fields:**
- `specialEditionDetails` JSONB now includes: `paintedEdges`, `firstEdition`, `dustJacket`, `exclusiveCover`, `sprayed`, `customDustJacket`, `details`

**New Indexes:**
- GIN index on `tropes` for JSONB array search
- Index on `subscriptionBox`

#### Transactions Table
**New Fields:**
- `transactionType` (enum) - How the transaction was initiated
- `inspectionDeadline` (timestamp) - 72-hour inspection period after delivery
- `inspectionApprovedAt` (timestamp) - When buyer approved after inspection
- `paidAt` (timestamp) - When payment was completed
- `cancelledAt` (timestamp) - When transaction was cancelled
- `refundedAt` (timestamp) - When refund was processed

**Updated Fields:**
- Renamed `bookPriceCents` → `itemPriceCents`
- Renamed `shippingPriceCents` → `shippingCents`
- Updated `status` enum to new values: `'pending_payment' | 'paid' | 'shipped' | 'delivered' | 'inspection_approved' | 'disputed' | 'completed' | 'cancelled' | 'refunded'`

**New Indexes:**
- Composite index on `(buyerId, sellerId, status)`

#### Reviews Table
**New Fields:**
- `reviewType` (enum) - Whether reviewing seller or buyer

**New Indexes:**
- Composite index on `(reviewedUserId, rating)`

#### Wishlists Table
**New Fields:**
- `priceAlertThresholdCents` (integer) - Notify when price drops below this amount
- `notes` (text) - User notes about wishlist item

**New Indexes:**
- Index on `userId`
- Index on `bookId`

#### Messages Table
**New Fields:**
- `bookId` (UUID) - Book context for message thread

**Updated Fields:**
- Renamed `content` → `messageText`

**New Indexes:**
- Composite index on `(recipientId, isRead)`
- Index on `senderId`

### New Tables

#### 1. Offers Table
Enables buyers to make offers on books that accept offers.

**Fields:**
- `id` (UUID, primary key)
- `buyerId` (UUID, foreign key to users)
- `sellerId` (UUID, foreign key to users)
- `bookId` (UUID, foreign key to books)
- `offerAmountCents` (integer)
- `messageToSeller` (text, nullable)
- `status` (offer_status enum)
- `expiresAt` (timestamp) - Offers expire after 48 hours
- `counterOfferAmountCents` (integer, nullable)
- `counterOfferMessage` (text, nullable)
- `respondedAt` (timestamp, nullable)
- `createdAt`, `updatedAt` (timestamps)

**Indexes:**
- `(sellerId, status)`
- `buyerId`
- `bookId`

**Constraints:**
- ON DELETE CASCADE for user and book references

#### 2. Auctions Table
Enables sellers to auction books with competitive bidding.

**Fields:**
- `id` (UUID, primary key)
- `bookId` (UUID, unique foreign key to books)
- `sellerId` (UUID, foreign key to users)
- `startingBidCents` (integer)
- `currentBidCents` (integer)
- `reservePriceCents` (integer, nullable) - Optional reserve price
- `currentHighBidderId` (UUID, nullable foreign key to users)
- `status` (auction_status enum)
- `startTime` (timestamp)
- `endTime` (timestamp)
- `totalBids` (integer, default 0)
- `uniqueBidders` (integer, default 0)
- `createdAt`, `updatedAt` (timestamps)

**Indexes:**
- `status`
- `endTime`

**Constraints:**
- ON DELETE CASCADE for user and book references
- Unique constraint on `bookId` (one auction per book)

#### 3. Auction Bids Table
Stores individual bids placed on auctions with automatic bidding support.

**Fields:**
- `id` (UUID, primary key)
- `auctionId` (UUID, foreign key to auctions)
- `bidderId` (UUID, foreign key to users)
- `bidAmountCents` (integer)
- `autoBidMaxCents` (integer, nullable) - For automatic bidding
- `isAutoBid` (boolean, default false)
- `isWinningBid` (boolean, default false) - Updated when auction ends
- `bidTime` (timestamp)
- `createdAt` (timestamp)

**Indexes:**
- `auctionId`
- `bidderId`

**Constraints:**
- ON DELETE CASCADE for auction and user references

#### 4. Forums Table
Community forum threads organized by category.

**Fields:**
- `id` (UUID, primary key)
- `category` (forum_category enum)
- `threadTitle` (text)
- `authorId` (UUID, foreign key to users)
- `isPinned` (boolean, default false)
- `isLocked` (boolean, default false)
- `viewCount` (integer, default 0)
- `replyCount` (integer, default 0)
- `lastPostId` (UUID, nullable)
- `lastPostAt` (timestamp, nullable)
- `createdAt`, `updatedAt` (timestamps)

**Indexes:**
- `category`
- `lastPostAt`

**Constraints:**
- ON DELETE CASCADE for user references

#### 5. Forum Posts Table
Individual posts and replies within forum threads with voting and moderation.

**Fields:**
- `id` (UUID, primary key)
- `threadId` (UUID, foreign key to forums)
- `authorId` (UUID, foreign key to users)
- `postContent` (text) - Rich text content
- `parentPostId` (UUID, nullable foreign key to forum_posts) - For nested replies
- `upvotes` (integer, default 0)
- `downvotes` (integer, default 0)
- `isEdited` (boolean, default false)
- `editedAt` (timestamp, nullable)
- `isDeleted` (boolean, default false)
- `deletedAt` (timestamp, nullable)
- `createdAt`, `updatedAt` (timestamps)

**Indexes:**
- `threadId`
- `authorId`

**Constraints:**
- ON DELETE CASCADE for thread, user, and parent post references
- Self-referencing foreign key for nested replies

## TypeScript Types

### New Type Files

1. **`packages/shared/types/offer.ts`**
   - `Offer` interface
   - `OfferStatus` type
   - Request/response types for offer operations

2. **`packages/shared/types/auction.ts`**
   - `Auction` interface
   - `AuctionBid` interface
   - `AuctionStatus` type
   - Request/response types for auction operations
   - Search parameters

3. **`packages/shared/types/forum.ts`**
   - `Forum` interface
   - `ForumPost` interface
   - `ForumCategory` type
   - Request/response types for forum operations
   - Category descriptions constant

### Updated Type Files

1. **`packages/shared/types/book.ts`**
   - Added `SubscriptionBox` and `SignatureType` types
   - Added new fields to `Book` interface
   - Updated `SpecialEditionDetails` interface

2. **`packages/shared/types/transaction.ts`**
   - Added `TransactionType` type
   - Updated `TransactionStatus` type
   - Updated field names and added new milestone fields

3. **`packages/shared/types/review.ts`**
   - Added `ReviewType` type
   - Added `reviewType` field to `Review` interface

4. **`packages/shared/types/wishlist.ts`**
   - Added `priceAlertThresholdCents` and `notes` fields
   - Added `UpdateWishlistRequest` interface

5. **`packages/shared/types/message.ts`**
   - Added `bookId` field
   - Renamed `content` → `messageText`

## Migration File

**Location:** `packages/database/migrations/002-marketplace-schema-expansion.sql`

The migration file includes:
- Safe enum creation with `DO $$ BEGIN ... EXCEPTION` blocks
- Table alterations with `IF NOT EXISTS` checks
- Index creation with `IF NOT EXISTS` checks
- Trigger creation for `updated_at` columns
- Comprehensive comments for documentation
- Backward compatibility considerations

### Running the Migration

```bash
# Navigate to database package
cd packages/database

# Run the migration
npm run migrate

# Or use the Drizzle CLI directly
npx drizzle-kit push:pg
```

## Performance Optimizations

### Indexes Added

1. **Books:**
   - GIN index on `tropes` for fast JSONB array search
   - Index on `subscriptionBox`

2. **Transactions:**
   - Composite index on `(buyerId, sellerId, status)` for seller/buyer dashboards

3. **Offers:**
   - Composite index on `(sellerId, status)` for offer management
   - Indexes on `buyerId` and `bookId`

4. **Auctions:**
   - Index on `status` for active auction queries
   - Index on `endTime` for ending soon queries

5. **Auction Bids:**
   - Indexes on `auctionId` and `bidderId`

6. **Reviews:**
   - Composite index on `(reviewedUserId, rating)` for user reputation

7. **Wishlists:**
   - Indexes on `userId` and `bookId`

8. **Messages:**
   - Composite index on `(recipientId, isRead)` for unread message counts

9. **Forums:**
   - Indexes on `category` and `lastPostAt`

10. **Forum Posts:**
    - Indexes on `threadId` and `authorId`

## Foreign Key Constraints

All foreign key relationships use appropriate `ON DELETE` actions:

- **CASCADE**: Used for dependent data (e.g., offers, bids, forum posts)
- **SET NULL**: Used for optional references (e.g., book_id in messages)
- **NO ACTION** (default): Used for core relationships (e.g., seller_id in books)

## Future Enhancements

The schema is designed with these future features in mind:

1. **Payment Escrow**
   - Stripe Connect integration fields are ready
   - Transaction milestone tracking supports escrow release

2. **Geographical Search**
   - Location fields (city, state, zip_code) prepared for PostGIS extension
   - Ready for distance-based search and local pickup matching

3. **Full-Text Search**
   - Text fields ready for PostgreSQL tsvector implementation
   - GIN indexes on JSONB fields support advanced queries

4. **Real-Time Features**
   - Message read tracking supports real-time notifications
   - Auction bid tracking supports real-time updates

5. **Recommendation System**
   - View count tracking on books and forum threads
   - Activity tracking fields on users
   - Ready for collaborative filtering algorithms

## Testing

Before deploying to production:

1. **Test Migration:**
   ```bash
   # Test on a development database first
   DATABASE_URL=your_dev_database npm run migrate
   ```

2. **Verify Schema:**
   ```bash
   # Check generated tables and indexes
   npx drizzle-kit introspect:pg
   ```

3. **Test Type Safety:**
   ```bash
   # Compile TypeScript to check for type errors
   cd packages/shared && npm run build
   ```

## Breaking Changes

### Transaction Table
- Field names changed: `bookPriceCents` → `itemPriceCents`, `shippingPriceCents` → `shippingCents`
- Status enum values updated
- **Action Required:** Update all queries and TypeScript code referencing these fields

### Message Table
- Field name changed: `content` → `messageText`
- **Action Required:** Update all queries and TypeScript code referencing this field

### Review Type
- New required field: `reviewType`
- **Action Required:** Update review creation logic to specify type

## Backward Compatibility

The migration is designed to be non-destructive:
- All existing data is preserved
- New columns are nullable or have defaults
- Enum migrations handle existing values
- Indexes are created with `IF NOT EXISTS`

## Documentation

All tables and important columns have PostgreSQL comments for documentation. View them with:

```sql
SELECT 
  c.table_name,
  c.column_name,
  pgd.description
FROM pg_catalog.pg_statio_all_tables AS st
INNER JOIN pg_catalog.pg_description pgd ON (pgd.objoid = st.relid)
INNER JOIN information_schema.columns c ON (
  pgd.objsubid = c.ordinal_position AND
  c.table_schema = st.schemaname AND
  c.table_name = st.relname
)
WHERE c.table_schema = 'public';
```

## Support

For questions or issues related to the schema expansion:
1. Check the migration file for detailed SQL
2. Review the TypeScript type definitions
3. Consult the Drizzle ORM documentation for query patterns

---

**Schema Version:** 002  
**Date:** October 5, 2025  
**Status:** Ready for deployment

