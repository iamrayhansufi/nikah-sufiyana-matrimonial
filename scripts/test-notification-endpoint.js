// Test script to directly call the notification API endpoint
async function testNotificationEndpoint() {
  console.log('🧪 Testing /api/notifications endpoint...');
  
  try {
    const response = await fetch('http://localhost:3001/api/notifications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.status === 401) {
      console.log('✅ Expected unauthorized response (no session)');
      return;
    }
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    // Check structure
    if (data && typeof data === 'object' && 'notifications' in data) {
      console.log('✅ Correct response structure');
      console.log('- Has notifications key:', 'notifications' in data);
      console.log('- Notifications is array:', Array.isArray(data.notifications));
      console.log('- Notification count:', data.notifications.length);
    } else {
      console.log('❌ Incorrect response structure');
    }
    
  } catch (error) {
    console.error('❌ Error testing endpoint:', error);
  }
}

testNotificationEndpoint();
