const { Pool } = require('pg');
require('dotenv').config({ path: './env.local' });

async function testDatabaseDirect() {
  console.log('🔍 Testing database connection directly...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('📡 Connecting to database...');
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    
    // Test basic query
    console.log('🔍 Testing basic query...');
    const result = await client.query('SELECT 1 as test');
    console.log('✅ Basic query successful:', result.rows[0]);
    
    // Test users table
    console.log('🔍 Testing users table...');
    const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
    console.log('✅ Users table accessible, count:', usersResult.rows[0].count);
    
    // Test inserting a user
    console.log('🔍 Testing user insertion...');
    const insertResult = await client.query(`
      INSERT INTO users (email, username, password_hash, role, display_name) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, email, username
    `, ['test@example.com', 'testuser', 'hashedpassword', 'buyer', 'testuser']);
    
    console.log('✅ User inserted successfully:', insertResult.rows[0]);
    
    // Clean up
    await client.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
    console.log('🧹 Test user cleaned up');
    
    client.release();
    await pool.end();
    console.log('✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    await pool.end();
  }
}

testDatabaseDirect();
