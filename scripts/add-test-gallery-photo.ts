import { redis } from '../lib/redis-client';

async function addTestGalleryPhoto() {
  console.log('🔧 Adding test gallery photo...\n');
  
  try {
    const problemUserId = 'user:1750495215968-bkyhp1mtzhi';
    
    console.log(`📋 Adding photo to user: ${problemUserId}`);
    
    // Get current photos
    const currentPhotos = await redis.hget(problemUserId, 'photos');
    const currentProfilePhotos = await redis.hget(problemUserId, 'profilePhotos');
    
    console.log('Current photos:', currentPhotos);
    console.log('Current profilePhotos:', currentProfilePhotos);
    
    // Parse current photos
    let photos = [];
    if (currentPhotos && Array.isArray(currentPhotos)) {
      photos = currentPhotos;
    }
    
    // Add a test gallery photo (different from profile photo)
    const testGalleryPhoto = '/api/secure-image/gallery-test-photo-123';
    photos.push(testGalleryPhoto);
    
    console.log('Updated photos array:', photos);
    
    // Update Redis
    await redis.hset(problemUserId, {
      photos: JSON.stringify(photos),
      profilePhotos: JSON.stringify(photos)
    });
    
    console.log('✅ Test gallery photo added');
    
    // Verify
    const verifyPhotos = await redis.hget(problemUserId, 'photos');
    const verifyProfilePhotos = await redis.hget(problemUserId, 'profilePhotos');
    
    console.log('\n🔍 Verification:');
    console.log('Photos field:', verifyPhotos);
    console.log('ProfilePhotos field:', verifyProfilePhotos);
    
    console.log('\n🎉 Test photo added successfully! Now you can test the gallery display and delete functionality.');
    
  } catch (error) {
    console.error('❌ Error adding test gallery photo:', error);
  }
}

// Run the test
addTestGalleryPhoto();
