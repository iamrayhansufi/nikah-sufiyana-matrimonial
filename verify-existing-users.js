// Script to automatically verify all existing users who don't have verification status set
// This helps with the transition from unverified to verified for existing users

import { db } from './src/db';
import { users } from './src/db/schema';
import { eq, isNull, or } from 'drizzle-orm';

async function verifyExistingUsers() {
  try {
    console.log('🔍 Finding users who need verification status updated...');
    
    // Find users who are either not verified or have null verification status
    const unverifiedUsers = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        verified: users.verified,
        createdAt: users.createdAt
      })
      .from(users)
      .where(
        or(
          eq(users.verified, false),
          isNull(users.verified)
        )
      );
    
    console.log(`📊 Found ${unverifiedUsers.length} users who need verification status updated`);
    
    if (unverifiedUsers.length === 0) {
      console.log('✅ All users are already verified!');
      return;
    }
    
    // Show a few examples
    console.log('\n📋 Sample users to be updated:');
    unverifiedUsers.slice(0, 5).forEach(user => {
      console.log(`- ${user.fullName} (${user.email}) - verified: ${user.verified} - created: ${user.createdAt}`);
    });
    
    if (unverifiedUsers.length > 5) {
      console.log(`... and ${unverifiedUsers.length - 5} more`);
    }
    
    // Ask for confirmation (in a real scenario, you might want to add this)
    console.log('\n🔄 Updating verification status for existing users...');
    
    // Update all unverified users to verified
    const updateResult = await db
      .update(users)
      .set({ 
        verified: true,
        updatedAt: new Date()
      })
      .where(
        or(
          eq(users.verified, false),
          isNull(users.verified)
        )
      );
    
    console.log('✅ Update completed successfully!');
    
    // Verify the update worked
    const verifiedCount = await db
      .select({ count: users.id })
      .from(users)
      .where(eq(users.verified, true));
    
    console.log(`📊 Total verified users: ${verifiedCount.length}`);
    console.log('\n🎉 All existing users have been marked as verified!');
    
  } catch (error) {
    console.error('❌ Error updating user verification status:', error);
  } finally {
    process.exit(0);
  }
}

verifyExistingUsers();
