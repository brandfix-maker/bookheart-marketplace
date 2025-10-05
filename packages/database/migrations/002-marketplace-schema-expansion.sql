-- Migration: Marketplace Schema Expansion
-- Description: Add complete romantasy marketplace features including offers, auctions, forums
-- Date: 2025-10-05

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Update transaction type enum
DO $$ BEGIN
  CREATE TYPE transaction_type AS ENUM ('buy_now', 'accepted_offer', 'auction_win');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Update transaction status enum
DO $$ BEGIN
  ALTER TYPE transaction_status RENAME TO transaction_status_old;
  CREATE TYPE transaction_status AS ENUM (
    'pending_payment', 'paid', 'shipped', 'delivered', 'inspection_approved', 
    'disputed', 'completed', 'cancelled', 'refunded'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create offer status enum
DO $$ BEGIN
  CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected', 'expired', 'countered');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create auction status enum
DO $$ BEGIN
  CREATE TYPE auction_status AS ENUM ('active', 'ended', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create review type enum
DO $$ BEGIN
  CREATE TYPE review_type AS ENUM ('seller', 'buyer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create subscription box enum
DO $$ BEGIN
  CREATE TYPE subscription_box AS ENUM (
    'FairyLoot', 'OwlCrate', 'IllumiCrate', 'Locked Library', 
    'Alluria', 'Acrylipics', 'Bookish', 'Bookish Darkly'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create signature type enum
DO $$ BEGIN
  CREATE TYPE signature_type AS ENUM ('hand', 'bookplate', 'digital');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create forum category enum
DO $$ BEGIN
  CREATE TYPE forum_category AS ENUM (
    'new-releases', 'iso', 'collections', 'author-events', 'reading-challenges', 'feedback'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- BOOKS TABLE ENHANCEMENTS
-- ============================================================================

-- Add new columns to books table
ALTER TABLE books 
ADD COLUMN IF NOT EXISTS accepts_offers BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS subscription_box subscription_box,
ADD COLUMN IF NOT EXISTS is_signed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS signature_type signature_type;

-- Update special_edition_details JSONB structure to include new fields
COMMENT ON COLUMN books.special_edition_details IS 'JSONB: paintedEdges, firstEdition, dustJacket, exclusiveCover, sprayed, customDustJacket, details';

-- Add GIN index for tropes JSONB array search
CREATE INDEX IF NOT EXISTS books_tropes_idx ON books USING GIN (tropes);

-- Add index for subscription box
CREATE INDEX IF NOT EXISTS books_subscription_box_idx ON books (subscription_box) WHERE subscription_box IS NOT NULL;

-- ============================================================================
-- TRANSACTIONS TABLE ENHANCEMENTS
-- ============================================================================

-- Add new columns to transactions table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS transaction_type transaction_type DEFAULT 'buy_now' NOT NULL,
ADD COLUMN IF NOT EXISTS inspection_deadline TIMESTAMP,
ADD COLUMN IF NOT EXISTS inspection_approved_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP;

-- Rename columns to match new schema
ALTER TABLE transactions RENAME COLUMN book_price_cents TO item_price_cents;
ALTER TABLE transactions RENAME COLUMN shipping_price_cents TO shipping_cents;
ALTER TABLE transactions RENAME COLUMN authorized_at TO paid_at;
ALTER TABLE transactions RENAME COLUMN inspection_ends_at TO inspection_deadline;

-- Update transaction status to new enum (if old enum exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status_old') THEN
    -- Migrate old status values to new ones
    UPDATE transactions SET status = 'pending_payment'::TEXT WHERE status::TEXT = 'pending';
    UPDATE transactions SET status = 'paid'::TEXT WHERE status::TEXT = 'authorized';
    
    -- Change column type
    ALTER TABLE transactions ALTER COLUMN status TYPE transaction_status USING status::TEXT::transaction_status;
    
    -- Drop old enum
    DROP TYPE transaction_status_old;
  END IF;
END $$;

-- Add index for complex transaction queries
CREATE INDEX IF NOT EXISTS transactions_status_idx ON transactions (buyer_id, seller_id, status);

-- ============================================================================
-- REVIEWS TABLE ENHANCEMENTS
-- ============================================================================

-- Add review_type column
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS review_type review_type NOT NULL DEFAULT 'seller';

-- ============================================================================
-- WISHLISTS TABLE ENHANCEMENTS
-- ============================================================================

-- Add new columns to wishlists table
ALTER TABLE wishlists 
ADD COLUMN IF NOT EXISTS price_alert_threshold_cents INTEGER,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add indexes for wishlist queries
CREATE INDEX IF NOT EXISTS wishlists_user_idx ON wishlists (user_id);
CREATE INDEX IF NOT EXISTS wishlists_book_idx ON wishlists (book_id);

-- ============================================================================
-- MESSAGES TABLE ENHANCEMENTS
-- ============================================================================

-- Add book_id column for message context
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS book_id UUID REFERENCES books(id) ON DELETE SET NULL;

-- Rename content column to message_text
ALTER TABLE messages RENAME COLUMN content TO message_text;

-- Add indexes for message queries
CREATE INDEX IF NOT EXISTS messages_recipient_read_idx ON messages (recipient_id, is_read);
CREATE INDEX IF NOT EXISTS messages_sender_idx ON messages (sender_id);

-- ============================================================================
-- OFFERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  
  offer_amount_cents INTEGER NOT NULL,
  message_to_seller TEXT,
  status offer_status DEFAULT 'pending' NOT NULL,
  
  -- 48-hour expiration from creation
  expires_at TIMESTAMP NOT NULL,
  
  -- Counter offer
  counter_offer_amount_cents INTEGER,
  counter_offer_message TEXT,
  
  -- Response tracking
  responded_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for offers
CREATE INDEX IF NOT EXISTS offers_seller_status_idx ON offers (seller_id, status);
CREATE INDEX IF NOT EXISTS offers_buyer_idx ON offers (buyer_id);
CREATE INDEX IF NOT EXISTS offers_book_idx ON offers (book_id);

-- ============================================================================
-- AUCTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID UNIQUE NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  starting_bid_cents INTEGER NOT NULL,
  current_bid_cents INTEGER NOT NULL,
  reserve_price_cents INTEGER,
  current_high_bidder_id UUID REFERENCES users(id),
  
  status auction_status DEFAULT 'active' NOT NULL,
  
  -- Timing
  start_time TIMESTAMP DEFAULT NOW() NOT NULL,
  end_time TIMESTAMP NOT NULL,
  
  -- Stats
  total_bids INTEGER DEFAULT 0,
  unique_bidders INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for auctions
CREATE INDEX IF NOT EXISTS auctions_status_idx ON auctions (status);
CREATE INDEX IF NOT EXISTS auctions_end_time_idx ON auctions (end_time);

-- ============================================================================
-- AUCTION_BIDS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS auction_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  bid_amount_cents INTEGER NOT NULL,
  auto_bid_max_cents INTEGER,
  
  is_auto_bid BOOLEAN DEFAULT FALSE,
  is_winning_bid BOOLEAN DEFAULT FALSE,
  
  bid_time TIMESTAMP DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for auction_bids
CREATE INDEX IF NOT EXISTS auction_bids_auction_idx ON auction_bids (auction_id);
CREATE INDEX IF NOT EXISTS auction_bids_bidder_idx ON auction_bids (bidder_id);

-- ============================================================================
-- FORUMS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category forum_category NOT NULL,
  thread_title TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  
  -- Last activity tracking
  last_post_id UUID,
  last_post_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for forums
CREATE INDEX IF NOT EXISTS forums_category_idx ON forums (category);
CREATE INDEX IF NOT EXISTS forums_last_post_idx ON forums (last_post_at);

-- ============================================================================
-- FORUM_POSTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES forums(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  post_content TEXT NOT NULL,
  parent_post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  
  -- Voting
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  
  -- Moderation
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for forum_posts
CREATE INDEX IF NOT EXISTS forum_posts_thread_idx ON forum_posts (thread_id);
CREATE INDEX IF NOT EXISTS forum_posts_author_idx ON forum_posts (author_id);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for new tables
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_offers_updated_at') THEN
    CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_auctions_updated_at') THEN
    CREATE TRIGGER update_auctions_updated_at BEFORE UPDATE ON auctions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_forums_updated_at') THEN
    CREATE TRIGGER update_forums_updated_at BEFORE UPDATE ON forums 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_forum_posts_updated_at') THEN
    CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE offers IS 'Buyer offers on books with accepts_offers enabled';
COMMENT ON TABLE auctions IS 'Book auctions with bidding system';
COMMENT ON TABLE auction_bids IS 'Individual bids placed on auctions';
COMMENT ON TABLE forums IS 'Community forum threads';
COMMENT ON TABLE forum_posts IS 'Posts and replies within forum threads';

COMMENT ON COLUMN books.accepts_offers IS 'Whether seller accepts offers on this book';
COMMENT ON COLUMN books.city IS 'City for distance calculations and local pickup';
COMMENT ON COLUMN books.state IS 'State for distance calculations and local pickup';
COMMENT ON COLUMN books.zip_code IS 'ZIP code for distance calculations';
COMMENT ON COLUMN books.subscription_box IS 'Special edition subscription box provider';
COMMENT ON COLUMN books.is_signed IS 'Whether the book is signed';
COMMENT ON COLUMN books.signature_type IS 'Type of signature: hand, bookplate, or digital';

COMMENT ON COLUMN transactions.transaction_type IS 'How the transaction was initiated';
COMMENT ON COLUMN transactions.inspection_deadline IS '72-hour inspection period after delivery';
COMMENT ON COLUMN transactions.inspection_approved_at IS 'When buyer approved after inspection period';

COMMENT ON COLUMN reviews.review_type IS 'Whether reviewing seller or buyer';

COMMENT ON COLUMN wishlists.price_alert_threshold_cents IS 'Notify when price drops below this amount';
COMMENT ON COLUMN wishlists.notes IS 'User notes about this wishlist item';

COMMENT ON COLUMN messages.book_id IS 'Book context for this message thread';

COMMENT ON COLUMN offers.expires_at IS 'Offers automatically expire after 48 hours';
COMMENT ON COLUMN offers.counter_offer_amount_cents IS 'Seller counter-offer amount';

COMMENT ON COLUMN auctions.reserve_price_cents IS 'Optional reserve price - auction only completes if met';
COMMENT ON COLUMN auction_bids.auto_bid_max_cents IS 'Maximum amount for automatic bidding';

COMMENT ON COLUMN forum_posts.parent_post_id IS 'Parent post for nested replies';

-- ============================================================================
-- GRANT PERMISSIONS (if using specific database users)
-- ============================================================================

-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- ============================================================================
-- COMPLETED
-- ============================================================================

-- Migration completed successfully

