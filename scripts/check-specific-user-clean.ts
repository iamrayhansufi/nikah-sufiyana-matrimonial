import { redis } from '../lib/redis-client';

async function checkSpecificUser() {
  try {
    console.log('🔍 Checking specific user with deletion issue...\n');
    
    const userId = 'user:1750495215968-bkyhp1mtzhi';
    console.log(`👤 Checking user: ${userId}`);
    
    const userData = await redis.hgetall(userId);
    
    if (!userData) {
      console.log('❌ User data not found');
      return;
    }
    
    console.log('📄 User data keys:', Object.keys(userData));
    
    // Check photo fields
    console.log('\n📸 Photo fields:');
    console.log('profilePhoto:', userData.profilePhoto);
    console.log('photos:', userData.photos);
    console.log('profilePhotos:', userData.profilePhotos);
    
    // Parse photos to see the array
    if (userData.photos) {
      let photosArray: string[] = [];
      try {
        if (typeof userData.photos === 'string') {
          photosArray = JSON.parse(userData.photos);
        } else if (Array.isArray(userData.photos)) {
          photosArray = userData.photos;
        }
        console.log('\n📸 Parsed photos array:');
        photosArray.forEach((photo: string, index: number) => {
          console.log(`  ${index}: ${photo}`);
        });
        console.log('📊 Total photos count:', photosArray.length);
      } catch (e) {
        console.log('❌ Error parsing photos:', e);
      }
    }
    
    // Check profilePhotos too
    if (userData.profilePhotos) {
      let profilePhotosArray: string[] = [];
      try {
        if (typeof userData.profilePhotos === 'string') {
          profilePhotosArray = JSON.parse(userData.profilePhotos);
        } else if (Array.isArray(userData.profilePhotos)) {
          profilePhotosArray = userData.profilePhotos;
        }
        console.log('\n📸 Parsed profilePhotos array:');
        profilePhotosArray.forEach((photo: string, index: number) => {
          console.log(`  ${index}: ${photo}`);
        });
        console.log('📊 Total profilePhotos count:', profilePhotosArray.length);
      } catch (e) {
        console.log('❌ Error parsing profilePhotos:', e);
      }
    }
    
    // Additional user verification info
    console.log('\n📋 User verification info:');
    console.log(`- Verified: ${userData.verified} (type: ${typeof userData.verified})`);
    console.log(`- Email Verified: ${userData.emailVerified} (type: ${typeof userData.emailVerified})`);
    console.log(`- Active: ${userData.active}`);
    console.log(`- Role: ${userData.role}`);
    console.log(`- Created: ${userData.createdAt}`);
    console.log(`- Last Active: ${userData.lastActive}`);
    
    const isVerified = userData.verified === true || userData.verified === 'true';
    console.log(`\n✅ Is Actually Verified: ${isVerified}`);
    
    if (!isVerified) {
      console.log('\n⚠️  User is NOT verified in database - verification needed');
      console.log('This user needs to complete email verification');
    } else {
      console.log('\n🔧 User IS verified in database');
    }
    
    // Check all fields to see if this is a complete user
    const requiredFields = ['fullName', 'email', 'age', 'gender'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    
    if (missingFields.length > 0) {
      console.log(`\n⚠️  Missing required fields: ${missingFields.join(', ')}`);
      console.log('This might be an incomplete user from earlier tests');
    } else {
      console.log('\n✅ User has all required profile fields');
    }
    
  } catch (error) {
    console.error('❌ Error checking user:', error);
  } finally {
    process.exit(0);
  }
}

checkSpecificUser();
