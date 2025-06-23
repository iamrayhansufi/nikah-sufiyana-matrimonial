import { redis } from '../lib/redis-client';

async function testFailingDeletion() {
  try {
    console.log('🔍 Testing the failing deletion scenario...\n');
    
    const userId = 'user:1750495215968-bkyhp1mtzhi';
    const photoToDelete = '/api/secure-image/gallery-1750495215968-bkyhp1mtzhi-0-1750672186905';
    
    console.log(`👤 User: ${userId}`);
    console.log(`🗑️ Photo to delete: ${photoToDelete}`);
    
    // Step 1: Get current user data
    console.log('\n📊 Step 1: Getting current user data...');
    const user = await redis.hgetall(userId);
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found');
    console.log('Current photos:', user.photos);
    console.log('Current profilePhotos:', user.profilePhotos);
    
    // Step 2: Parse photos array - THIS IS WHERE THE BUG MIGHT BE
    console.log('\n📊 Step 2: Analyzing photo data type and parsing...');
    console.log('Type of user.photos:', typeof user.photos);
    console.log('Is array?', Array.isArray(user.photos));
    
    let photos: string[] = [];
    
    if (user.photos) {
      if (typeof user.photos === 'string') {
        console.log('📝 Photos is a string, parsing JSON...');
        try {
          photos = JSON.parse(user.photos);
          console.log('✅ Successfully parsed JSON');
        } catch (error) {
          console.error('❌ Error parsing photos JSON:', error);
          photos = [];
        }
      } else if (Array.isArray(user.photos)) {
        console.log('📝 Photos is already an array');
        photos = user.photos;
      } else {
        console.warn('⚠️ Unexpected photos format:', typeof user.photos, user.photos);
        photos = [];
      }
    }
    
    console.log('Parsed photos array:', photos);
    console.log('Photos array length:', photos.length);
    console.log('Photo to delete exists in array?', photos.includes(photoToDelete));
    
    // Step 3: Test the filtering logic
    console.log('\n📊 Step 3: Testing filtering logic...');
    console.log('Before filtering:', photos);
    const updatedPhotos = photos.filter(p => {
      const shouldKeep = p !== photoToDelete;
      console.log(`  Photo: "${p}" should be kept? ${shouldKeep}`);
      return shouldKeep;
    });
    console.log('After filtering:', updatedPhotos);
    console.log('Count change:', photos.length, '->', updatedPhotos.length);
    
    if (updatedPhotos.length === photos.length) {
      console.log('🚨 PROBLEM FOUND: No photos were filtered out!');
      console.log('This means the photo to delete was not found in the array');
      
      // Let's do a detailed comparison
      console.log('\n🔍 Detailed comparison:');
      console.log('Photo to delete length:', photoToDelete.length);
      photos.forEach((photo, index) => {
        console.log(`Photo ${index} length:`, photo.length);
        console.log(`Photo ${index} equals target?`, photo === photoToDelete);
        console.log(`Photo ${index}:`, JSON.stringify(photo));
        console.log(`Target photo:`, JSON.stringify(photoToDelete));
        
        if (photo !== photoToDelete) {
          // Find differences character by character
          const minLength = Math.min(photo.length, photoToDelete.length);
          for (let i = 0; i < minLength; i++) {
            if (photo[i] !== photoToDelete[i]) {
              console.log(`First difference at position ${i}: "${photo[i]}" vs "${photoToDelete[i]}"`);
              break;
            }
          }
        }
      });
    } else {
      console.log('✅ Filtering worked correctly');
    }
    
    // Step 4: Test if we can apply the update
    console.log('\n📊 Step 4: Testing update...');
    const updateData: { [key: string]: string } = {
      photos: JSON.stringify(updatedPhotos),
      profilePhotos: JSON.stringify(updatedPhotos)
    };
    
    console.log('Update data:', updateData);
    
    // Don't actually apply the update in this test, just simulate
    console.log('💾 Simulating HSET operation...');
    console.log('Would update:', Object.keys(updateData));
    
  } catch (error) {
    console.error('❌ Error in test:', error);
  } finally {
    process.exit(0);
  }
}

testFailingDeletion();
