import { db } from '@bookheart/database';

// Export the database instance for use throughout the API
export { db };

// Helper function to check database connection
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    // Simple query to check connection
    await db.execute('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};
