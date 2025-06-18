// Basic database connection test script
require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Testing database connection...');
    
    await client.connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const res = await client.query('SELECT NOW() as time');
    console.log('✅ Query executed successfully. Server time:', res.rows[0].time);
    
    // Check for the test user
    const email = 'contact.rayhansufi@gmail.com';
    console.log(`Checking for user with email: ${email}`);
    
    const userResult = await client.query(
      'SELECT id, email, full_name, verified, length(password) as password_length FROM users WHERE email = $1',
      [email]
    );
    
    if (userResult.rows.length === 0) {
      console.log(`⚠️ User with email ${email} not found in database!`);
    } else {
      const user = userResult.rows[0];
      console.log('✅ User found:', {
        id: user.id,
        email: user.email,
        name: user.full_name,
        verified: user.verified,
        passwordLength: user.password_length
      });
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

testConnection();
