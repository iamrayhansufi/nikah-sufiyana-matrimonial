import { redis } from '../lib/redis-client';

async function addTestPhoto() {
  try {
    console.log('🔍 Adding test photo for deletion testing...\n');
    
    const userId = 'user:1750495215968-bkyhp1mtzhi';
    const testPhoto = '/api/secure-image/test-photo-' + Date.now();
    
    // Get current photos
    const user = await redis.hgetall(userId);
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    let currentPhotos: string[] = [];
    if (Array.isArray(user.photos)) {
      currentPhotos = user.photos;
    } else if (typeof user.photos === 'string') {
      currentPhotos = JSON.parse(user.photos);
    }
    
    console.log('Current photos:', currentPhotos);
    console.log('Current count:', currentPhotos.length);
    
    // Add the test photo if it doesn't exist
    if (!currentPhotos.includes(testPhoto)) {
      currentPhotos.push(testPhoto);
      
      const updateData = {
        photos: JSON.stringify(currentPhotos),
        profilePhotos: JSON.stringify(currentPhotos)
      };
      
      console.log('Adding test photo...');
      await redis.hset(userId, updateData);
      
      console.log('✅ Test photo added');
      console.log('New photos:', currentPhotos);
      console.log('New count:', currentPhotos.length);
    } else {
      console.log('✅ Test photo already exists');
    }
    
  } catch (error) {
    console.error('❌ Error adding test photo:', error);
  } finally {
    process.exit(0);
  }
}

addTestPhoto();
