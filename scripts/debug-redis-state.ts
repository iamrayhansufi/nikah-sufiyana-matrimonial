import { redis } from '../lib/redis-client';

async function debugRedisState() {
  console.log('🔍 Debugging Redis state for user issue...\n');
  
  try {
    const problemUserId = '1750487572658-s0l035761sn';
    const email = 'contact.rayhansufi@gmail.com';
    
    console.log('1. Checking users set...');
    const allUserIds = await redis.smembers('users');
    console.log(`Found ${allUserIds.length} user IDs in set:`, allUserIds);
    
    const isInSet = allUserIds.includes(problemUserId);
    console.log(`Is problem user ${problemUserId} in users set: ${isInSet}`);
    
    console.log('\n2. Checking direct user key...');
    const userData = await redis.hgetall(`user:${problemUserId}`);
    console.log(`user:${problemUserId} data:`, userData);
      console.log('\n3. Checking all user data...');
    for (const userId of allUserIds) {
      const user = await redis.hgetall(`user:${userId}`);
      const keys = Object.keys(user || {});
      console.log(`User ${userId}: ${keys.length} fields`);
      if (user && user.email === email) {
        console.log(`  ⚠️  FOUND EMAIL MATCH: ${user.email}`);
        console.log(`  User data:`, user);
      }
    }
    
    console.log('\n4. Manual email search...');
    for (const userId of allUserIds) {
      const user = await redis.hgetall(`user:${userId}`);
      if (user && user.email && user.email === email) {
        console.log(`Email ${email} found in user: ${userId}`);
        console.log('Full user data:', user);
      }
    }
    
  } catch (error) {
    console.error('❌ Error debugging Redis state:', error);
  }
}

debugRedisState().catch(console.error);
