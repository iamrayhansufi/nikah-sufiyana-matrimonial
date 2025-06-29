// Test the updated send interest API with the problematic profile ID
const testUpdatedAPI = async () => {
  try {
    console.log('🧪 Testing Updated Send Interest API...\n');
    
    // Test with the specific profile ID that was failing
    const profileId = '1750602178882-gjkhj02bbk';
    
    console.log(`Testing with profile ID: ${profileId}`);
    
    const response = await fetch('http://localhost:3000/api/profiles/send-interest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileId: profileId,
        message: 'Test interest from debug script'
      })
    });
    
    console.log('Response Status:', response.status);
    console.log('Response Status Text:', response.statusText);
    
    const responseText = await response.text();
    console.log('Response Body:', responseText);
    
    // Test the interests endpoint to see if it returns any received interests
    console.log('\n2. Testing interests endpoint...');
    const interestsResponse = await fetch('http://localhost:3000/api/profiles/interests?type=received');
    console.log('Interests Status:', interestsResponse.status);
    
    if (interestsResponse.ok) {
      const interestsData = await interestsResponse.json();
      console.log('Received interests count:', interestsData.length);
      
      if (interestsData.length > 0) {
        console.log('Sample interest:', {
          id: interestsData[0].id,
          status: interestsData[0].status,
          fromUser: interestsData[0].fromUser?.fullName
        });
      }
    } else {
      const interestsError = await interestsResponse.text();
      console.log('Interests Error:', interestsError);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

testUpdatedAPI();
