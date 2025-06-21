import redisClient from '../lib/redis-client';

async function fixUsersSet() {
  try {
    console.log('🔧 Fixing Redis users set...');
    
    // Get all actual user keys
    const userKeys = await redisClient.keys('user:*');
    const actualUserKeys = userKeys.filter(key => key.match(/^user:[^:]+$/));
    console.log('Found user keys:', actualUserKeys);
    
    // Clear the current users set
    await redisClient.del('users');
    console.log('Cleared existing users set');
    
    // Add proper user IDs to the set
    for (const userKey of actualUserKeys) {
      const userId = userKey.replace('user:', '');
      await redisClient.sadd('users', userId);
      console.log(`Added ${userId} to users set`);
    }
    
    // Verify the fixed set
    const updatedUsersSet = await redisClient.smembers('users');
    console.log('Fixed users set:', updatedUsersSet);
    
    console.log('\n✅ Users set fix completed');
    
  } catch (error) {
    console.error('❌ Error fixing users set:', error);
  }
}

fixUsersSet();
