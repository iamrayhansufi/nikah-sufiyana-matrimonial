import { database } from '../lib/database-service';
import { redisTables } from '../lib/redis-client';

async function cleanupIncompleteUsers() {
  console.log('🧹 Cleaning up incomplete users in Redis...\n');
  
  try {
    // Get all user IDs
    const allUserIds = await database.users.getAllUserIds();
    console.log(`Found ${allUserIds.length} users in Redis`);
    
    let completeUsers = 0;
    let incompleteUsers = 0;
    let usersToDelete = [];
    
    // Check each user
    for (const userId of allUserIds) {
      const userIdStr = String(userId);
      const userData = await database.users.getById(userIdStr);
      
      if (!userData) {
        console.log(`⚠️  User ${userIdStr} not found`);
        usersToDelete.push(userIdStr);
        continue;
      }
      
      // Check for essential fields
      const requiredFields = ['fullName', 'email', 'gender', 'age'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        console.log(`❌ User ${userIdStr} missing fields: ${missingFields.join(', ')}`);
        usersToDelete.push(userIdStr);
        incompleteUsers++;
      } else {
        console.log(`✅ User ${userIdStr} is complete`);
        completeUsers++;
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`- Complete users: ${completeUsers}`);
    console.log(`- Incomplete users: ${incompleteUsers}`);
    console.log(`- Users to delete: ${usersToDelete.length}`);
    
    if (usersToDelete.length > 0) {
      console.log('\n🗑️  Deleting incomplete users...');
      
      for (const userId of usersToDelete) {
        try {          // Delete from Redis
          await redisTables.users.delete(userId);
          console.log(`✅ Deleted user: ${userId}`);
        } catch (error) {
          console.error(`❌ Failed to delete user ${userId}:`, error);
        }
      }
    }
    
    // Verify cleanup
    const remainingUsers = await database.users.getAllUserIds();
    console.log(`\n✅ Cleanup complete. Remaining users: ${remainingUsers.length}`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupIncompleteUsers().catch(console.error);
