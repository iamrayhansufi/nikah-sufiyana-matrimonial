import { redis } from '../lib/redis-client';

async function directRedisCheck() {
  console.log('🔍 Direct Redis check for user...\n');
  
  try {
    const userId = 'user:1750487572658-s0l035761sn';
    const cleanId = '1750487572658-s0l035761sn';
    
    console.log('1. Checking with full user ID...');
    const userData1 = await redis.hgetall(userId);
    console.log(`${userId}:`, Object.keys(userData1 || {}));
    
    console.log('\n2. Checking with user: prefix...');
    const userData2 = await redis.hgetall(`user:${userId}`);
    console.log(`user:${userId}:`, Object.keys(userData2 || {}));
    
    console.log('\n3. Checking with clean ID...');
    const userData3 = await redis.hgetall(`user:${cleanId}`);
    console.log(`user:${cleanId}:`, Object.keys(userData3 || {}));
    
    console.log('\n4. Testing database service method...');
    const { database } = await import('../lib/database-service');
    const dbResult = await database.users.getById(userId);
    console.log('Database service result:', dbResult ? Object.keys(dbResult) : 'null');
    
    // Check what keys exist in Redis
    console.log('\n5. Checking Redis keys pattern...');
    const keys = await redis.keys('user:*1750487572658-s0l035761sn*');
    console.log('Matching Redis keys:', keys);
    
    // Check with different ID formats
    console.log('\n6. Testing different ID formats...');
    const formats = [
      userId,
      cleanId,
      `user:${cleanId}`,
      `user:${userId}`
    ];
    
    for (const format of formats) {
      const data = await redis.hgetall(format);
      const keyCount = Object.keys(data || {}).length;
      console.log(`Format "${format}": ${keyCount} fields`);      if (keyCount > 0) {
        console.log(`  ✅ FOUND DATA with format: ${format}`);
        console.log(`  Sample fields:`, Object.keys(data || {}).slice(0, 5));
      }
    }
    
  } catch (error) {
    console.error('❌ Error in direct Redis check:', error);
  }
}

directRedisCheck().catch(console.error);
