import { database } from '../lib/database-service';

async function testProfileFetching() {
  console.log('🧪 Testing Profile Fetching for Dashboard...\n');
  
  try {
    // Get all user IDs
    const allUserIds = await database.users.getAllUserIds();
    console.log(`Found ${allUserIds.length} users in Redis`);
    
    // Find complete users
    for (const userId of allUserIds) {
      const userIdStr = String(userId);
      const userData = await database.users.getById(userIdStr);
      
      if (userData && userData.fullName && userData.email) {
        console.log(`\n✅ Found complete user: ${userIdStr}`);
        console.log('User profile data:');
        console.log(`- ID: ${userData.id}`);
        console.log(`- Full Name: ${userData.fullName}`);
        console.log(`- Email: ${userData.email}`);
        console.log(`- Age: ${userData.age}`);
        console.log(`- Gender: ${userData.gender}`);
        console.log(`- Location: ${userData.location}`);
        console.log(`- Verified: ${userData.verified}`);
        console.log(`- Profile Completed: ${userData.profileCompleted}`);
        
        // Test the profile format that would be returned by API
        const profileFormatted = {
          id: userData.id || userIdStr,
          name: userData.fullName,
          fullName: userData.fullName,
          age: userData.age,
          gender: userData.gender,
          location: userData.location,
          education: userData.education,
          profession: userData.profession,
          verified: userData.verified,
          profileCompleted: userData.profileCompleted,
        };
        
        console.log('\n📋 Formatted profile for dashboard:');
        console.log(JSON.stringify(profileFormatted, null, 2));
        
        // This user should work for testing dashboard
        console.log(`\n🎯 Use this user ID for testing: ${userIdStr}`);
        console.log(`Email: ${userData.email}`);
        break;
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing profile fetching:', error);
  }
}

testProfileFetching().catch(console.error);
