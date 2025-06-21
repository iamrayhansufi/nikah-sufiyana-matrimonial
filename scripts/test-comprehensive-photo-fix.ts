import { redis } from '../lib/redis-client';

async function testComprehensivePhotoFix() {
  console.log('🧪 Testing comprehensive photo functionality...\n');
  
  try {
    const testUserId = '1';
    
    // Step 1: Clear existing photos for clean test
    console.log('1. Clearing existing photo data...');
    await redis.hdel(`user:${testUserId}`, 'photos', 'profilePhoto', 'image');
    
    // Step 2: Simulate photo upload
    console.log('2. Simulating photo upload...');
    const testPhotos = [
      '/uploads/profiles/photo1.jpg',
      '/uploads/profiles/photo2.jpg'
    ];
    
    // Store photos as JSON string (like the upload API does)
    const updateData = {
      photos: JSON.stringify(testPhotos),
      profilePhoto: testPhotos[0]
    };
    
    await redis.hset(`user:${testUserId}`, updateData);
    console.log('   ✅ Stored photos:', updateData);
      // Step 3: Test retrieval like the API does
    console.log('3. Testing retrieval like profile API...');
    const userData = await redis.hgetall(`user:${testUserId}`);
    
    if (!userData) {
      console.log('❌ No user data found');
      return;
    }
    
    console.log('   Raw photos field:', userData.photos);
    console.log('   Type of photos field:', typeof userData.photos);
    console.log('   Raw profilePhoto field:', userData.profilePhoto);
      // Test profile photo logic
    let profilePhoto;
    if (userData.profilePhoto) {
      profilePhoto = userData.profilePhoto;
    } else if (userData.photos) {
      let photosArray;
      if (typeof userData.photos === 'string') {
        try {
          photosArray = JSON.parse(userData.photos);
        } catch (e) {
          console.warn('Error parsing photos field:', e);
        }
      } else if (Array.isArray(userData.photos)) {
        photosArray = userData.photos;
      }
      
      if (Array.isArray(photosArray) && photosArray.length > 0) {
        profilePhoto = photosArray[0];
      }
    }
    profilePhoto = profilePhoto || '/placeholder-user.jpg';
    
    // Test profile photos logic
    let profilePhotos = [];
    if (userData.photos) {
      if (typeof userData.photos === 'string') {
        try {
          const photosArray = JSON.parse(userData.photos);
          if (Array.isArray(photosArray)) {
            profilePhotos = photosArray;
          }
        } catch (e) {
          console.warn('Error parsing photos field:', e);
        }
      } else if (Array.isArray(userData.photos)) {
        profilePhotos = userData.photos;
      }
    }
    
    console.log('   ✅ Profile Photo Result:', profilePhoto);
    console.log('   ✅ Profile Photos Result:', profilePhotos);
    
    // Step 4: Test adding another photo (like upload API does)
    console.log('4. Testing adding another photo...');
    const existingPhotos = await redis.hget(`user:${testUserId}`, "photos");
    let photos = [];
    
    if (existingPhotos) {
      if (typeof existingPhotos === 'string') {
        try {
          photos = JSON.parse(existingPhotos);
        } catch (e) {
          console.warn('Error parsing existing photos:', e);
          photos = [];
        }
      } else if (Array.isArray(existingPhotos)) {
        photos = existingPhotos;
      }
    }
    
    console.log('   Existing photos before adding:', photos);
    
    // Add new photo
    const newPhoto = '/uploads/profiles/photo3.jpg';
    photos.push(newPhoto);
    
    const updateData2 = {
      photos: JSON.stringify(photos)
    };
    
    await redis.hset(`user:${testUserId}`, updateData2);
    console.log('   ✅ Added new photo, total photos:', photos.length);
      // Step 5: Final verification
    console.log('5. Final verification...');
    const finalUserData = await redis.hgetall(`user:${testUserId}`);
    
    if (!finalUserData) {
      console.log('❌ No final user data found');
      return;
    }
    
    console.log('   Final photos field:', finalUserData.photos);
    console.log('   Final profilePhoto field:', finalUserData.profilePhoto);
    
    // Parse final photos
    let finalPhotos = [];
    if (finalUserData.photos) {
      if (typeof finalUserData.photos === 'string') {
        try {
          finalPhotos = JSON.parse(finalUserData.photos);
        } catch (e) {
          console.warn('Error parsing final photos:', e);
        }
      } else if (Array.isArray(finalUserData.photos)) {
        finalPhotos = finalUserData.photos;
      }
    }
    
    console.log('   ✅ Final parsed photos:', finalPhotos);
    console.log('   ✅ Total photos:', finalPhotos.length);
    
    console.log('\n🎉 Photo functionality test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error in test:', error);
  }
}

testComprehensivePhotoFix().catch(console.error);
