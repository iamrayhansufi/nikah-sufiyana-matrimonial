import { redis } from '../lib/redis-client';

async function debugPhotoStorage() {
  console.log('🔍 Debugging photo storage issues...\n');
  
  try {
    // Get all user IDs
    const allUserIds = await redis.smembers('users');
    console.log(`Found ${allUserIds.length} users. Checking photo fields...\n`);
    
    for (const userId of allUserIds.slice(0, 3)) { // Check first 3 users
      console.log(`\n📷 User: ${userId}`);
      
      const userData = await redis.hgetall(`user:${userId}`);
      if (!userData || Object.keys(userData).length === 0) {
        console.log('  ❌ No user data found');
        continue;
      }
      
      console.log(`  User: ${userData.fullName || 'No name'} (${userData.email || 'No email'})`);
      
      // Check different photo field variations
      const photoFields = [
        'profilePhoto',
        'photos', 
        'profilePhotos',
        'image',
        'photo',
        'mainPhotoUrl'
      ];
      
      console.log('  Photo fields:');
      photoFields.forEach(field => {
        const value = userData[field];
        if (value) {
          console.log(`    ✅ ${field}: ${typeof value === 'string' && value.length > 100 ? value.substring(0, 100) + '...' : value}`);
        } else {
          console.log(`    ❌ ${field}: not set`);
        }
      });
        // Check if photos field is JSON
      if (userData.photos && typeof userData.photos === 'string') {
        try {
          const photosArray = JSON.parse(userData.photos) as string[];
          console.log(`    📋 Parsed photos array: ${photosArray.length} photos`);
          photosArray.forEach((photo: string, index: number) => {
            console.log(`      Photo ${index + 1}: ${photo.substring(0, 50)}...`);
          });
        } catch (e) {
          console.log(`    ⚠️  photos field is not valid JSON: ${userData.photos}`);
        }
      }
    }
    
    // Check registration schema
    console.log('\n🔧 Analyzing registration data structure...');
    if (allUserIds.length > 0) {
      const sampleUser = await redis.hgetall(`user:${allUserIds[0]}`);
      console.log('Sample user fields:', Object.keys(sampleUser || {}));
    }
    
  } catch (error) {
    console.error('❌ Error debugging photo storage:', error);
  }
}

debugPhotoStorage().catch(console.error);
