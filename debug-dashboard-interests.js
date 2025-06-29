// Debug script to check dashboard interests issues
import { redis } from './lib/redis-client.js';

const debugInterestsIssues = async () => {
  try {
    console.log('🔍 Debugging dashboard interests issues...\n');
    
    // 1. Check existing users
    console.log('1. Checking existing users:');
    const userKeys = await redis.keys('user:*');
    console.log(`Found ${userKeys.length} users in Redis`);
    
    for (const key of userKeys.slice(0, 3)) {
      const user = await redis.hgetall(key);
      console.log(`${key}:`, {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      });
    }
    
    // 2. Check existing interests
    console.log('\n2. Checking existing interests:');
    const interestKeys = await redis.keys('interest:*');
    console.log(`Found ${interestKeys.length} interests in Redis`);
    
    for (const key of interestKeys) {
      const interest = await redis.hgetall(key);
      console.log(`${key}:`, {
        senderId: interest.senderId,
        receiverId: interest.receiverId,
        status: interest.status,
        createdAt: interest.createdAt
      });
    }
    
    // 3. Check notifications
    console.log('\n3. Checking notifications:');
    const notificationKeys = await redis.keys('notification:*');
    console.log(`Found ${notificationKeys.length} notifications in Redis`);
    
    for (const key of notificationKeys.slice(0, 5)) {
      const notification = await redis.hgetall(key);
      console.log(`${key}:`, {
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        read: notification.read
      });
    }
    
    // 4. Check notification lists
    console.log('\n4. Checking notification lists:');
    for (const userKey of userKeys.slice(0, 3)) {
      const user = await redis.hgetall(userKey);
      if (user.id) {
        const userNotifications = await redis.lrange(`notifications:${user.id}`, 0, -1);
        console.log(`User ${user.id} has ${userNotifications.length} notifications`);
      }
    }
    
    // 5. Test specific user interests
    console.log('\n5. Testing specific user interests:');
    if (userKeys.length > 0) {
      const testUser = await redis.hgetall(userKeys[0]);
      console.log(`Testing interests for user: ${testUser.id} (${testUser.fullName})`);
      
      // Find received interests
      const receivedInterests = interestKeys.filter(async (key) => {
        const interest = await redis.hgetall(key);
        return interest.receiverId === testUser.id;
      });
      
      console.log(`Found ${receivedInterests.length} received interests for this user`);
      
      // Find sent interests
      const sentInterests = interestKeys.filter(async (key) => {
        const interest = await redis.hgetall(key);
        return interest.senderId === testUser.id;
      });
      
      console.log(`Found ${sentInterests.length} sent interests for this user`);
    }
    
    // 6. Check if there's a mismatch in interest ID format
    console.log('\n6. Checking interest ID formats:');
    for (const key of interestKeys.slice(0, 3)) {
      const interest = await redis.hgetall(key);
      console.log(`Interest key: ${key}, Interest ID: ${interest.id}`);
      if (key !== interest.id) {
        console.log(`⚠️  MISMATCH: Key ${key} doesn't match ID ${interest.id}`);
      }
    }
    
    console.log('\n✅ Debug completed');
    
  } catch (error) {
    console.error('❌ Error during debugging:', error);
  }
};

debugInterestsIssues();
