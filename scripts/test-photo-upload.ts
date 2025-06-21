import { redis } from '../lib/redis-client';

async function testPhotoUpload() {
  console.log('🧪 Testing photo upload workflow...\n');
  
  try {
    // Find a user to test with
    const userIds = await redis.smembers('users');
    console.log('Available users:', userIds);
    
    // Let's use user:1 since it has data
    const testUserId = '1';
    const userData = await redis.hgetall(`user:${testUserId}`);
    
    console.log('\n📋 Before photo upload:');
    console.log('User data keys:', Object.keys(userData || {}));
    console.log('profilePhoto:', userData?.profilePhoto || 'not set');
    console.log('photos:', userData?.photos || 'not set');
    console.log('image:', userData?.image || 'not set');
    
    // Simulate adding a photo
    const testPhotoUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/test...';
    
    // Get existing photos
    const existingPhotos = await redis.hget(`user:${testUserId}`, "photos");
    const photos = (existingPhotos && typeof existingPhotos === 'string') ? JSON.parse(existingPhotos) : [];
    
    console.log('\n📸 Current photos array:', photos);
    
    // Add new photo
    photos.push(testPhotoUrl);
    
    // Update both photos array and profilePhoto field
    const updateData: { [key: string]: string } = {
      photos: JSON.stringify(photos)
    };
    
    // If this is the first photo, also set it as the main profile photo
    if (photos.length === 1) {
      updateData.profilePhoto = testPhotoUrl;
    }
    
    console.log('\n🔄 Updating user with:', updateData);
    
    // Update user profile
    await redis.hset(`user:${testUserId}`, updateData);
    
    console.log('✅ Photo upload simulation complete');
      // Verify the update
    const updatedUserData = await redis.hgetall(`user:${testUserId}`);
    
    console.log('\n📋 After photo upload:');
    console.log('profilePhoto:', updatedUserData?.profilePhoto || 'not set');
    console.log('photos:', updatedUserData?.photos || 'not set');
    
    // Parse photos to verify structure
    if (updatedUserData?.photos && typeof updatedUserData.photos === 'string') {
      try {
        const parsedPhotos = JSON.parse(updatedUserData.photos);
        console.log('Parsed photos array length:', parsedPhotos.length);
      } catch (e) {
        console.log('❌ Photos field is not valid JSON');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testPhotoUpload().catch(console.error);
