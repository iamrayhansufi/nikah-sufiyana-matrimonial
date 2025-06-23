import { redis } from '../lib/redis-client';

async function simulatePhotoDeletion() {
  try {
    console.log('🔍 Simulating exact photo deletion operation...\n');
    
    const userId = 'user:1750495215968-bkyhp1mtzhi';
    const photoToDelete = '/api/secure-image/gallery-1750495215968-bkyhp1mtzhi-0-1750672757954';
    
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
    console.log('Current profilePhoto:', user.profilePhoto);
    
    // Step 2: Parse photos array
    console.log('\n📊 Step 2: Parsing photos array...');
    let photos: string[] = [];
    
    if (user.photos) {
      if (typeof user.photos === 'string') {
        try {
          photos = JSON.parse(user.photos);
          console.log('✅ Parsed photos from JSON string');
        } catch (error) {
          console.error('❌ Error parsing photos JSON:', error);
          photos = [];
        }
      } else if (Array.isArray(user.photos)) {
        photos = user.photos;
        console.log('✅ Photos already an array');
      } else {
        console.warn('⚠️ Unexpected photos format:', typeof user.photos, user.photos);
        photos = [];
      }
    }
    
    console.log('Photos before deletion:', photos);
    console.log('Photo to delete exists?', photos.includes(photoToDelete));
    
    // Step 3: Filter out the photo
    console.log('\n📊 Step 3: Filtering out the photo...');
    const updatedPhotos = photos.filter(p => p !== photoToDelete);
    console.log('Photos after filtering:', updatedPhotos);
    console.log('Photos count before:', photos.length, 'after:', updatedPhotos.length);
    
    // Step 4: Prepare update data
    console.log('\n📊 Step 4: Preparing update data...');
    const updateData: { [key: string]: string } = {
      photos: JSON.stringify(updatedPhotos),
      profilePhotos: JSON.stringify(updatedPhotos)
    };
    
    // Check if deleted photo was the main profile photo
    if (user.profilePhoto === photoToDelete) {
      updateData.profilePhoto = updatedPhotos.length > 0 ? updatedPhotos[0] : "";
      console.log('🚨 Main profile photo updated to:', updateData.profilePhoto);
    }
    
    console.log('Update data:', updateData);
    
    // Step 5: Apply the update
    console.log('\n📊 Step 5: Applying update to Redis...');
    try {
      const result = await redis.hset(userId, updateData);
      console.log('✅ HSET result:', result);
    } catch (error) {
      console.error('❌ HSET error:', error);
      return;
    }
    
    // Step 6: Verify the update
    console.log('\n📊 Step 6: Verifying the update...');
    const updatedUser = await redis.hgetall(userId);
    
    if (!updatedUser) {
      console.log('❌ Failed to retrieve updated user data');
      return;
    }
    
    console.log('Updated photos:', updatedUser.photos);
    console.log('Updated profilePhotos:', updatedUser.profilePhotos);
    console.log('Updated profilePhoto:', updatedUser.profilePhoto);
      // Parse and verify
    let verifyPhotos: string[] = [];
    if (updatedUser.photos) {
      if (typeof updatedUser.photos === 'string') {
        try {
          verifyPhotos = JSON.parse(updatedUser.photos);
        } catch (e) {
          console.error('❌ Error parsing verified photos:', e);
        }
      } else if (Array.isArray(updatedUser.photos)) {
        verifyPhotos = updatedUser.photos;
      }
      
      console.log('✅ Verified photos array:', verifyPhotos);
      console.log('✅ Verified photos count:', verifyPhotos.length);
      console.log('✅ Deleted photo still exists?', verifyPhotos.includes(photoToDelete));
    }
    
    if (verifyPhotos.length === updatedPhotos.length && !verifyPhotos.includes(photoToDelete)) {
      console.log('🎉 DELETION SUCCESSFUL!');
    } else {
      console.log('❌ DELETION FAILED - Photo still exists in Redis');
      console.log('Expected count:', updatedPhotos.length, 'Actual count:', verifyPhotos.length);
      console.log('Photo still exists:', verifyPhotos.includes(photoToDelete));
    }
    
  } catch (error) {
    console.error('❌ Error in photo deletion simulation:', error);
  } finally {
    process.exit(0);
  }
}

simulatePhotoDeletion();
