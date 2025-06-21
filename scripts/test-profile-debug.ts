import { database } from '../lib/database-service';

async function testProfileAPI() {
  console.log('🔍 Testing Profile API functionality...\n');
  
  try {
    // First, let's check if we have any users in Redis
    console.log('1. Checking for users in Redis...');
    const allUserIds = await database.users.getAllUserIds();
    console.log(`Found ${allUserIds.length} user IDs in Redis`);
    
    if (allUserIds.length === 0) {
      console.log('❌ No users found in Redis. Need to create test users first.');
      return;
    }
    
    // Test all users to find complete ones
    console.log('\n2. Checking all users for completeness...');
    const completeUsers = [];
    
    for (const userId of allUserIds) {
      const userIdStr = String(userId);
      const userData = await database.users.getById(userIdStr);
      
      if (userData && Object.keys(userData).length > 1) {
        completeUsers.push({ id: userIdStr, data: userData });
      }
    }
    
    console.log(`Found ${completeUsers.length} complete users out of ${allUserIds.length} total`);
    
    if (completeUsers.length === 0) {
      console.log('❌ No complete users found. All users seem to be incomplete.');
      console.log('Let\'s check the first few users:');
      
      for (let i = 0; i < Math.min(3, allUserIds.length); i++) {
        const userId = String(allUserIds[i]);
        const userData = await database.users.getById(userId);
        console.log(`User ${userId}:`, Object.keys(userData || {}));
      }
      return;
    }
    
    // Get the first complete user for testing
    const testUser = completeUsers[0];
    console.log(`\n3. Testing with complete user: ${testUser.id}`);
    console.log('User data keys:', Object.keys(testUser.data));
    
    // Test the profile API format
    console.log('\n4. Testing profile data format...');
    const userData = testUser.data;
    console.log('Profile data:');
    console.log(`- ID: ${userData?.id || testUser.id}`);
    console.log(`- Full Name: ${userData?.fullName}`);
    console.log(`- Email: ${userData?.email}`);
    console.log(`- Age: ${userData?.age}`);
    console.log(`- Gender: ${userData?.gender}`);
    console.log(`- Location: ${userData?.location}`);
    console.log(`- Verified: ${userData?.verified}`);
    
    // Check if profile has required fields
    const requiredFields = ['fullName', 'email', 'age', 'gender'];
    const missingFields = requiredFields.filter(field => !userData?.[field]);
    
    if (missingFields.length > 0) {
      console.log('⚠️  Missing required fields:', missingFields);
    } else {
      console.log('✅ All required fields present');
    }
    
  } catch (error) {
    console.error('❌ Error testing profile API:', error);
  }
}

testProfileAPI().catch(console.error);
