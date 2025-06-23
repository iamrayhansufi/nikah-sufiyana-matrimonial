import { redis } from '../lib/redis-client';

async function debugCurrentUserPhotoIssue() {
  console.log('🔍 Debugging current user photo issue...\n');
  
  try {
    // Get the specific user from the console logs
    const problemUserId = 'user:1750495215968-bkyhp1mtzhi';
    
    console.log(`📋 Checking user: ${problemUserId}`);
    
    const userData = await redis.hgetall(problemUserId);
    
    if (!userData || Object.keys(userData).length === 0) {
      console.log('❌ User not found in database');
      return;
    }
    
    console.log('\n📊 User data summary:');
    console.log(`  Name: ${userData.fullName || 'Not set'}`);
    console.log(`  Email: ${userData.email || 'Not set'}`);
    console.log(`  Total fields: ${Object.keys(userData).length}`);
      console.log('\n📸 Photo-related fields:');
    
    // Check all photo-related fields
    const photoFields = ['profilePhoto', 'photos', 'profilePhotos', 'image', 'cloudinary_ids'];
    
    photoFields.forEach(field => {
      const value = userData[field];
      if (value) {
        console.log(`  ✅ ${field}:`);
        console.log(`    Type: ${typeof value}`);
        if (typeof value === 'string') {
          console.log(`    Length: ${value.length}`);
          console.log(`    Value: ${value.length > 100 ? value.substring(0, 100) + '...' : value}`);
        }
        
        // Try to parse if it looks like JSON
        if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
          try {
            const parsed = JSON.parse(value);
            console.log(`    ✅ Parsed successfully: ${Array.isArray(parsed) ? `Array with ${parsed.length} items` : typeof parsed}`);
            if (Array.isArray(parsed)) {
              parsed.forEach((item: any, index: number) => {
                console.log(`      [${index}]: ${typeof item === 'string' && item.length > 50 ? item.substring(0, 50) + '...' : item}`);
              });
            }
          } catch (e) {
            const error = e as Error;
            console.log(`    ❌ JSON parse error: ${error.message}`);
          }
        }
      } else {
        console.log(`  ❌ ${field}: not set`);
      }
    });
    
    console.log('\n🔄 Testing profile API response...');
    
    // Simulate what the profile API does
    const profilePhotoLogic = (() => {
      if (userData.profilePhoto) {
        return userData.profilePhoto;
      }
      if (userData.photos) {
        let photosArray;
        if (typeof userData.photos === 'string') {
          try {
            photosArray = JSON.parse(userData.photos);
          } catch (e) {
            console.warn('Error parsing photos field:', e);
            return userData.image || '/placeholder-user.jpg';
          }
        } else if (Array.isArray(userData.photos)) {
          photosArray = userData.photos;
        }
        
        if (Array.isArray(photosArray) && photosArray.length > 0) {
          return photosArray[0];
        }
      }
      return userData.image || '/placeholder-user.jpg';
    })();
    
    const profilePhotosLogic = (() => {
      if (userData.photos) {
        if (typeof userData.photos === 'string') {
          try {
            const photosArray = JSON.parse(userData.photos);
            if (Array.isArray(photosArray)) {
              return photosArray;
            }
          } catch (e) {
            console.warn('Error parsing photos field:', e);
          }
        } else if (Array.isArray(userData.photos)) {
          return userData.photos;
        }
      }
      if (userData.profilePhotos) {
        if (typeof userData.profilePhotos === 'string') {
          try {
            return JSON.parse(userData.profilePhotos);
          } catch (e) {
            console.warn('Error parsing profilePhotos field:', e);
          }
        } else if (Array.isArray(userData.profilePhotos)) {
          return userData.profilePhotos;
        }
      }
      return [];
    })();
      console.log('\n📊 Profile API simulation results:');
    console.log(`  profilePhoto: ${profilePhotoLogic}`);
    console.log(`  profilePhotos: [${profilePhotosLogic.length} items]`);
    if (profilePhotosLogic.length > 0) {
      profilePhotosLogic.forEach((photo: any, index: number) => {
        console.log(`    [${index}]: ${typeof photo === 'string' && photo.length > 50 ? photo.substring(0, 50) + '...' : photo}`);
      });
    }
    
    // Test if the photos exist as secure URLs
    console.log('\n🔗 Testing secure URLs...');
    if (profilePhotosLogic.length > 0) {
      profilePhotosLogic.forEach((photo: any, index: number) => {
        if (typeof photo === 'string') {
          if (photo.startsWith('/api/secure-image/')) {
            console.log(`  ✅ [${index}] Valid secure URL format: ${photo}`);
          } else if (photo.startsWith('http')) {
            console.log(`  ⚠️  [${index}] Direct URL (not secure): ${photo.substring(0, 50)}...`);
          } else {
            console.log(`  ❓ [${index}] Unknown format: ${photo.substring(0, 50)}...`);
          }
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error debugging user photo issue:', error);
  }
}

// Run the debug
debugCurrentUserPhotoIssue();
