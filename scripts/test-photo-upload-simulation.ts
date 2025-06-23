import { redis } from '../lib/redis-client';

async function testPhotoUploadSimulation() {
  console.log('🧪 Testing photo upload simulation...\n');
  
  try {
    const userId = 'user:1750495215968-bkyhp1mtzhi';
    
    console.log(`📋 Testing upload for user: ${userId}`);
      // Get current photos (simulate what the API does)
    const currentUser = await redis.hgetall(userId);
    console.log('Current user found:', !!currentUser);
    
    if (!currentUser || Object.keys(currentUser).length === 0) {
      console.error('❌ User not found in database');
      return;
    }
    
    let existingPhotos: string[] = [];
    if (currentUser.photos) {
      if (typeof currentUser.photos === 'string') {
        try {
          const parsed = JSON.parse(currentUser.photos);
          if (Array.isArray(parsed)) {
            existingPhotos = parsed;
          }
        } catch (e) {
          console.warn('Error parsing existing photos JSON:', e);
        }
      } else if (Array.isArray(currentUser.photos)) {
        existingPhotos = currentUser.photos;
      }
    }
    
    console.log('📸 Existing photos:', existingPhotos);
    
    // Simulate new photo upload
    const newPhotoUrl = '/api/secure-image/gallery-simulation-test-' + Date.now();
    const photoUrls = [newPhotoUrl];
    
    console.log('➕ Adding photos:', photoUrls);
    
    // Combine existing and new photos
    const allPhotos = [...existingPhotos, ...photoUrls].slice(0, 5);
    
    console.log('📸 All photos after upload:', allPhotos);
    console.log(`📊 Photo count - Existing: ${existingPhotos.length}, New: ${photoUrls.length}, Total: ${allPhotos.length}`);
    
    // Update data
    const updateData = {
      photos: JSON.stringify(allPhotos),
      profilePhotos: JSON.stringify(allPhotos)
    };
    
    console.log('💾 Updating with data:', Object.keys(updateData));
    
    // Update Redis
    const redisResult = await redis.hset(userId, updateData);
    console.log('✅ Redis hset result:', redisResult);
    
    // Verify the update
    const verifyPhotos = await redis.hget(userId, "photos");
    const verifyProfilePhotos = await redis.hget(userId, "profilePhotos");
    
    console.log('🔍 Verification - photos field after update:', verifyPhotos);
    console.log('🔍 Verification - profilePhotos field after update:', verifyProfilePhotos);
    
    if (verifyPhotos && Array.isArray(verifyPhotos) && verifyPhotos.length > existingPhotos.length) {
      console.log('✅ Photo upload simulation successful!');
    } else {
      console.log('❌ Photo upload simulation failed');
    }
    
    // Clean up test photo
    const cleanPhotos = existingPhotos; // Remove the test photo
    await redis.hset(userId, {
      photos: JSON.stringify(cleanPhotos),
      profilePhotos: JSON.stringify(cleanPhotos)
    });
    console.log('🧹 Test photo cleaned up');
    
  } catch (error) {
    console.error('❌ Error in photo upload simulation:', error);
  }
}

// Run the test
testPhotoUploadSimulation();
