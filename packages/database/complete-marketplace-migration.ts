import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables BEFORE importing db
dotenv.config({ path: path.join(__dirname, '..', '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '..', 'env.local') });

import { db } from './client';
import { sql } from 'drizzle-orm';

async function completeMarketplaceMigration() {
  try {
    console.log('🚀 Completing marketplace schema expansion migration...');
    
    // Drop transaction_status_old if it exists (cleanup from previous partial migration)
    console.log('🧹 Cleaning up old enum types...');
    try {
      await db.execute(sql`DROP TYPE IF EXISTS transaction_status_old CASCADE`);
      console.log('  ✓ Cleaned up transaction_status_old');
    } catch (error) {
      console.log('  ℹ️ No cleanup needed');
    }
    
    // Create OFFERS table
    console.log('📝 Creating offers table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS offers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        
        offer_amount_cents INTEGER NOT NULL,
        message_to_seller TEXT,
        status offer_status DEFAULT 'pending' NOT NULL,
        
        expires_at TIMESTAMP NOT NULL,
        
        counter_offer_amount_cents INTEGER,
        counter_offer_message TEXT,
        
        responded_at TIMESTAMP,
        
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    console.log('  ✓ Offers table created');
    
    // Create AUCTIONS table
    console.log('📝 Creating auctions table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS auctions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        book_id UUID UNIQUE NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        
        starting_bid_cents INTEGER NOT NULL,
        current_bid_cents INTEGER NOT NULL,
        reserve_price_cents INTEGER,
        current_high_bidder_id UUID REFERENCES users(id),
        
        status auction_status DEFAULT 'active' NOT NULL,
        
        start_time TIMESTAMP DEFAULT NOW() NOT NULL,
        end_time TIMESTAMP NOT NULL,
        
        total_bids INTEGER DEFAULT 0,
        unique_bidders INTEGER DEFAULT 0,
        
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    console.log('  ✓ Auctions table created');
    
    // Create AUCTION_BIDS table
    console.log('📝 Creating auction_bids table...');
    await db.execute(sql`
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
      )
    `);
    console.log('  ✓ Auction_bids table created');
    
    // Create FORUMS table
    console.log('📝 Creating forums table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS forums (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category forum_category NOT NULL,
        thread_title TEXT NOT NULL,
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        
        is_pinned BOOLEAN DEFAULT FALSE,
        is_locked BOOLEAN DEFAULT FALSE,
        
        view_count INTEGER DEFAULT 0,
        reply_count INTEGER DEFAULT 0,
        
        last_post_id UUID,
        last_post_at TIMESTAMP,
        
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    console.log('  ✓ Forums table created');
    
    // Create FORUM_POSTS table
    console.log('📝 Creating forum_posts table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS forum_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        thread_id UUID NOT NULL REFERENCES forums(id) ON DELETE CASCADE,
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        
        post_content TEXT NOT NULL,
        parent_post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
        
        upvotes INTEGER DEFAULT 0,
        downvotes INTEGER DEFAULT 0,
        
        is_edited BOOLEAN DEFAULT FALSE,
        edited_at TIMESTAMP,
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMP,
        
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    console.log('  ✓ Forum_posts table created');
    
    // Create indexes
    console.log('📊 Creating indexes...');
    
    // Offers indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS offers_seller_status_idx ON offers (seller_id, status)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS offers_buyer_idx ON offers (buyer_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS offers_book_idx ON offers (book_id)`);
    
    // Auctions indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS auctions_status_idx ON auctions (status)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS auctions_end_time_idx ON auctions (end_time)`);
    
    // Auction_bids indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS auction_bids_auction_idx ON auction_bids (auction_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS auction_bids_bidder_idx ON auction_bids (bidder_id)`);
    
    // Forums indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS forums_category_idx ON forums (category)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS forums_last_post_idx ON forums (last_post_at)`);
    
    // Forum_posts indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS forum_posts_thread_idx ON forum_posts (thread_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS forum_posts_author_idx ON forum_posts (author_id)`);
    
    console.log('  ✓ All indexes created');
    
    // Create triggers
    console.log('⚙️  Creating triggers...');
    
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);
    
    await db.execute(sql`DROP TRIGGER IF EXISTS update_offers_updated_at ON offers`);
    await db.execute(sql`
      CREATE TRIGGER update_offers_updated_at 
      BEFORE UPDATE ON offers 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    
    await db.execute(sql`DROP TRIGGER IF EXISTS update_auctions_updated_at ON auctions`);
    await db.execute(sql`
      CREATE TRIGGER update_auctions_updated_at 
      BEFORE UPDATE ON auctions 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    
    await db.execute(sql`DROP TRIGGER IF EXISTS update_forums_updated_at ON forums`);
    await db.execute(sql`
      CREATE TRIGGER update_forums_updated_at 
      BEFORE UPDATE ON forums 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    
    await db.execute(sql`DROP TRIGGER IF EXISTS update_forum_posts_updated_at ON forum_posts`);
    await db.execute(sql`
      CREATE TRIGGER update_forum_posts_updated_at 
      BEFORE UPDATE ON forum_posts 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    
    console.log('  ✓ All triggers created');
    
    console.log('\n✅ Marketplace schema expansion completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

if (require.main === module) {
  completeMarketplaceMigration()
    .then(() => {
      console.log('🎉 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

export { completeMarketplaceMigration };
