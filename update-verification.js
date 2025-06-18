// Debug script to check and manually update user verification status
import { db } from './src/db';
import { users } from './src/db/schema';
import { eq } from 'drizzle-orm';

const email = process.argv[2];
const action = process.argv[3] || 'check';

if (!email) {
  console.error('Usage: node update-verification.js <email> [check|verify|unverify]');
  process.exit(1);
}

async function runScript() {
  try {
    console.log(`📋 Looking up user with email: ${email}`);
    
    // Get current user data
    const userData = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        verified: users.verified
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (!userData || userData.length === 0) {
      console.error(`❌ No user found with email: ${email}`);
      process.exit(1);
    }
    
    const user = userData[0];
    console.log('📋 Current user data:');
    console.log(JSON.stringify(user, null, 2));
    
    if (action === 'check') {
      console.log(`✅ Verification status: ${user.verified ? 'VERIFIED' : 'NOT VERIFIED'}`);
    } 
    else if (action === 'verify') {
      console.log('🔄 Setting verification status to TRUE...');
      await db
        .update(users)
        .set({ verified: true })
        .where(eq(users.id, user.id));
      
      console.log('✅ User marked as VERIFIED');
    }
    else if (action === 'unverify') {
      console.log('🔄 Setting verification status to FALSE...');
      await db
        .update(users)
        .set({ verified: false })
        .where(eq(users.id, user.id));
      
      console.log('✅ User marked as NOT VERIFIED');
    }
    
    // Get updated user data
    if (action !== 'check') {
      const updatedUserData = await db
        .select({
          id: users.id,
          email: users.email,
          verified: users.verified
        })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);
      
      console.log('📋 Updated user data:');
      console.log(JSON.stringify(updatedUserData[0], null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

runScript();
