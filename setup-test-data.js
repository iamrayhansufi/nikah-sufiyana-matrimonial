// Setup test user and interests for dashboard testing
const setupTestData = async () => {
  try {
    console.log('Setting up test user and interests...');
    
    // 1. Create a test user account
    const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: 'Test User',
        email: 'testuser@example.com',
        password: 'TestPassword123!',
        phone: '+1234567890',
        gender: 'male',
        age: 28,
        country: 'Pakistan',
        city: 'Karachi',
        preferredLocation: 'Karachi',
        education: 'Bachelors',
        sect: 'Sunni',
        height: '5\'8"'
      })
    });
    
    console.log('Register response status:', registerResponse.status);
    const registerData = await registerResponse.text();
    console.log('Register response:', registerData);
    
    // 2. Try to log in
    const loginResponse = await fetch('http://localhost:3001/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'TestPassword123!'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    const loginData = await loginResponse.text();
    console.log('Login response:', loginData);
    
  } catch (error) {
    console.error('Error setting up test data:', error);
  }
};

setupTestData();
