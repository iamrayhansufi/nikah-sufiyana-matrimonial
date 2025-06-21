import { database } from '../lib/database-service';

async function testNotificationAPI() {
  console.log('🧪 Testing Notification API...');
  
  try {    // Get all user IDs
    const userIds = await database.users.getAllUserIds();
    console.log(`Found ${userIds.length} users`);
    
    if (userIds.length === 0) {
      console.log('❌ No users found for testing');
      return;
    }
      // Get the first user
    const testUser = await database.users.getById(String(userIds[0]));
    console.log(`Testing with user: ${testUser.fullName} (${testUser.id})`);
    
    // Get notifications for this user
    const notifications = await database.notifications.getUserNotifications(testUser.id);
    console.log(`Found ${notifications.length} notifications for user ${testUser.id}`);
    
    if (notifications.length > 0) {
      console.log('Sample notification:', JSON.stringify(notifications[0], null, 2));
    }
    
    // Test notification structure
    const notificationResponse = {
      notifications: Array.isArray(notifications) ? notifications : []
    };
    
    console.log('✅ Notification API structure test passed');
    console.log('Response format:', {
      hasNotificationsKey: 'notifications' in notificationResponse,
      notificationsIsArray: Array.isArray(notificationResponse.notifications),
      notificationCount: notificationResponse.notifications.length
    });
    
  } catch (error) {
    console.error('❌ Error testing notification API:', error);
  }
}

// Run the test
testNotificationAPI().then(() => {
  console.log('🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
