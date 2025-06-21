import fetch from 'node-fetch';

async function testUserAPI() {
  try {
    console.log('🔍 Testing user API responses...');
    
    // Test the profiles list endpoint
    console.log('\n1. Testing /api/profiles endpoint:');
    const profilesResponse = await fetch('http://localhost:3000/api/profiles?limit=2');
    if (profilesResponse.ok) {
      const profilesData = await profilesResponse.json() as any;
      console.log('✅ Profiles API Response:');
      if (profilesData.profiles && profilesData.profiles.length > 0) {
        const firstProfile = profilesData.profiles[0];
        console.log(`  - Profile ID: ${firstProfile.id}`);
        console.log(`  - Name: ${firstProfile.name}`);
        console.log(`  - Full Name: ${firstProfile.fullName}`);
        console.log(`  - Profile Photo: ${firstProfile.profilePhoto}`);
        console.log(`  - Image: ${firstProfile.image}`);
      } else {
        console.log('  No profiles found');
      }
    } else {
      console.log('❌ Profiles API failed:', profilesResponse.status);
    }
    
    // Test individual profile endpoint
    console.log('\n2. Testing /api/profiles/user:1 endpoint:');
    const singleProfileResponse = await fetch('http://localhost:3000/api/profiles/user:1?public=true');
    if (singleProfileResponse.ok) {
      const profileData = await singleProfileResponse.json() as any;
      console.log('✅ Single Profile API Response:');
      console.log(`  - Profile ID: ${profileData.id}`);
      console.log(`  - Name: ${profileData.name}`);
      console.log(`  - Full Name: ${profileData.fullName}`);
      console.log(`  - Profile Photo: ${profileData.profilePhoto}`);
      console.log(`  - Image: ${profileData.image}`);
    } else {
      console.log('❌ Single Profile API failed:', singleProfileResponse.status);
      const errorText = await singleProfileResponse.text();
      console.log('  Error:', errorText);
    }
    
    console.log('\n✅ API testing completed');
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testUserAPI();
