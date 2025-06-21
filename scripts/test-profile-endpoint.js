const fetch = require('node-fetch');

async function testProfileAPI() {
  console.log('🧪 Testing Profile API endpoint...\n');
  
  // Use the test user we just created
  const testUserId = 'user:1750488515367-yfuq392lg8p';
  
  try {
    const response = await fetch(`http://localhost:3000/api/profiles/${testUserId}?public=true`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Profile API response successful');
      console.log('Response keys:', Object.keys(data));
      console.log('Profile data sample:');
      console.log(`- Name: ${data.name}`);
      console.log(`- Full Name: ${data.fullName}`);
      console.log(`- Age: ${data.age}`);
      console.log(`- Gender: ${data.gender}`);
      console.log(`- Location: ${data.location}`);
    } else {
      console.log('❌ Profile API response failed:', response.status);
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error testing profile API:', error);
  }
}

testProfileAPI().catch(console.error);
