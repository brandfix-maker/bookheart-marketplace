import { db } from './client';
import { sql } from 'drizzle-orm';

async function runMigration() {
  try {
    console.log('🚀 Starting universal accounts migration...');
    
    // Add new activity tracking columns
    console.log('📝 Adding activity tracking columns...');
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS has_made_purchase BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS has_listed_item BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS last_buyer_activity TIMESTAMP,
      ADD COLUMN IF NOT EXISTS last_seller_activity TIMESTAMP,
      ADD COLUMN IF NOT EXISTS seller_onboarding_completed BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS registration_survey JSONB
    `);
    console.log('✅ Activity tracking columns added');

    // Update existing users based on their current role
    console.log('🔄 Updating existing users...');
    await db.execute(sql`
      UPDATE users 
      SET 
        has_made_purchase = CASE 
          WHEN role = 'buyer' OR role = 'both' THEN TRUE 
          ELSE FALSE 
        END,
        has_listed_item = CASE 
          WHEN role = 'seller' OR role = 'both' THEN TRUE 
          ELSE FALSE 
        END,
        seller_onboarding_completed = CASE 
          WHEN role = 'seller' OR role = 'both' THEN TRUE 
          ELSE FALSE 
        END
      WHERE role IS NOT NULL
    `);
    console.log('✅ Existing users updated');

    // Set activity timestamps for existing users
    console.log('⏰ Setting activity timestamps...');
    await db.execute(sql`
      UPDATE users 
      SET 
        last_buyer_activity = CASE 
          WHEN role = 'buyer' OR role = 'both' THEN created_at 
          ELSE NULL 
        END,
        last_seller_activity = CASE 
          WHEN role = 'seller' OR role = 'both' THEN created_at 
          ELSE NULL 
        END
      WHERE role IS NOT NULL
    `);
    console.log('✅ Activity timestamps set');

    // Add indexes for performance
    console.log('📊 Creating performance indexes...');
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_users_activity_tracking ON users(has_made_purchase, has_listed_item)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_users_seller_status ON users(seller_onboarding_completed, seller_verified)`);
    console.log('✅ Performance indexes created');

    console.log('🎉 Universal accounts migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('🎉 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

export { runMigration };
