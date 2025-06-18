// Test script for the automatic fallback behavior of the registration API
// This will test both normal registration and fallback scenarios
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testRegistrationWithFallback() {
  console.log('======= TESTING REGISTRATION API WITH FALLBACK =======');
  
  // Create unique test data
  const timestamp = Date.now();
  const testUser = {
    fullName: 'Fallback Test User',
    email: `fallbacktest${timestamp}@example.com`,
    phone: `9876543${timestamp.toString().substring(8, 13)}`,
    password: 'Test12345',
    gender: 'female',
    age: '28',
    country: 'India',
    city: 'Mumbai',
    location: 'Mumbai',
    education: 'Masters',
    sect: 'Test',
    profession: 'Engineer',
    income: '100000',
    height: '165',
    complexion: 'Fair',
    maritalPreferences: 'Never Married',
    aboutMe: 'Test user for fallback API testing',
    termsAccepted: true,
    privacyAccepted: true,
  };
  
  console.log(`\nSending registration request for ${testUser.email}...`);
  
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
    
    // Check for fallback behavior
    if (responseData?.tempRegistration) {
      console.log('\n✓ Automatic fallback registration worked successfully!');
      console.log('  User data was stored locally for later migration to database.');
      
      // Verify the file was created
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'temp-registrations', `${testUser.email.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
      
      if (fs.existsSync(filePath)) {
        console.log(`  ✓ Verified: File created at ${filePath}`);
      } else {
        console.log(`  ✗ Error: File not found at ${filePath}`);
      }
    } else if (response.status === 201 && responseData.success) {
      console.log('\n✓ Normal registration worked successfully!');
      console.log('  User was created directly in the database.');
    } else {
      console.log('\n✗ Registration failed without proper fallback.');
    }
  } catch (error) {
    console.error('\n✗ Error calling API:', error);
  }
  
  console.log('\n======= TEST COMPLETE =======');
}

testRegistrationWithFallback();
