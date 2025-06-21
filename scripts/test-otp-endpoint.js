// Test script for OTP verification endpoint
const test = async () => {
  console.log('🧪 Testing /api/verify/verify-otp endpoint...');
  
  try {
    const response = await fetch('http://localhost:3000/api/verify/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        code: '123456',
        purpose: 'registration'
      })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.status === 400) {
      console.log('✅ Expected 400 response (invalid/expired code)');
    } else {
      console.log('❌ Unexpected response status');
    }
  } catch (error) {
    console.error('❌ Error testing endpoint:', error);
  }
};

test();
