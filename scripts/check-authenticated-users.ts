import { redis } from '../lib/redis-client';

async function checkAuthenticatedUsers() {
  try {
    console.log('🔍 Checking for authenticated users...\n');
    
    // Get all user keys
    const userKeys = await redis.keys('user:*');
    console.log('📊 Available user keys:', userKeys);
      for (const userKey of userKeys) {
      const userData = await redis.hgetall(userKey);
      if (userData && userData.email && userData.password) {
        console.log(`\n👤 User: ${userKey}`);
        console.log('📧 Email:', userData.email);
        console.log('🔐 Has password:', !!userData.password);
        console.log('✅ Verified:', userData.verified);
        console.log('📸 Has photos:', !!userData.photos);
        
        if (userData.photos) {
          let photos = [];
          try {
            if (typeof userData.photos === 'string') {
              photos = JSON.parse(userData.photos);
            } else if (Array.isArray(userData.photos)) {
              photos = userData.photos;
            }
            console.log('📸 Photo count:', photos.length);
            console.log('📸 Photos:', photos);
          } catch (e) {
            console.log('❌ Error parsing photos:', e);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking authenticated users:', error);
  } finally {
    process.exit(0);
  }
}

checkAuthenticatedUsers();
