const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Import the database service
const { database } = require(path.join(__dirname, '..', 'lib', 'database-service.ts'));

async function testProfileAPI() {
  console.log('🔍 Testing Profile API functionality...\n');
  
  try {
    // First, let's check if we have any users in Redis
    console.log('1. Checking for users in Redis...');
    const allUsers = await database.users.getAll();
    console.log(`Found ${allUsers.length} users in Redis`);
    
    if (allUsers.length === 0) {
      console.log('❌ No users found in Redis. Need to create test users first.');
      return;
    }
    
    // Get the first user for testing
    const testUser = allUsers[0];
    console.log(`\n2. Testing with user: ${testUser.id}`);
    console.log('User data keys:', Object.keys(testUser));
    
    // Test getting user by ID
    console.log('\n3. Testing database.users.getById...');
    const userById = await database.users.getById(testUser.id);
    if (userById) {
      console.log('✅ Successfully retrieved user by ID');
      console.log('Retrieved user keys:', Object.keys(userById));
    } else {
      console.log('❌ Failed to retrieve user by ID');
    }
    
    // Test the profile API format
    console.log('\n4. Testing profile data format...');
    console.log('Profile data:');
    console.log(`- ID: ${userById?.id}`);
    console.log(`- Full Name: ${userById?.fullName}`);
    console.log(`- Email: ${userById?.email}`);
    console.log(`- Age: ${userById?.age}`);
    console.log(`- Gender: ${userById?.gender}`);
    console.log(`- Location: ${userById?.location}`);
    console.log(`- Verified: ${userById?.verified}`);
    
    // Check if profile has required fields
    const requiredFields = ['id', 'fullName', 'email', 'age', 'gender'];
    const missingFields = requiredFields.filter(field => !userById?.[field]);
    
    if (missingFields.length > 0) {
      console.log('⚠️  Missing required fields:', missingFields);
    } else {
      console.log('✅ All required fields present');
    }
    
    // Test with user: prefix
    console.log('\n5. Testing with user: prefix...');
    let testId = testUser.id;
    if (!testId.startsWith('user:')) {
      testId = `user:${testId.replace('user:', '')}`;
    }
    
    const userWithPrefix = await database.users.getById(testId);
    if (userWithPrefix) {
      console.log('✅ Successfully retrieved user with prefix');
    } else {
      console.log('❌ Failed to retrieve user with prefix');
      console.log('Tried ID:', testId);
    }
    
  } catch (error) {
    console.error('❌ Error testing profile API:', error);
  }
}

testProfileAPI().catch(console.error);
