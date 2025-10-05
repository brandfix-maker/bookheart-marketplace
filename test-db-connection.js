// Simple database connection test
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing database connection...');
console.log('🔗 DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment');
  process.exit(1);
}

// Test the database connection
async function testConnection() {
  try {
    const { neon } = require('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('🔍 Executing test query...');
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    console.log('📊 Test result:', result);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
