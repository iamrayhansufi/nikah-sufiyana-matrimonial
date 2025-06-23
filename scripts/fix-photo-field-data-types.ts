import { redis } from '../lib/redis-client';

async function fixPhotoFieldDataTypes() {
  console.log('🔧 Fixing photo field data types...\n');
  
  try {
    const problemUserId = 'user:1750495215968-bkyhp1mtzhi';
    
    console.log(`📋 Fixing user: ${problemUserId}`);
    
    // Get current data
    const photos = await redis.hget(problemUserId, 'photos');
    const profilePhotos = await redis.hget(problemUserId, 'profilePhotos');
    const cloudinaryIds = await redis.hget(problemUserId, 'cloudinary_ids');
    
    console.log('\n📸 Current data types:');
    console.log('photos type:', typeof photos);
    console.log('profilePhotos type:', typeof profilePhotos);
    console.log('cloudinaryIds type:', typeof cloudinaryIds);
    
    // Convert to proper JSON strings
    const updateData: { [key: string]: string } = {};
    
    if (photos && typeof photos === 'object') {
      updateData.photos = JSON.stringify(photos);
      console.log('✅ Converting photos to JSON string');
    }
    
    if (profilePhotos && typeof profilePhotos === 'object') {
      updateData.profilePhotos = JSON.stringify(profilePhotos);
      console.log('✅ Converting profilePhotos to JSON string');
    }
    
    if (cloudinaryIds && typeof cloudinaryIds === 'object') {
      updateData.cloudinary_ids = JSON.stringify(cloudinaryIds);
      console.log('✅ Converting cloudinary_ids to JSON string');
    }
    
    if (Object.keys(updateData).length > 0) {
      console.log('\n💾 Updating Redis with proper JSON strings...');
      await redis.hset(problemUserId, updateData);
      console.log('✅ Data types fixed successfully');
      
      // Verify the fix
      console.log('\n🔍 Verifying fix...');
      const verifyPhotos = await redis.hget(problemUserId, 'photos');
      const verifyProfilePhotos = await redis.hget(problemUserId, 'profilePhotos');
      
      console.log('photos field now type:', typeof verifyPhotos);
      console.log('profilePhotos field now type:', typeof verifyProfilePhotos);
      
      if (typeof verifyPhotos === 'string') {
        try {
          const parsed = JSON.parse(verifyPhotos);
          console.log('✅ Photos field can now be parsed:', parsed);
        } catch (e) {
          console.log('❌ Photos field parsing still failed:', e);
        }
      }
      
      if (typeof verifyProfilePhotos === 'string') {
        try {
          const parsed = JSON.parse(verifyProfilePhotos);
          console.log('✅ ProfilePhotos field can now be parsed:', parsed);
        } catch (e) {
          console.log('❌ ProfilePhotos field parsing still failed:', e);
        }
      }
    } else {
      console.log('✅ No data type fixes needed - fields are already strings');
    }
    
    console.log('\n🎉 Photo field data type fix completed!');
    
  } catch (error) {
    console.error('❌ Error fixing photo field data types:', error);
  }
}

// Run the fix
fixPhotoFieldDataTypes();
