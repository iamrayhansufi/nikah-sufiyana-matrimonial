// Script to verify Redis data
import { redis, redisTables } from '../lib/redis-client';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env' });

async function verifyRedisData() {
  try {
    console.log('Verifying Redis data...');

    // Test connection
    console.log('Testing Redis connection...');
    const testValue = await redis.get('test');
    console.log('Redis connection test value:', testValue);

    // Get all user IDs
    console.log('\n--- Users ---');
    const userIds = await redis.smembers('users');
    console.log(`Found ${userIds.length} users. User IDs:`, userIds);

    // Get user details
    for (const userId of userIds) {
      const user = await redisTables.users.get(userId);
      console.log(`\nUser ${userId}:`, {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        age: user.age,
        location: user.location,
        profileStatus: user.profileStatus,
      });
    }

    // Get interests
    console.log('\n--- Interests ---');
    const user1Sent = await redisTables.interests.getSentInterests('user:1');
    console.log('User 1 sent interests:', user1Sent);
    
    const user2Received = await redisTables.interests.getReceivedInterests('user:2');
    console.log('User 2 received interests:', user2Received);

    // Get shortlists
    console.log('\n--- Shortlists ---');
    const user1Shortlists = await redisTables.shortlists.get('user:1');
    console.log('User 1 shortlists:', user1Shortlists);
    
    const isShortlisted = await redisTables.shortlists.isShortlisted('user:1', 'user:2');
    console.log('Is User 2 shortlisted by User 1?', isShortlisted);

    // Get notifications
    console.log('\n--- Notifications ---');
    const user2Notifications = await redisTables.notifications.getUserNotifications('user:2');
    console.log('User 2 notifications:', user2Notifications);

    console.log('\nVerification completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during verification:', error);
    process.exit(1);
  }
}

// Run the verification function
verifyRedisData();
