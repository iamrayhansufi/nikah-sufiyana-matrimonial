// Script to test the database service with Redis
import { database } from '../lib/database-service';
import { redis } from '../lib/redis-client';

async function testDatabaseService() {
  try {
    console.log('Testing database service with Redis...');
    
    // Test Redis connection
    console.log('Testing Redis connection...');
    const redisConnected = await database.testRedisConnection();
    if (!redisConnected) {
      throw new Error('Redis connection failed');
    }
    console.log('✓ Redis connection successful');
    
    // Test getting user IDs
    console.log('\nTesting getting all user IDs...');
    const userIds = await database.users.getAllUserIds();
    console.log(`✓ Found ${userIds.length} users`);
    
    if (userIds.length > 0) {
      // Test getting a user
      console.log('\nTesting getting a user by ID...');
      const user = await database.users.getById(userIds[0]);
      
      if (user) {
        console.log(`✓ Retrieved user: ${user.fullName} (${user.email})`);
        
        // Test getting interests
        console.log('\nTesting getting user interests...');
        const sentInterests = await database.interests.getSentInterests(user.id);
        const receivedInterests = await database.interests.getReceivedInterests(user.id);
        console.log(`✓ User has ${sentInterests.length} sent interests and ${receivedInterests.length} received interests`);
        
        // Test getting shortlists
        console.log('\nTesting getting user shortlists...');
        const shortlist = await database.shortlists.get(user.id);
        console.log(`✓ User has ${shortlist.length} profiles in shortlist`);
        
        // Test getting notifications
        console.log('\nTesting getting user notifications...');
        const notifications = await database.notifications.getUserNotifications(user.id);
        console.log(`✓ User has ${notifications.length} notifications`);
      } else {
        console.log('❌ Failed to retrieve user');
      }
      
      // Test search profiles
      console.log('\nTesting profile search...');
      const searchResults = await database.profiles.searchProfiles({
        page: '1',
        limit: '5'
      });
      console.log(`✓ Search returned ${searchResults.profiles.length} profiles out of ${searchResults.total} total`);
    }
    
    console.log('\nAll database service tests passed!');
  } catch (error) {
    console.error('Error in database service test:', error);
    process.exit(1);
  }
}

// Run the tests
testDatabaseService();
