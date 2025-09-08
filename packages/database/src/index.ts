// Re-export drizzle-orm utilities
export { eq, and, or, sql } from 'drizzle-orm';
export { drizzle } from 'drizzle-orm/neon-http';

// Export your database schema and client
export * from '../schema';
export * from '../client';
