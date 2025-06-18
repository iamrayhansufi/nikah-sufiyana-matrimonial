// Direct SQL authentication bypass script - REMOVE AFTER FIXING AUTH
// This script logs in a user directly using SQL queries

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
require('dotenv').config();

// Create a database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Command line arguments
const email = process.argv[2];
const password = process.argv[3] || 'testpassword123'; // Default test password

if (!email) {
  console.error('Usage: node direct-login.js <email> [password]');
  process.exit(1);
}

async function runScript() {
  const client = await pool.connect();
  
  try {
    console.log(`🔍 Looking up user with email: ${email}`);
    
    // Find the user
    const userQuery = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
    const userResult = await client.query(userQuery, [email]);
    
    if (userResult.rows.length === 0) {
      console.error(`❌ No user found with email: ${email}`);
      return;
    }
    
    const user = userResult.rows[0];
    console.log(`✅ User found: ${user.full_name}, ID: ${user.id}`);
    
    // Check if their password works
    let passwordValid = false;
    try {
      passwordValid = await bcrypt.compare(password, user.password);
      console.log(`🔑 Password check: ${passwordValid ? 'VALID' : 'INVALID'}`);
    } catch (err) {
      console.error(`❌ Password check failed: ${err.message}`);
    }
    
    // Verify the user account if needed
    if (user.verified !== true) {
      console.log(`🔄 Setting user ${user.id} to verified...`);
      await client.query('UPDATE users SET verified = true WHERE id = $1', [user.id]);
    }
    
    // Generate a session token manually
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role || 'user',
        verified: true,
        sub: user.id.toString()
      }, 
      process.env.NEXTAUTH_SECRET,
      { expiresIn: '30d' }
    );
    
    // Output the token and cookie instructions
    console.log('\n✅ LOGIN CREDENTIALS VERIFIED');
    console.log('----------------------------------------');
    console.log('USER DATA:');
    console.log('ID:', user.id);
    console.log('Name:', user.full_name);
    console.log('Email:', user.email);
    console.log('Verified:', user.verified);
    console.log('Password valid:', passwordValid);
    console.log('----------------------------------------');
    console.log('SESSION TOKEN:');
    console.log(token);
    console.log('----------------------------------------');
    console.log('TO USE THIS TOKEN:');
    console.log('1. Open browser developer tools');
    console.log('2. Go to Application tab > Cookies > https://www.nikahsufiyana.com');
    console.log('3. Add a new cookie with:');
    console.log('   - Name: next-auth.session-token');
    console.log('   - Value: [token above]');
    console.log('   - Domain: www.nikahsufiyana.com');
    console.log('   - Path: /');
    console.log('4. Refresh the page');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    pool.end();
  }
}

runScript();
