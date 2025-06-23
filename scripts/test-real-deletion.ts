import { redis } from '../lib/redis-client';

async function testRealDeletion() {
  try {
    console.log('🔍 Testing real deletion with Redis HSET...\n');
    
    const userId = 'user:1750495215968-bkyhp1mtzhi';
    const photoToDelete = '/api/secure-image/gallery-1750495215968-bkyhp1mtzhi-0-1750672186905';
    
    console.log(`👤 User: ${userId}`);
    console.log(`🗑️ Photo to delete: ${photoToDelete}`);
    
    // Step 1: Get current state
    console.log('\n📊 Before deletion:');
    const beforeUser = await redis.hgetall(userId);
    if (!beforeUser) {
      console.log('❌ User not found');
      return;
    }
    
    let beforePhotos: string[] = [];
    if (Array.isArray(beforeUser.photos)) {
      beforePhotos = beforeUser.photos;
    } else if (typeof beforeUser.photos === 'string') {
      beforePhotos = JSON.parse(beforeUser.photos);
    }
    
    console.log('Before photos count:', beforePhotos.length);
    console.log('Before photos:', beforePhotos);
    console.log('Photo to delete exists?', beforePhotos.includes(photoToDelete));
    
    // Step 2: Apply the real deletion
    console.log('\n🗑️ Applying real deletion...');
    const updatedPhotos = beforePhotos.filter(p => p !== photoToDelete);
    console.log('After filtering count:', updatedPhotos.length);
    console.log('After filtering:', updatedPhotos);
    
    const updateData: { [key: string]: string } = {
      photos: JSON.stringify(updatedPhotos),
      profilePhotos: JSON.stringify(updatedPhotos)
    };
    
    console.log('Update data:', updateData);
    
    // Step 3: Execute the HSET
    console.log('\n💾 Executing Redis HSET...');
    try {
      const hsetResult = await redis.hset(userId, updateData);
      console.log('HSET result:', hsetResult);
      console.log('HSET result type:', typeof hsetResult);
    } catch (hsetError) {
      console.error('❌ HSET error:', hsetError);
      return;
    }
    
    // Step 4: Verify immediately
    console.log('\n✅ Immediate verification:');
    const afterUser = await redis.hgetall(userId);
    if (!afterUser) {
      console.log('❌ User not found after update');
      return;
    }
    
    console.log('After photos raw:', afterUser.photos);
    console.log('After profilePhotos raw:', afterUser.profilePhotos);
    
    let afterPhotos: string[] = [];
    if (Array.isArray(afterUser.photos)) {
      afterPhotos = afterUser.photos;
    } else if (typeof afterUser.photos === 'string') {
      afterPhotos = JSON.parse(afterUser.photos);
    }
    
    console.log('After photos count:', afterPhotos.length);
    console.log('After photos:', afterPhotos);
    console.log('Deleted photo still exists?', afterPhotos.includes(photoToDelete));
    
    // Step 5: Check if deletion was successful
    console.log('\n📊 Deletion analysis:');
    console.log('Before count:', beforePhotos.length);
    console.log('After count:', afterPhotos.length);
    console.log('Count decreased?', afterPhotos.length < beforePhotos.length);
    console.log('Target photo removed?', !afterPhotos.includes(photoToDelete));
    
    if (afterPhotos.length < beforePhotos.length && !afterPhotos.includes(photoToDelete)) {
      console.log('🎉 DELETION SUCCESSFUL!');
    } else {
      console.log('❌ DELETION FAILED');
      
      if (afterPhotos.length === beforePhotos.length) {
        console.log('Problem: Photo count did not decrease');
      }
      if (afterPhotos.includes(photoToDelete)) {
        console.log('Problem: Target photo still exists');
      }
    }
    
  } catch (error) {
    console.error('❌ Error in real deletion test:', error);
  } finally {
    process.exit(0);
  }
}

testRealDeletion();
