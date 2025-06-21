import fetch from 'node-fetch';

async function testRegistration() {
  try {
    console.log('🧪 Testing registration API...');
    
    const testUserData = {
      fullName: "Test User Registration",
      email: "test.registration@example.com",
      phone: "+91999888777",
      password: "SecurePassword123",
      gender: "Male",
      age: "25",
      country: "India",
      city: "Mumbai",
      location: "Mumbai, India",
      education: "Graduate",
      sect: "Sunni"
    };
    
    console.log('Sending registration request...');
    
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
      console.log('✅ Registration successful!');
    } else {
      console.log('❌ Registration failed:', responseData.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

testRegistration();
