import { redis } from '../lib/redis-client';

async function cleanupUsersSet() {
  console.log('🧹 Cleaning up users set in Redis...\n');
  
  try {
    console.log('1. Getting all user IDs from users set...');
    const allUserIds = await redis.smembers('users');
    console.log(`Found ${allUserIds.length} user IDs in set`);
    
    let validUsers = 0;
    let invalidUsers = 0;
    const usersToRemove = [];
    
    console.log('\n2. Checking each user ID...');
    for (const userId of allUserIds) {
      try {
        const userData = await redis.hgetall(`user:${userId}`);
        
        if (!userData || Object.keys(userData).length === 0) {
          console.log(`❌ Invalid user: ${userId} (no data)`);
          usersToRemove.push(userId);
          invalidUsers++;
        } else {
          console.log(`✅ Valid user: ${userId} (${Object.keys(userData).length} fields)`);
          validUsers++;
        }
      } catch (error) {
        console.log(`❌ Error checking user ${userId}:`, error);
        usersToRemove.push(userId);
        invalidUsers++;
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`- Valid users: ${validUsers}`);
    console.log(`- Invalid users: ${invalidUsers}`);
    console.log(`- Users to remove from set: ${usersToRemove.length}`);
    
    if (usersToRemove.length > 0) {
      console.log('\n🗑️  Removing invalid user IDs from users set...');
      for (const userId of usersToRemove) {
        await redis.srem('users', userId);
        console.log(`✅ Removed ${userId} from users set`);
      }
    }
    
    console.log('\n✅ Users set cleanup complete');
    
    // Verify the final state
    const finalUserIds = await redis.smembers('users');
    console.log(`Final users set contains ${finalUserIds.length} user IDs`);
    
    return finalUserIds;
    
  } catch (error) {
    console.error('❌ Error cleaning up users set:', error);
  }
}

cleanupUsersSet().catch(console.error);
