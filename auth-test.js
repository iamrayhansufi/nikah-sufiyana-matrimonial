// Simple test script for user authentication and password reset

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const email = process.argv[2];
const action = process.argv[3] || 'test';
const newPassword = process.argv[4];

async function runScript() {
  const client = await pool.connect();
  
  try {
    console.log(`🔍 Looking up user with email: ${email}`);
    
    // Query to find user by email
    const userQuery = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
    const userResult = await client.query(userQuery, [email]);
    
    if (userResult.rows.length === 0) {
      console.error(`❌ No user found with email: ${email}`);
      return;
    }
    
    const user = userResult.rows[0];
    
    // Print user details
    console.log('📋 User found:', {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      verified: user.verified,
      hashedPasswordLength: user.password?.length || 0
    });
    
    // Handle actions
    if (action === 'test') {
      // Just show user info
      console.log('ℹ️ User verification status:', user.verified ? 'VERIFIED' : 'NOT VERIFIED');
      
    } else if (action === 'verify') {
      // Set user as verified
      await client.query(
        'UPDATE users SET verified = true WHERE id = $1',
        [user.id]
      );
      console.log('✅ User marked as VERIFIED');
      
    } else if (action === 'unverify') {
      // Set user as unverified
      await client.query(
        'UPDATE users SET verified = false WHERE id = $1',
        [user.id]
      );
      console.log('✅ User marked as NOT VERIFIED');
      
    } else if (action === 'reset-password' && newPassword) {
      // Reset password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      await client.query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [hashedPassword, user.id]
      );
      console.log('🔐 Password updated successfully!');
      
    } else if (action === 'check-password' && newPassword) {
      // Check if password matches
      const isValid = await bcrypt.compare(newPassword, user.password);
      console.log('🔑 Password check result:', isValid ? 'VALID' : 'INVALID');
    }
    
    // Get updated user data if we made changes
    if (action !== 'test' && action !== 'check-password') {
      const updatedResult = await client.query(userQuery, [email]);
      if (updatedResult.rows.length > 0) {
        const updatedUser = updatedResult.rows[0];
        console.log('📋 Updated user data:', {
          id: updatedUser.id,
          email: updatedUser.email,
          verified: updatedUser.verified
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    pool.end();
  }
}

if (!email) {
  console.error('Usage: node auth-test.js <email> [test|verify|unverify|reset-password|check-password] [newPassword]');
} else {
  runScript();
}
