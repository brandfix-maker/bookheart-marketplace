// Re-export the database client from the shared package
export { db, getDb } from '@bookheart/database';

// Helper function to check database connection
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Database: Testing connection...');
    // Simple query to check connection using the shared client
    const { db, users } = await import('@bookheart/database');
    // Use a simple select query instead of raw SQL to avoid version conflicts
    await db.select().from(users).limit(1);
    console.log('✅ Database: Connection test successful');
    return true; // If we can query, connection is working
  } catch (error) {
    console.error('❌ Database: Connection test failed:', error);
    return false;
  }
};
