// Script to reset a user's password for testing
const { db } = require('./src/db');
const { users } = require('./src/db/schema');
const { eq } = require('drizzle-orm');
const bcrypt = require('bcryptjs');

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error('Usage: node reset-password.js <email> <newPassword>');
  process.exit(1);
}

async function runScript() {
  try {
    console.log(`🔍 Looking up user with email: ${email}`);
    
    // Find user
    const userArr = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (!userArr || userArr.length === 0) {
      console.error(`❌ No user found with email: ${email}`);
      process.exit(1);
    }
    
    const user = userArr[0];
    console.log('📋 User found:', {
      id: user.id,
      email: user.email,
      fullName: user.fullName
    });
    
    // Hash the new password
    console.log('🔑 Hashing new password...');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password in database
    console.log('🔄 Updating password in database...');
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, user.id));
    
    console.log('✅ Password updated successfully!');
    console.log('🔐 User can now log in with the new password');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

runScript();
