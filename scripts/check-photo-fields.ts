import { redis } from '../lib/redis-client';

async function checkPhotoFields() {
  console.log('🔍 Checking photo field storage...\n');
  
  try {
    const testUserId = '1';
    const userData = await redis.hgetall(`user:${testUserId}`);
    
    console.log('profilePhoto field:', userData?.profilePhoto);
    console.log('photos field raw:', userData?.photos);
    console.log('photos field type:', typeof userData?.photos);
      if (userData?.photos && typeof userData.photos === 'string') {
      try {
        const parsed = JSON.parse(userData.photos);
        console.log('✅ Successfully parsed photos:', parsed);
        console.log('Photos array length:', parsed.length);
      } catch (e) {
        console.log('❌ JSON parse error:', e);
        // Try to fix the issue
        console.log('Attempting to fix photos field...');
        
        // It might be a string representation of an array
        if (typeof userData.photos === 'string' && userData.photos.startsWith('[')) {
          try {
            const fixed = JSON.parse(userData.photos);
            console.log('✅ Fixed photos:', fixed);
          } catch (e2) {
            console.log('❌ Still can\'t parse:', e2);
          }
        }
      }
    }
    
    // Now let's test the API endpoint directly to see if it works
    console.log('\n🧪 Testing the actual photo upload API structure...');
    
    // Test with a proper structure
    const properPhotosArray = ['test-photo-1.jpg', 'test-photo-2.jpg'];
    const updateData = {
      photos: JSON.stringify(properPhotosArray),
      profilePhoto: properPhotosArray[0]
    };
    
    console.log('Updating with proper structure:', updateData);
    await redis.hset(`user:${testUserId}`, updateData);
    
    // Verify
    const verifyData = await redis.hgetall(`user:${testUserId}`);
    console.log('\n✅ Verification:');
    console.log('profilePhoto:', verifyData?.profilePhoto);
    console.log('photos:', verifyData?.photos);
      if (verifyData?.photos && typeof verifyData.photos === 'string') {
      const parsedPhotos = JSON.parse(verifyData.photos);
      console.log('Parsed photos:', parsedPhotos);
      console.log('Type of parsed photos:', typeof parsedPhotos);
      console.log('Is array:', Array.isArray(parsedPhotos));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkPhotoFields().catch(console.error);
