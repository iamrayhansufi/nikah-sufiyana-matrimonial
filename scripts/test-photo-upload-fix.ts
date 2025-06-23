import { redis } from '../lib/redis-client';

async function testPhotoUploadFix() {
  console.log('🔧 Testing photo upload fix...\n');
  
  try {
    const problemUserId = 'user:1750495215968-bkyhp1mtzhi';
    
    console.log('1. Testing Redis connection...');
    await redis.ping();
    console.log('✅ Redis connection working');
      console.log('\n2. Checking user exists...');
    const userData = await redis.hgetall(problemUserId);
    if (!userData) {
      console.log('❌ User not found in database');
      return;
    }
    
    console.log(`User data fields: ${Object.keys(userData).length}`);
    console.log(`User name: ${userData.fullName || 'Not found'}`);
    
    if (Object.keys(userData).length === 0) {
      console.log('❌ User not found in database');
      return;
    }
    
    console.log('\n3. Testing photo field update...');
    const testPhotoUrl = '/api/secure-image/test-photo-123';
    
    // Simulate what the upload API does
    const updateData = {
      photos: JSON.stringify([testPhotoUrl]),
      profilePhotos: JSON.stringify([testPhotoUrl]),
      profilePhoto: testPhotoUrl
    };
    
    console.log('Updating with data:', Object.keys(updateData));
    
    const redisResult = await redis.hset(problemUserId, updateData);
    console.log('Redis hset result:', redisResult);
    
    console.log('\n4. Verifying update...');
    const verifyPhotos = await redis.hget(problemUserId, 'photos');
    const verifyProfilePhoto = await redis.hget(problemUserId, 'profilePhoto');
    
    console.log('Verification results:');
    console.log('  photos field:', verifyPhotos);
    console.log('  profilePhoto field:', verifyProfilePhoto);
    
    if (verifyPhotos && verifyProfilePhoto) {
      console.log('✅ Photo update test SUCCESSFUL');
      
      // Clean up test data
      await redis.hdel(problemUserId, 'photos', 'profilePhotos', 'profilePhoto');
      console.log('🧹 Test data cleaned up');
    } else {
      console.log('❌ Photo update test FAILED');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testPhotoUploadFix();
