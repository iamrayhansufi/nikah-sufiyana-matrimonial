import { redis } from '../lib/redis-client';

async function debugRedisStorage() {
  console.log('🔍 Debugging Redis storage mechanisms...\n');
  
  try {
    const testUserId = '1';
      // Test 1: Store simple string
    console.log('Test 1: Storing simple string');
    await redis.hset(`user:${testUserId}`, { test_field: 'simple_string' });
    const result1 = await redis.hget(`user:${testUserId}`, 'test_field');
    console.log('Retrieved string:', result1, 'Type:', typeof result1);
    
    // Test 2: Store JSON string
    console.log('\nTest 2: Storing JSON string');
    const jsonData = JSON.stringify(['photo1.jpg', 'photo2.jpg']);
    console.log('Storing JSON:', jsonData);
    await redis.hset(`user:${testUserId}`, { test_json: jsonData });
    const result2 = await redis.hget(`user:${testUserId}`, 'test_json');
    console.log('Retrieved JSON:', result2, 'Type:', typeof result2);
    
    if (typeof result2 === 'string') {
      try {
        const parsed = JSON.parse(result2);
        console.log('✅ Successfully parsed:', parsed);
      } catch (e) {
        console.log('❌ Parse error:', e);
      }
    }
    
    // Test 3: Store array directly (this might be the issue)
    console.log('\nTest 3: Storing array directly');
    const arrayData = ['photo1.jpg', 'photo2.jpg'];
    await redis.hset(`user:${testUserId}`, { test_array: JSON.stringify(arrayData) });
    const result3 = await redis.hget(`user:${testUserId}`, 'test_array');
    console.log('Retrieved array:', result3, 'Type:', typeof result3);
    
    // Test 4: Check current photos field
    console.log('\nTest 4: Current photos field');
    const photosField = await redis.hget(`user:${testUserId}`, 'photos');
    console.log('Current photos field:', photosField);
    console.log('Type:', typeof photosField);
    console.log('Is array:', Array.isArray(photosField));
      // Test 5: Fix the photos field by storing as JSON string
    console.log('\nTest 5: Fixing photos field');
    const currentPhotos = Array.isArray(photosField) ? photosField : ['test-photo-1.jpg'];
    const fixedPhotosJson = JSON.stringify(currentPhotos);
    console.log('Fixing with JSON:', fixedPhotosJson);
    await redis.hset(`user:${testUserId}`, { photos: fixedPhotosJson });
    
    // Verify fix
    const verifyPhotos = await redis.hget(`user:${testUserId}`, 'photos');
    console.log('Verified photos field:', verifyPhotos);
    console.log('Type:', typeof verifyPhotos);
    
    if (typeof verifyPhotos === 'string') {
      try {
        const parsedPhotos = JSON.parse(verifyPhotos);
        console.log('✅ Successfully parsed photos:', parsedPhotos);
      } catch (e) {
        console.log('❌ Still can\'t parse:', e);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugRedisStorage().catch(console.error);
