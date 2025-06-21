import redisClient from '../lib/redis-client';
import { database } from '../lib/database-service';

async function debugUserData() {
  try {
    console.log('🔍 Debugging user data retrieval...');
    
    // Test direct Redis access
    console.log('\n1. Direct Redis access:');
    const directUser = await redisClient.hgetall('user:1');
    console.log('Direct Redis user:1:', JSON.stringify(directUser, null, 2));
    
    // Test through database service users.getById
    console.log('\n2. Database service users.getById:');
    const dbUser = await database.users.getById('user:1');
    console.log('Database service user:1:', JSON.stringify(dbUser, null, 2));
    
    // Test through database service profiles.getById
    console.log('\n3. Database service profiles.getById:');
    const dbProfile = await database.profiles.getById('user:1');
    console.log('Database service profile:1:', JSON.stringify(dbProfile, null, 2));
    
    // Check if there's a separate profile:1 key
    console.log('\n4. Check profile:1 key:');
    const profileKey = await redisClient.hgetall('profile:1');
    console.log('Profile:1 key:', JSON.stringify(profileKey, null, 2));
    
    console.log('\n✅ Debug completed');
    
  } catch (error) {
    console.error('❌ Error debugging user data:', error);
  }
}

debugUserData();
