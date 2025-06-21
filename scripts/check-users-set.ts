import redisClient from '../lib/redis-client';

async function checkUsersSet() {
  try {
    console.log('🔍 Checking Redis users set...');
    
    // Check what's in the users set
    const usersSet = await redisClient.smembers('users');
    console.log('Users set contains:', usersSet);
    
    // Check what user keys actually exist
    const userKeys = await redisClient.keys('user:*');
    const actualUserKeys = userKeys.filter(key => key.match(/^user:[^:]+$/));
    console.log('Actual user keys:', actualUserKeys);
    
    // Check if the users set matches the actual keys
    console.log('\n🔍 Checking data consistency:');
    
    for (const userKey of actualUserKeys) {
      const userId = userKey.replace('user:', '');
      const isInSet = usersSet.includes(userId);
      console.log(`  ${userKey}: ${isInSet ? '✅ In set' : '❌ Not in set'}`);
      
      if (!isInSet) {
        console.log(`    Adding ${userId} to users set...`);
        await redisClient.sadd('users', userId);
      }
    }
    
    // Check users set again
    const updatedUsersSet = await redisClient.smembers('users');
    console.log('\nUpdated users set:', updatedUsersSet);
    
    console.log('\n✅ Users set check completed');
    
  } catch (error) {
    console.error('❌ Error checking users set:', error);
  }
}

checkUsersSet();
