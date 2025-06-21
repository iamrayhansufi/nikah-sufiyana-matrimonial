import { redis } from '../lib/redis-client';

async function fixAllDoublePrefixes() {
  console.log('🔧 Checking for and fixing all double prefix issues...\n');
  
  try {
    console.log('1. Scanning for double prefix keys...');
    const doubleKeys = await redis.keys('user:user:*');
    console.log(`Found ${doubleKeys.length} keys with double prefix:`, doubleKeys);
    
    if (doubleKeys.length === 0) {
      console.log('✅ No double prefix issues found');
      return;
    }
    
    for (const wrongKey of doubleKeys) {
      console.log(`\n🔧 Fixing ${wrongKey}...`);
      
      // Extract the correct key by removing the extra "user:" prefix
      const correctKey = wrongKey.replace('user:user:', 'user:');
      console.log(`Correct key should be: ${correctKey}`);
        // Get data from wrong key
      const userData = await redis.hgetall(wrongKey);
      const fieldCount = Object.keys(userData || {}).length;
      console.log(`Found ${fieldCount} fields in wrong key`);
      
      if (fieldCount > 0 && userData) {
        // Copy to correct key
        await redis.hset(correctKey, userData);
        console.log(`✅ Data copied to ${correctKey}`);
        
        // Delete wrong key
        await redis.del(wrongKey);
        console.log(`✅ Deleted wrong key ${wrongKey}`);
        
        // Verify
        const verifyData = await redis.hgetall(correctKey);
        console.log(`✅ Verified: ${Object.keys(verifyData || {}).length} fields in correct key`);
      }
    }
    
    console.log('\n✅ All double prefix issues fixed');
    
    // Test database service with all users
    console.log('\n🧪 Testing database service...');
    const { database } = await import('../lib/database-service');
    const allUserIds = await database.users.getAllUserIds();
    console.log(`Found ${allUserIds.length} users in set`);
    
    let workingUsers = 0;
    for (const userId of allUserIds) {
      const user = await database.users.getById(String(userId));
      if (user && user.email) {
        workingUsers++;
        console.log(`✅ ${user.email} - ${user.verified ? 'verified' : 'unverified'}`);
      } else {
        console.log(`❌ User ID ${userId} - no data or incomplete`);
      }
    }
    
    console.log(`\n📊 Summary: ${workingUsers}/${allUserIds.length} users working correctly`);
    
  } catch (error) {
    console.error('❌ Error fixing double prefixes:', error);
  }
}

fixAllDoublePrefixes().catch(console.error);
