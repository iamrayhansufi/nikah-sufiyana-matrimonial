// Debug script to check profile ID formats and Redis keys
const debugProfileIds = async () => {
  try {
    console.log('🔍 Debugging Profile ID Issues...\n');
    
    // First, let's check what user keys exist in Redis
    console.log('1. Checking existing Redis user keys...');
    const response = await fetch('http://localhost:3000/api/profiles/send-interest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileId: '1750602178882-gjkhj02bbk',
        message: 'Debug test'
      })
    });
    
    console.log('API Response Status:', response.status);
    const responseText = await response.text();
    console.log('API Response:', responseText);
    
    // Also test the profiles endpoint to see what IDs are returned
    console.log('\n2. Checking profiles endpoint...');
    const profilesResponse = await fetch('http://localhost:3000/api/profiles?limit=5');
    
    if (profilesResponse.ok) {
      const profilesData = await profilesResponse.json();
      console.log('Found profiles:', profilesData.profiles?.length || 0);
      
      if (profilesData.profiles && profilesData.profiles.length > 0) {
        console.log('Sample profile IDs:');
        profilesData.profiles.slice(0, 3).forEach((profile, index) => {
          console.log(`  ${index + 1}. ID: "${profile.id}", Name: "${profile.name}"`);
        });
      }
    } else {
      const profilesError = await profilesResponse.text();
      console.log('Profiles API Error:', profilesError);
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
};

debugProfileIds();
