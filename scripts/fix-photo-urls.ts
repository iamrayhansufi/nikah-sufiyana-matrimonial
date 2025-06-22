import { redis } from '../lib/redis-client';

// Type definition for Redis user data
interface RedisUserData {
  [key: string]: string | undefined;
  fullName?: string;
  name?: string;
  email?: string;
  photos?: string;
  profilePhoto?: string;
  profilePhotos?: string;
}

async function fixPhotoUrls() {
  console.log('🔧 Fixing photo URLs for users with base64 data URLs...\n');
  
  try {
    // Get all user IDs
    const allUserIds = await redis.smembers('users');
    console.log(`Found ${allUserIds.length} users. Checking for broken photo URLs...\n`);
    
    let fixedCount = 0;
    
    for (const userId of allUserIds) {
      console.log(`\n📋 Checking user: ${userId}`);
      
      const userData = await redis.hgetall(`user:${userId}`) as RedisUserData;
      if (!userData || Object.keys(userData).length === 0) {
        console.log('  ❌ No user data found');
        continue;
      }
      
      const userDisplayName = userData.fullName || userData.name || 'Unknown';
      console.log(`  User: ${userDisplayName} (${userData.email || 'No email'})`);
      
      // Check photos field
      if (userData.photos) {
        let photos = [];
        let needsFixing = false;
        
        try {
          photos = JSON.parse(userData.photos);
          console.log(`  📸 Found ${photos.length} photos`);
          
          // Check each photo URL for invalid timestamp parameters on data URLs
          const fixedPhotos = photos.map((photo: string, index: number) => {
            if (typeof photo === 'string' && photo.startsWith('data:') && photo.includes('?t=')) {
              console.log(`    🔧 Photo ${index + 1}: Removing invalid timestamp from data URL`);
              needsFixing = true;
              // Remove the timestamp query parameter from data URLs
              return photo.split('?')[0];
            }
            return photo;
          });
          
          if (needsFixing) {
            console.log(`  ✅ Fixing photos for user ${userId}`);
            
            const updateData: { [key: string]: string } = {
              photos: JSON.stringify(fixedPhotos),
              profilePhotos: JSON.stringify(fixedPhotos), // Also update profilePhotos
              updatedAt: new Date().toISOString()
            };
              // If the profile photo also needs fixing
            if (userData.profilePhoto && typeof userData.profilePhoto === 'string' && userData.profilePhoto.startsWith('data:') && userData.profilePhoto.includes('?t=')) {
              console.log(`    🔧 Also fixing main profile photo`);
              updateData.profilePhoto = userData.profilePhoto.split('?')[0];
            }
            
            await redis.hset(`user:${userId}`, updateData);
            fixedCount++;
            console.log(`  ✅ Fixed ${fixedPhotos.length} photos for ${userDisplayName}`);
          } else {
            console.log(`  ✅ No fixes needed for ${userDisplayName}`);
          }
          
        } catch (e) {
          console.log(`  ⚠️  Error parsing photos field: ${e}`);
        }
      } else {
        console.log(`  📷 No photos found`);
      }
    }
    
    console.log(`\n🎉 Photo URL fix completed!`);
    console.log(`📊 Summary:`);
    console.log(`   - Total users checked: ${allUserIds.length}`);
    console.log(`   - Users fixed: ${fixedCount}`);
    
    if (fixedCount > 0) {
      console.log(`\n💡 Fixed users should now have proper photo URLs without invalid query parameters.`);
      console.log(`   Data URLs now work correctly in browsers!`);
    }
    
  } catch (error) {
    console.error('❌ Error fixing photo URLs:', error);
  }
}

fixPhotoUrls().catch(console.error);
