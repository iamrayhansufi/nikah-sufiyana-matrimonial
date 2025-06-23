import { redis } from '../lib/redis-client';

async function testPhotoDeletion() {
  try {
    console.log('🔍 Testing photo deletion functionality...\n');
    
    // Get user data
    const userKeys = await redis.keys('user:*');
    console.log('📊 Available user keys:', userKeys);
    
    if (userKeys.length === 0) {
      console.log('❌ No users found in Redis');
      return;
    }
    
    // Get the first user
    const userId = userKeys[0];
    console.log(`\n🔍 Checking user: ${userId}`);
    
    const userData = await redis.hgetall(userId);
    
    if (!userData) {
      console.log('❌ User data not found');
      return;
    }
    
    console.log('📄 User data keys:', Object.keys(userData));
    
    // Check photo fields
    const photoFields = ['profilePhoto', 'photos', 'profilePhotos'];
    
    for (const field of photoFields) {
      console.log(`\n📸 ${field}:`, userData[field]);
      
      if (userData[field]) {
        if (field !== 'profilePhoto' && typeof userData[field] === 'string') {
          try {
            const parsed = JSON.parse(userData[field]);
            console.log(`   Parsed ${field}:`, parsed);
            console.log(`   Type: ${typeof parsed}, Length: ${Array.isArray(parsed) ? parsed.length : 'not array'}`);
          } catch (e) {
            console.log(`   ❌ Error parsing ${field}:`, e);
          }
        }
      } else {
        console.log(`   ❌ ${field} is empty or undefined`);
      }
    }
    
    // If there are photos, show what would happen if we delete the first one
    if (userData.photos) {
      let photosArray: string[] = [];
      
      try {
        if (typeof userData.photos === 'string') {
          photosArray = JSON.parse(userData.photos);
        } else if (Array.isArray(userData.photos)) {
          photosArray = userData.photos;
        }
        
        if (photosArray.length > 0) {
          console.log('\n🗑️ Simulating deletion of first photo:', photosArray[0]);
          
          const updatedPhotos = photosArray.filter(p => p !== photosArray[0]);
          console.log('   Photos after deletion:', updatedPhotos);
          console.log('   Remaining count:', updatedPhotos.length);
          
          // Check if the deleted photo was the main profile photo
          if (userData.profilePhoto === photosArray[0]) {
            console.log('   🚨 The deleted photo was the main profile photo!');
            console.log('   New main photo would be:', updatedPhotos.length > 0 ? updatedPhotos[0] : 'none');
          }
        }
      } catch (e) {
        console.log('❌ Error processing photos for deletion simulation:', e);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing photo deletion:', error);
  } finally {
    process.exit(0);
  }
}

testPhotoDeletion();
