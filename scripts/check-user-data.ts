import { redis } from '../lib/redis-client';

async function checkWorkingUser() {
  console.log('🔍 Checking working user data...\n');
  
  try {
    // Check user ID 1 which has data
    const userData = await redis.hgetall('user:1');
    console.log('User 1 full data:');
    Object.entries(userData || {}).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    
    // Also check if there are photo-related keys for this user
    console.log('\n🔍 Checking for photo keys...');
    const photoKeys = await redis.keys('*photo*');
    console.log('Photo-related keys:', photoKeys);
    
    const imageKeys = await redis.keys('*image*');
    console.log('Image-related keys:', imageKeys);
    
    // Check what API expects vs what's stored
    console.log('\n📊 Profile data analysis:');
    console.log('Expected fields for photos:');
    console.log('- profilePhoto (main profile photo URL)');
    console.log('- photos (array of photo URLs)');
    console.log('- profilePhotos (array for gallery)');
    console.log('- image (fallback field)');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkWorkingUser().catch(console.error);
