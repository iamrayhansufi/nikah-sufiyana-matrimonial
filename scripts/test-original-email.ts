import fetch from 'node-fetch';

async function testOriginalEmail() {
  try {
    console.log('🧪 Testing registration with the original failing email...');
    
    const testUserData = {
      fullName: "Rehan Sufi",
      email: "thesufi.rehan@gmail.com",
      phone: "+91888999777",
      password: "SecurePassword123",
      gender: "Male",
      age: "26",
      country: "India",
      city: "Delhi",
      location: "Delhi, India",
      education: "Graduate",
      sect: "Sunni"
    };
    
    console.log('Sending registration request with original email...');
    
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUserData)
    });
    
    const responseData = await response.json() as any;
    
    console.log('Registration response status:', response.status);
    console.log('Registration response:', responseData);
    
    if (response.ok) {
      console.log('✅ Registration with original email successful!');
    } else {
      console.log('❌ Registration failed:', responseData.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

testOriginalEmail();
