import { redis } from '../lib/redis-client';

async function checkRedis() {
  console.log('🔍 Checking Redis connection and data...\n');
  
  try {
    // Test connection
    console.log('1. Testing Redis connection...');
    const ping = await redis.ping();
    console.log('✅ Redis ping:', ping);
    
    // Get all keys
    console.log('\n2. Getting all keys...');
    const allKeys = await redis.keys('*');
    console.log(`Found ${allKeys.length} keys:`, allKeys.slice(0, 10));
    
    // Check users set
    console.log('\n3. Checking users set...');
    const userIds = await redis.smembers('users');
    console.log(`Found ${userIds.length} user IDs:`, userIds);
    
    // Check a few user records
    console.log('\n4. Checking user records...');
    for (const userId of userIds.slice(0, 3)) {
      const userData = await redis.hgetall(`user:${userId}`);
      console.log(`\nUser ${userId}:`, Object.keys(userData || {}));
      if (userData && userData.email) {
        console.log(`  Email: ${userData.email}`);
        console.log(`  Name: ${userData.name || userData.firstName} ${userData.lastName || ''}`);
        console.log(`  Profile Photo: ${userData.profilePhoto || 'none'}`);
        console.log(`  Photos: ${userData.photos || 'none'}`);
        console.log(`  Image: ${userData.image || 'none'}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkRedis().catch(console.error);
