// Debug script for checking password hashing issues
const bcrypt = require('bcryptjs');
const { db } = require('./src/db');
const { users } = require('./src/db/schema');
const { eq } = require('drizzle-orm');
require('dotenv').config();

// This script allows inspecting password hashes and testing password comparisons
// 1. First argument is email
// 2. Second argument is password to test

async function debugPassword() {
  if (process.argv.length < 4) {
    console.error('Usage: node debug-password.js <email> <password>');
    process.exit(1);
  }

  const email = process.argv[2];
  const password = process.argv[3];

  try {
    console.log(`🔍 Looking up user with email: ${email}`);
    
    // Get user from database
    const userArr = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!userArr || userArr.length === 0) {
      console.error(`❌ No user found with email: ${email}`);
      process.exit(1);
    }
    
    const user = userArr[0];
    console.log(`✅ User found: ${user.fullName} (ID: ${user.id})`);
    
    // Password info
    console.log('\n🔑 Password Information:');
    console.log(`- Stored hash exists: ${!!user.password}`);
    console.log(`- Hash length: ${user.password ? user.password.length : 0}`);
    console.log(`- Hash preview: ${user.password ? user.password.substring(0, 20) + '...' : 'N/A'}`);
    
    // Create new hash with provided password for comparison
    const newHash = await bcrypt.hash(password, 12);
    console.log(`- New hash from input: ${newHash.substring(0, 20)}...`);
    
    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    console.log(`\n🔒 Password validation result: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
    
    if (!isValid) {
      // Generate a new hash for this password to update if needed
      console.log('\n⚠️ Password didn\'t match. Here\'s a new hash you can use to update:');
      console.log(newHash);
      
      // Offer SQL to fix it
      console.log('\n🔧 SQL to update password:');
      console.log(`UPDATE users SET password = '${newHash}' WHERE id = ${user.id};`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

debugPassword();
