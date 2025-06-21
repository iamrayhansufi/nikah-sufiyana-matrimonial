import redisClient from '../lib/redis-client';

async function listAllUsers() {
  try {
    console.log('🔍 Listing all users in the database...');
    
    // Get users from the set
    const userIds = await redisClient.smembers('users');
    console.log(`Found ${userIds.length} user IDs in users set:`, userIds);
    
    // Get all user keys directly
    const allUserKeys = await redisClient.keys('user:*');
    const actualUserKeys = allUserKeys.filter(key => key.match(/^user:[^:]+$/));
    console.log(`Found ${actualUserKeys.length} actual user keys:`, actualUserKeys);
    
    // List all users with details
    console.log('\n📋 All users in database:');
    for (const userKey of actualUserKeys) {
      const userId = userKey.replace('user:', '');
      const userData = await redisClient.hgetall(userKey);
      
      if (userData) {
        console.log(`\n--- ${userKey} ---`);
        console.log(`  Name: ${userData.fullName || 'Unknown'}`);
        console.log(`  Email: ${userData.email || 'Unknown'}`);
        console.log(`  Phone: ${userData.phone || 'Unknown'}`);
        console.log(`  Role: ${userData.role || 'Unknown'}`);
        console.log(`  Created: ${userData.createdAt || 'Unknown'}`);
        console.log(`  Profile Status: ${userData.profileStatus || 'Unknown'}`);
      }
    }
    
    // Check for any interests, notifications, etc.
    const interestKeys = await redisClient.keys('*interest*');
    const notificationKeys = await redisClient.keys('*notification*');
    const shortlistKeys = await redisClient.keys('*shortlist*');
    
    console.log(`\n📊 Additional data found:`);
    console.log(`  Interest keys: ${interestKeys.length}`);
    console.log(`  Notification keys: ${notificationKeys.length}`);
    console.log(`  Shortlist keys: ${shortlistKeys.length}`);
    
    if (interestKeys.length > 0) {
      console.log('  Interest keys:', interestKeys.slice(0, 5)); // Show first 5
    }
    if (notificationKeys.length > 0) {
      console.log('  Notification keys:', notificationKeys.slice(0, 5)); // Show first 5
    }
    if (shortlistKeys.length > 0) {
      console.log('  Shortlist keys:', shortlistKeys.slice(0, 5)); // Show first 5
    }
    
    console.log('\n✅ User listing completed');
    
  } catch (error) {
    console.error('❌ Error listing users:', error);
  }
}

listAllUsers();
