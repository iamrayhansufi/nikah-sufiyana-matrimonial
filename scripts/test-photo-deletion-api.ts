import { redis } from '../lib/redis-client';

async function testPhotoDeletionAPI() {
  try {
    console.log('🔍 Testing photo deletion API simulation...\n');
    
    // Get user data
    const userId = 'user:1';
    console.log(`\n🔍 Checking user: ${userId}`);
    
    const userData = await redis.hgetall(userId);
    
    if (!userData) {
      console.log('❌ User data not found');
      return;
    }
    
    console.log('📄 User data keys:', Object.keys(userData));
    
    // Check current photo fields
    console.log('\n📸 Current photo fields:');
    console.log('profilePhoto:', userData.profilePhoto);
    console.log('photos:', userData.photos);
    console.log('profilePhotos:', userData.profilePhotos);
    
    // Parse current photos
    let photos: string[] = [];
    if (userData.photos) {
      if (typeof userData.photos === 'string') {
        try {
          photos = JSON.parse(userData.photos);
        } catch (error) {
          console.error("Error parsing photos JSON:", error);
          photos = [];
        }
      } else if (Array.isArray(userData.photos)) {
        photos = userData.photos;
      }
    }
    
    console.log('\n📸 Current photos array:', photos);
    
    if (photos.length === 0) {
      console.log('❌ No photos to delete');
      return;
    }
    
    // Simulate deleting the first photo
    const photoToDelete = photos[0];
    console.log(`\n🗑️ Simulating deletion of photo: ${photoToDelete}`);
    
    const updatedPhotos = photos.filter(p => p !== photoToDelete);
    console.log('📸 Updated photos after deletion:', updatedPhotos);
    
    // Prepare update data
    const updateData: { [key: string]: string } = {
      photos: JSON.stringify(updatedPhotos),
      profilePhotos: JSON.stringify(updatedPhotos)
    };
    
    // If the deleted photo was the main profile photo, update it
    if (userData.profilePhoto === photoToDelete) {
      updateData.profilePhoto = updatedPhotos.length > 0 ? updatedPhotos[0] : "";
      console.log('🚨 Updated main profile photo to:', updateData.profilePhoto);
    }
    
    console.log('\n💾 Update data to be saved:', updateData);
    
    // Apply the update
    console.log('\n🔄 Applying update to Redis...');
    await redis.hset(userId, updateData);
      // Verify the update
    console.log('\n✅ Verifying update...');
    const updatedUserData = await redis.hgetall(userId);
    
    if (!updatedUserData) {
      console.log('❌ Failed to retrieve updated user data');
      return;
    }
    
    console.log('Updated profilePhoto:', updatedUserData.profilePhoto);
    console.log('Updated photos:', updatedUserData.photos);
    console.log('Updated profilePhotos:', updatedUserData.profilePhotos);
    
    // Parse and display updated photos
    let updatedPhotosArray: string[] = [];
    if (updatedUserData.photos && typeof updatedUserData.photos === 'string') {
      try {
        updatedPhotosArray = JSON.parse(updatedUserData.photos);
        console.log('Updated photos array:', updatedPhotosArray);
        console.log('Updated photos count:', updatedPhotosArray.length);
      } catch (e) {
        console.error('Error parsing updated photos:', e);
      }
    }
    
    console.log('\n✅ Photo deletion simulation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing photo deletion API:', error);
  } finally {
    process.exit(0);
  }
}

testPhotoDeletionAPI();
