// Test script to call the registration API
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testRegistrationApi() {
  console.log('Testing registration API...');
  
  // Create unique test data
  const timestamp = Date.now();
  const testUser = {
    fullName: 'API Test User',
    email: `apitest${timestamp}@example.com`,
    phone: `9876543${timestamp.toString().substring(8, 13)}`,
    password: 'Test12345',
    gender: 'female',
    age: '32',
    country: 'India',
    city: 'Delhi',
    location: 'Delhi',
    education: 'Masters',
    sect: 'Test',
    profession: 'Engineer',
    income: '100000',
    height: '165',
    complexion: 'Fair',
    maritalPreferences: 'Never Married',
    aboutMe: 'Test user for API testing',
    termsAccepted: true,
    privacyAccepted: true,
  };
  
  console.log(`Sending registration request for ${testUser.email}...`);
  
  try {
    // Call the registration API
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    // Get response data
    const responseData = await response.json();
    
    // Log result
    console.log(`API Response (${response.status}):`);
    console.log(JSON.stringify(responseData, null, 2));
    
    // Check if we should try the fallback route
    if (response.status === 500 && responseData?.details?.includes('authentication')) {
      console.log('\nTrying fallback registration route...');
      
      const fallbackResponse = await fetch('http://localhost:3000/api/temp-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      });
      
      const fallbackData = await fallbackResponse.json();
      console.log(`Fallback API Response (${fallbackResponse.status}):`);
      console.log(JSON.stringify(fallbackData, null, 2));
    }
  } catch (error) {
    console.error('Error calling API:', error);
  }
}

testRegistrationApi();
