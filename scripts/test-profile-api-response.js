async function testProfileAPI() {
  try {
    console.log('🔍 Testing profile API response...\n');
    
    const userId = '1750495215968-bkyhp1mtzhi'; // Without the 'user:' prefix for API call
    const response = await fetch(`http://localhost:3000/api/profiles/${userId}?public=true`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error response:', errorData);
      return;
    }
    
    const profileData = await response.json();
    console.log('📊 Profile API response keys:', Object.keys(profileData));
    console.log('📸 Profile API profilePhotos:', profileData.profilePhotos);
    console.log('📸 Profile API profilePhoto:', profileData.profilePhoto);
    console.log('📸 Profile API image:', profileData.image);
    
    if (Array.isArray(profileData.profilePhotos)) {
      console.log('📊 ProfilePhotos count:', profileData.profilePhotos.length);
      profileData.profilePhotos.forEach((photo, index) => {
        console.log(`  ${index}: ${photo}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing profile API:', error);
  }
}

testProfileAPI();
