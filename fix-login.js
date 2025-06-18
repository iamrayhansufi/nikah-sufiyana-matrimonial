// Script to fix login issues by directly updating a user's password in the database
const bcrypt = require('bcryptjs');
const { db } = require('./src/db');
const { users } = require('./src/db/schema');
const { eq } = require('drizzle-orm');
require('dotenv').config();

// This script reset a user's password
// 1. First argument is email
// 2. Second argument is new password

async function fixPassword() {
  if (process.argv.length < 4) {
    console.error('Usage: node fix-login.js <email> <new_password>');
    process.exit(1);
  }

  const email = process.argv[2];
  const newPassword = process.argv[3];

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
    
    // Hash new password
    console.log('🔑 Hashing new password...');
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update user in database
    console.log('📝 Updating user password in database...');
    await db
      .update(users)
      .set({ 
        password: hashedPassword,
        verified: true,  // Also ensure user is verified
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));
    
    console.log('✅ Password has been updated successfully');
    console.log('✅ User has been marked as verified');
    console.log(`\n🔐 You can now login with email: ${email} and your new password.`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

fixPassword();
