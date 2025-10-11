// Run the notifications migration with proper statement splitting
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env.local') });

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in the environment');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const migrationPath = path.join(__dirname, '../migrations/004-notifications.sql');
  
  console.log('🚀 Running notifications migration...');
  console.log('📂 Migration file:', migrationPath);

  try {
    // Create notification type enum
    console.log('📝 Creating notification_type enum...');
    await sql`
      DO $$ BEGIN
        CREATE TYPE notification_type AS ENUM (
          'offer_received',
          'offer_accepted',
          'offer_rejected',
          'offer_countered',
          'message_received',
          'book_sold'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log('✅ notification_type enum created');

    // Create related type enum
    console.log('📝 Creating notification_related_type enum...');
    await sql`
      DO $$ BEGIN
        CREATE TYPE notification_related_type AS ENUM (
          'offer',
          'transaction',
          'message',
          'book'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log('✅ notification_related_type enum created');

    // Create notifications table
    console.log('📝 Creating notifications table...');
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type notification_type NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        related_id UUID,
        related_type notification_related_type,
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log('✅ notifications table created');

    // Create indexes
    console.log('📝 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(is_read)`;
    await sql`CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS notifications_user_read_idx ON notifications(user_id, is_read)`;
    await sql`CREATE INDEX IF NOT EXISTS notifications_user_created_idx ON notifications(user_id, created_at DESC)`;
    console.log('✅ All indexes created');

    console.log('🎉 Notifications migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

main();

