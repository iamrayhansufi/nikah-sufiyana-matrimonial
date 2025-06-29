// Test script to simulate sending an interest and checking dashboard
const testInterestFlow = async () => {
  try {
    console.log('🧪 Testing Interest Flow...\n');
    
    // Step 1: Try to send an interest
    console.log('1. Testing send interest API...');
    const sendResponse = await fetch('http://localhost:3000/api/profiles/send-interest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileId: 'user:test-user-id',
        message: 'Test interest message from debug script'
      })
    });
    
    console.log('Send Interest Status:', sendResponse.status);
    
    if (sendResponse.ok) {
      const sendData = await sendResponse.json();
      console.log('✅ Interest sent successfully:', sendData);
      
      // Step 2: Check if interest appears in received interests
      console.log('\n2. Checking received interests...');
      
      // Wait a bit for the interest to be processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const receivedResponse = await fetch('http://localhost:3000/api/profiles/interests?type=received');
      console.log('Received Interests Status:', receivedResponse.status);
      
      if (receivedResponse.ok) {
        const receivedData = await receivedResponse.json();
        console.log('✅ Received interests:', receivedData.length);
        console.log('Sample received interests:', receivedData.slice(0, 2));
        
        // Check if our test interest is in the list
        const testInterest = receivedData.find(interest => 
          interest.message && interest.message.includes('Test interest message')
        );
        
        if (testInterest) {
          console.log('✅ Test interest found in received interests:', testInterest.id);
        } else {
          console.log('❌ Test interest not found in received interests');
        }
      } else {
        const receivedError = await receivedResponse.text();
        console.log('❌ Error fetching received interests:', receivedError);
      }
      
    } else {
      const sendError = await sendResponse.text();
      console.log('❌ Error sending interest:', sendError);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Run the test
testInterestFlow();
