import { redis } from '../lib/redis-client';

async function cleanupTestPhoto() {
  console.log('🧹 Cleaning up test photo...\n');
  
  try {
    const problemUserId = 'user:1750495215968-bkyhp1mtzhi';
    
    console.log(`📋 Cleaning user: ${problemUserId}`);
    
    // Get current photos
    const currentPhotos = await redis.hget(problemUserId, 'photos');
    const currentProfilePhotos = await redis.hget(problemUserId, 'profilePhotos');
    
    console.log('Current photos:', currentPhotos);
    console.log('Current profilePhotos:', currentProfilePhotos);
    
    // Filter out the test photo
    let cleanedPhotos = [];
    if (currentPhotos && Array.isArray(currentPhotos)) {
      cleanedPhotos = currentPhotos.filter(photo => !photo.includes('gallery-test-photo-123'));
    }
    
    console.log('Cleaned photos array:', cleanedPhotos);
    
    // Update Redis with only real photos
    await redis.hset(problemUserId, {
      photos: JSON.stringify(cleanedPhotos),
      profilePhotos: JSON.stringify(cleanedPhotos)
    });
    
    console.log('✅ Test photo removed');
    
    // Verify
    const verifyPhotos = await redis.hget(problemUserId, 'photos');
    const verifyProfilePhotos = await redis.hget(problemUserId, 'profilePhotos');
    
    console.log('\n🔍 Verification:');
    console.log('Photos field:', verifyPhotos);
    console.log('ProfilePhotos field:', verifyProfilePhotos);
    
    console.log('\n🎉 Test photo cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error cleaning up test photo:', error);
  }
}

// Run the cleanup
cleanupTestPhoto();
