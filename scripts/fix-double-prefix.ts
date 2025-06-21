import { redis } from '../lib/redis-client';

async function fixDoublePrefix() {
  console.log('🔧 Fixing double prefix issue for user...\n');
  
  try {
    const wrongKey = 'user:user:1750487572658-s0l035761sn';
    const correctKey = 'user:1750487572658-s0l035761sn';
      console.log('1. Getting data from wrong key...');
    const userData = await redis.hgetall(wrongKey);
    console.log(`Found ${Object.keys(userData || {}).length} fields in wrong key`);
    
    if (Object.keys(userData || {}).length > 0 && userData) {
      console.log('2. Copying data to correct key...');
      await redis.hset(correctKey, userData);
      console.log('✅ Data copied to correct key');
      
      console.log('3. Deleting wrong key...');
      await redis.del(wrongKey);
      console.log('✅ Wrong key deleted');
      
      console.log('4. Verifying correct key...');
      const verifyData = await redis.hgetall(correctKey);
      console.log(`✅ Correct key now has ${Object.keys(verifyData || {}).length} fields`);
      
      console.log('5. Testing database service...');
      const { database } = await import('../lib/database-service');
      const dbResult = await database.users.getById('user:1750487572658-s0l035761sn');
      if (dbResult) {
        console.log('✅ Database service can now find the user');
        console.log('User data:', {
          id: dbResult.id,
          email: dbResult.email,
          fullName: dbResult.fullName,
          verified: dbResult.verified
        });
      } else {
        console.log('❌ Database service still cannot find the user');
      }
      
    } else {
      console.log('❌ No data found in wrong key');
    }
    
  } catch (error) {
    console.error('❌ Error fixing double prefix:', error);
  }
}

fixDoublePrefix().catch(console.error);
