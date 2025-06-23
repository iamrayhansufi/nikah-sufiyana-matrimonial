import { redis } from '../lib/redis-client';

async function debugPhotoFields() {
  console.log('🔍 Debugging photo fields in detail...\n');
  
  try {
    const problemUserId = 'user:1750495215968-bkyhp1mtzhi';
    
    console.log(`📋 Checking user: ${problemUserId}`);
    
    // Get specific photo fields
    const photos = await redis.hget(problemUserId, 'photos');
    const profilePhotos = await redis.hget(problemUserId, 'profilePhotos');
    const profilePhoto = await redis.hget(problemUserId, 'profilePhoto');
    const cloudinaryIds = await redis.hget(problemUserId, 'cloudinary_ids');
    
    console.log('\n📸 Raw field values:');
    console.log('photos field:', photos);
    console.log('photos type:', typeof photos);
    console.log('profilePhotos field:', profilePhotos);
    console.log('profilePhotos type:', typeof profilePhotos);
    console.log('profilePhoto field:', profilePhoto);
    console.log('cloudinaryIds field:', cloudinaryIds);
    
    // Try to parse each field
    console.log('\n🔍 Parsing attempts:');
    
    if (photos) {
      console.log('Photos field content:', photos);
      if (typeof photos === 'string') {
        try {
          const parsed = JSON.parse(photos);
          console.log('✅ Photos parsed successfully:', parsed);
          console.log('Photos array length:', Array.isArray(parsed) ? parsed.length : 'Not an array');
        } catch (e) {
          console.log('❌ Photos parsing failed:', e);
        }
      } else {
        console.log('❓ Photos field is not a string, it is:', typeof photos);
      }
    }
    
    if (profilePhotos) {
      console.log('ProfilePhotos field content:', profilePhotos);
      if (typeof profilePhotos === 'string') {
        try {
          const parsed = JSON.parse(profilePhotos);
          console.log('✅ ProfilePhotos parsed successfully:', parsed);
          console.log('ProfilePhotos array length:', Array.isArray(parsed) ? parsed.length : 'Not an array');
        } catch (e) {
          console.log('❌ ProfilePhotos parsing failed:', e);
        }
      } else {
        console.log('❓ ProfilePhotos field is not a string, it is:', typeof profilePhotos);
      }
    }
    
    if (cloudinaryIds) {
      console.log('CloudinaryIds field content:', cloudinaryIds);
      if (typeof cloudinaryIds === 'string') {
        try {
          const parsed = JSON.parse(cloudinaryIds);
          console.log('✅ CloudinaryIds parsed successfully:', parsed);
        } catch (e) {
          console.log('❌ CloudinaryIds parsing failed:', e);
        }
      } else {
        console.log('❓ CloudinaryIds field is not a string, it is:', typeof cloudinaryIds);
      }
    }
    
  } catch (error) {
    console.error('❌ Error debugging photo fields:', error);
  }
}

// Run the debug
debugPhotoFields();
