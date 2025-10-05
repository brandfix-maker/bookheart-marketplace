import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';

// Enable fetching in Node.js environment
neonConfig.fetchConnectionCache = true;

// Lazy initialization to avoid connection issues during module import
let _db: ReturnType<typeof drizzle> | null = null;

export const getDb = () => {
  if (!_db) {
    console.log('🔗 Database: Initializing connection...');
    console.log('🔗 Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

    if (!process.env.DATABASE_URL) {
      console.error('❌ Database: DATABASE_URL environment variable is not set!');
      throw new Error('DATABASE_URL environment variable is required');
    }

    const sql = neon(process.env.DATABASE_URL) as any;
    _db = drizzle(sql, { schema });
    console.log('✅ Database: Connection initialized successfully');
  }
  return _db;
};

// For backward compatibility
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  }
});

export type DbClient = typeof db;
