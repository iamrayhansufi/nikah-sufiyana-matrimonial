import redisClient from '../lib/redis-client';

async function checkUserFields() {  try {
    console.log('🔍 Checking Redis user field structure...');
    
    // Get all user keys - filter out non-user keys
    const allKeys = await redisClient.keys('user:*');
    const userKeys = allKeys.filter(key => {
      // Only include keys that are exactly user:id format, not user:id:something
      return key.match(/^user:[^:]+$/) !== null;
    });
    console.log(`Found ${userKeys.length} user keys`);
    
    if (userKeys.length > 0) {
      // Get first user's data
      const firstUserKey = userKeys[0];
      const userData = await redisClient.hgetall(firstUserKey);
      
      if (!userData) {
        console.log('❌ No user data found');
        return;
      }
      
      console.log(`\n📋 Sample user data (${firstUserKey}):`);
      console.log('Available fields:');
      
      // Sort fields alphabetically for easier reading
      const sortedFields = Object.keys(userData).sort();
      sortedFields.forEach(field => {
        console.log(`  ${field}: ${userData[field]}`);
      });
      
      console.log('\n🔍 Field mapping issues:');
      
      // Check for common field issues
      if (userData.fullName && !userData.name) {
        console.log('  ❌ Uses "fullName" instead of "name"');
      }
      
      if (userData.profilePhoto && !userData.image) {
        console.log('  ❌ Uses "profilePhoto" instead of "image"');
      } else if (!userData.profilePhoto && !userData.image) {
        console.log('  ❌ No profile photo field found');
      }
      
      // Check a few more users to see consistency
      console.log('\n🔍 Checking field consistency across users...');
      const sampleSize = Math.min(3, userKeys.length);
      
      for (let i = 1; i < sampleSize; i++) {
        const userKey = userKeys[i];
        const userData = await redisClient.hgetall(userKey);
        
        if (userData) {
          console.log(`\n${userKey}:`);
          console.log(`  fullName: ${userData.fullName || 'NOT FOUND'}`);
          console.log(`  name: ${userData.name || 'NOT FOUND'}`);
          console.log(`  profilePhoto: ${userData.profilePhoto || 'NOT FOUND'}`);
          console.log(`  image: ${userData.image || 'NOT FOUND'}`);
        }
      }
    }
      // Connection will be closed automatically
    console.log('\n✅ User field check completed');
    
  } catch (error) {
    console.error('❌ Error checking user fields:', error);
    process.exit(1);
  }
}

checkUserFields();
