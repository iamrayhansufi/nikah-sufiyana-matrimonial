import { redis } from '../lib/redis-client';

async function manuallyTestPhotoDeletion() {
  try {
    console.log('🔍 Manual photo deletion test...\n');
    
    // Use user:1 which has photos
    const userId = 'user:1';
    console.log(`Testing with user: ${userId}`);
    
    // Get current state
    const user = await redis.hgetall(userId);
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('📸 Current state:');
    console.log('  profilePhoto:', user.profilePhoto);
    console.log('  photos:', user.photos);
    console.log('  profilePhotos:', user.profilePhotos);
    
    // Parse current photos
    let photos: string[] = [];
    if (user.photos) {
      if (typeof user.photos === 'string') {
        try {
          photos = JSON.parse(user.photos);
        } catch (error) {
          console.error("Error parsing photos JSON:", error);
          photos = [];
        }
      } else if (Array.isArray(user.photos)) {
        photos = user.photos;
      }
    }
    
    if (photos.length === 0) {
      console.log('❌ No photos to delete');
      return;
    }
    
    // Test deleting the first photo
    const photoToDelete = photos[0];
    console.log(`\n🗑️ Testing deletion of: ${photoToDelete}`);
    
    // Simulate the deletion logic from the API
    const updatedPhotos = photos.filter(p => p !== photoToDelete);
    console.log('📸 Photos after deletion:', updatedPhotos);
    
    const updateData: { [key: string]: string } = {
      photos: JSON.stringify(updatedPhotos),
      profilePhotos: JSON.stringify(updatedPhotos)
    };
    
    // Handle main profile photo update
    if (user.profilePhoto === photoToDelete) {
      updateData.profilePhoto = updatedPhotos.length > 0 ? updatedPhotos[0] : "";
      console.log('🚨 Main profile photo updated to:', updateData.profilePhoto);
    }
    
    console.log('\n💾 Applying update...');
    await redis.hset(userId, updateData);
    
    // Verify the update
    const updatedUser = await redis.hgetall(userId);
    if (!updatedUser) {
      console.log('❌ Failed to get updated user');
      return;
    }
    
    console.log('\n✅ Updated state:');
    console.log('  profilePhoto:', updatedUser.profilePhoto);
    console.log('  photos:', updatedUser.photos);
    console.log('  profilePhotos:', updatedUser.profilePhotos);
    
    // Parse and verify updated photos
    let verifyPhotos: string[] = [];
    if (updatedUser.photos && typeof updatedUser.photos === 'string') {
      try {
        verifyPhotos = JSON.parse(updatedUser.photos);
        console.log('📸 Verified photos array:', verifyPhotos);
        console.log('📸 Photo count after deletion:', verifyPhotos.length);
        console.log('✅ Deletion successful!');
      } catch (e) {
        console.error('❌ Error parsing updated photos:', e);
      }
    }
    
  } catch (error) {
    console.error('❌ Error in manual deletion test:', error);
  } finally {
    process.exit(0);
  }
}

manuallyTestPhotoDeletion();
