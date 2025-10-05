import { db } from './client';
import { sql } from 'drizzle-orm';

async function migrate() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Create enums
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'both', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE book_condition AS ENUM ('new', 'like-new', 'very-good', 'good', 'acceptable');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE book_status AS ENUM ('draft', 'active', 'pending', 'sold', 'removed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE transaction_status AS ENUM ('pending', 'authorized', 'shipped', 'delivered', 'completed', 'disputed', 'refunded', 'cancelled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role user_role DEFAULT 'buyer' NOT NULL,
        seller_verified BOOLEAN DEFAULT false,
        stripe_account_id TEXT,
        stripe_account_status TEXT,
        display_name TEXT,
        avatar_url TEXT,
        bio TEXT,
        location TEXT,
        email_verified BOOLEAN DEFAULT false,
        refresh_token TEXT,
        stripe_customer_id TEXT,
        payment_method_id TEXT,
        subscription_status TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Create books table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS books (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID REFERENCES users(id) NOT NULL,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT,
        description TEXT,
        series_name TEXT,
        series_number INTEGER,
        tropes JSONB DEFAULT '[]',
        spice_level INTEGER,
        condition book_condition NOT NULL,
        condition_notes TEXT,
        price_cents INTEGER NOT NULL,
        shipping_price_cents INTEGER DEFAULT 0,
        local_pickup_available BOOLEAN DEFAULT false,
        is_special_edition BOOLEAN DEFAULT false,
        special_edition_details JSONB,
        status book_status DEFAULT 'draft' NOT NULL,
        view_count INTEGER DEFAULT 0,
        slug TEXT UNIQUE,
        published_at TIMESTAMP,
        sold_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Create book_images table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS book_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
        cloudinary_url TEXT NOT NULL,
        cloudinary_public_id TEXT NOT NULL,
        alt_text TEXT,
        is_primary BOOLEAN DEFAULT false,
        "order" INTEGER DEFAULT 0,
        width INTEGER,
        height INTEGER,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Create transactions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        book_id UUID REFERENCES books(id) NOT NULL,
        buyer_id UUID REFERENCES users(id) NOT NULL,
        seller_id UUID REFERENCES users(id) NOT NULL,
        book_price_cents INTEGER NOT NULL,
        shipping_price_cents INTEGER DEFAULT 0,
        platform_fee_cents INTEGER NOT NULL,
        seller_payout_cents INTEGER NOT NULL,
        total_cents INTEGER NOT NULL,
        stripe_payment_intent_id TEXT,
        stripe_transfer_id TEXT,
        stripe_refund_id TEXT,
        status transaction_status DEFAULT 'pending' NOT NULL,
        authorized_at TIMESTAMP,
        shipped_at TIMESTAMP,
        delivered_at TIMESTAMP,
        inspection_ends_at TIMESTAMP,
        completed_at TIMESTAMP,
        disputed_at TIMESTAMP,
        shipping_method TEXT,
        tracking_number TEXT,
        tracking_carrier TEXT,
        pickup_location TEXT,
        pickup_scheduled_at TIMESTAMP,
        pickup_confirmed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Create reviews table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        transaction_id UUID REFERENCES transactions(id) UNIQUE NOT NULL,
        reviewer_id UUID REFERENCES users(id) NOT NULL,
        reviewed_user_id UUID REFERENCES users(id) NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        condition_accurate BOOLEAN,
        shipping_speed INTEGER,
        communication INTEGER,
        seller_response TEXT,
        seller_responded_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Create wishlists table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS wishlists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) NOT NULL,
        book_id UUID REFERENCES books(id) NOT NULL,
        notify_on_price_drop BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Create messages table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        transaction_id UUID REFERENCES transactions(id),
        sender_id UUID REFERENCES users(id) NOT NULL,
        recipient_id UUID REFERENCES users(id) NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Create indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS books_seller_status_idx ON books(seller_id, status);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS books_title_idx ON books(title);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS books_author_idx ON books(author);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS transactions_buyer_idx ON transactions(buyer_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS transactions_seller_idx ON transactions(seller_id);`);

    console.log('✅ Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

if (require.main === module) {
  migrate()
    .then(() => {
      console.log('🎉 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

export { migrate };
