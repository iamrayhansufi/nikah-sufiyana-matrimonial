import { database } from '../lib/database-service';

async function testDatabaseServicePhotos() {
  try {
    console.log('🔍 Testing database service for photos...\n');
    
    const userId = 'user:1750495215968-bkyhp1mtzhi';
    console.log(`👤 Getting user via database service: ${userId}`);
    
    const userData = await database.users.getById(userId);
    
    if (!userData) {
      console.log('❌ User not found via database service');
      return;
    }
    
    console.log('✅ User found via database service');
    console.log('📊 User data keys:', Object.keys(userData));
    console.log('📸 User photos:', userData.photos);
    console.log('📸 User profilePhotos:', userData.profilePhotos);
    console.log('📸 User profilePhoto:', userData.profilePhoto);
      // Check if photos is an array or string
    if (userData.photos) {
      if (Array.isArray(userData.photos)) {
        console.log('📊 Photos is array, count:', userData.photos.length);
        userData.photos.forEach((photo: string, index: number) => {
          console.log(`  ${index}: ${photo}`);
        });
      } else if (typeof userData.photos === 'string') {
        console.log('📊 Photos is string, trying to parse...');
        try {
          const parsed: string[] = JSON.parse(userData.photos);
          console.log('📊 Parsed photos count:', parsed.length);
          parsed.forEach((photo: string, index: number) => {
            console.log(`  ${index}: ${photo}`);
          });
        } catch (e) {
          console.error('❌ Error parsing photos string:', e);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing database service:', error);
  } finally {
    process.exit(0);
  }
}

testDatabaseServicePhotos();
