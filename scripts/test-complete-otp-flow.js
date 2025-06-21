// Test script for complete OTP flow
const testCompleteOTPFlow = async () => {
  console.log('🧪 Testing complete OTP flow...');
  
  const testEmail = 'test@example.com';
  
  try {
    // Step 1: Test validation
    console.log('� Step 1: Testing validation...');
    const response = await fetch('http://localhost:3000/api/verify/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'invalid-email',
        code: '12345', // Wrong length
        purpose: 'registration'
      })
    });
    
    const validationData = await response.json();
    console.log('Validation response:', validationData);
    
    if (response.status === 400 && validationData.error === 'Validation failed') {
      console.log('✅ Validation is working correctly');
    } else {
      console.log('❌ Validation not working as expected');
    }
    
    // Step 2: Test with proper format but invalid code
    console.log('🔍 Step 2: Testing with proper format but invalid code...');
    const response2 = await fetch('http://localhost:3000/api/verify/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testEmail,
        code: '123456',
        purpose: 'registration'
      })
    });
    
    const data2 = await response2.json();
    console.log('Invalid code response:', data2);
    
    if (response2.status === 400 && data2.success === false) {
      console.log('✅ Invalid code handling is working correctly');
    } else {
      console.log('❌ Invalid code handling not working as expected');
    }
    
  } catch (error) {
    console.error('❌ Error in test:', error);
  }
};

testCompleteOTPFlow();
