const photoToDelete = '/uploads/profiles/photo2.jpg';

async function testDeletePhotoAPI() {
  try {
    console.log('🔍 Testing DELETE photo API via HTTP request...\n');
    console.log('🗑️ Deleting photo:', photoToDelete);
    
    const response = await fetch('http://localhost:3000/api/profiles/delete-photo', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({ photoUrl: photoToDelete })
    });
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error response:', errorData);
      return;
    }
    
    const result = await response.json();
    console.log('✅ Success response:', result);
    
    // Now fetch the profile to verify the update
    console.log('\n🔍 Fetching profile to verify deletion...');
    const profileResponse = await fetch('http://localhost:3000/api/profiles/1', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('📸 Profile photos after deletion:', profileData.profilePhotos);
      console.log('📸 Profile photo after deletion:', profileData.profilePhoto);
    } else {
      console.error('❌ Failed to fetch profile:', profileResponse.status);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testDeletePhotoAPI();
