// Simple debug script to check interest issues
const debugInterests = async () => {
  try {
    console.log('Testing interests API endpoint...\n');
    
    // Test the interests API
    const response = await fetch('http://localhost:3000/api/profiles/interests?type=received', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Received interests:', data.length);
      console.log('Sample interests:', data.slice(0, 2));
    } else {
      const error = await response.text();
      console.log('Error:', error);
    }
    
    // Test send interest API
    console.log('\n\nTesting send interest API...\n');
    const sendResponse = await fetch('http://localhost:3000/api/profiles/send-interest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileId: '1750602178882-gjkhj02bbk',
        message: 'Test interest message'
      })
    });
    
    console.log('Send Interest Status:', sendResponse.status);
    console.log('Send Interest Status Text:', sendResponse.statusText);
    
    if (sendResponse.ok) {
      const sendData = await sendResponse.json();
      console.log('Send Interest Response:', sendData);
    } else {
      const sendError = await sendResponse.text();
      console.log('Send Interest Error:', sendError);
    }
    
  } catch (error) {
    console.error('Debug error:', error);
  }
};

debugInterests();
