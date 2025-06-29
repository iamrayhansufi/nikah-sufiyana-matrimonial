// Test script for delete account API
const testDeleteAccountAPI = async () => {
  try {
    console.log('🧪 Testing Delete Account API...\n');
    
    // First test with GET to see if route is accessible
    console.log('1. Testing route accessibility with GET...');
    const getResponse = await fetch('http://localhost:3000/api/settings/delete-account');
    console.log('GET Status:', getResponse.status);
    
    if (getResponse.ok) {
      const getData = await getResponse.json();
      console.log('GET Response:', getData);
    } else {
      const getError = await getResponse.text();
      console.log('GET Error:', getError);
    }
    
    // Test with OPTIONS method
    console.log('\n2. Testing with OPTIONS method...');
    const optionsResponse = await fetch('http://localhost:3000/api/settings/delete-account', {
      method: 'OPTIONS'
    });
    console.log('OPTIONS Status:', optionsResponse.status);
    
    // Test with DELETE method (this will fail due to auth, but should not be 404)
    console.log('\n3. Testing with DELETE method...');
    const deleteResponse = await fetch('http://localhost:3000/api/settings/delete-account', {
      method: 'DELETE'
    });
    console.log('DELETE Status:', deleteResponse.status);
    
    if (deleteResponse.status === 404) {
      console.log('❌ Still getting 404 - route not found');
    } else if (deleteResponse.status === 401) {
      console.log('✅ Route found but unauthorized (expected without login)');
    } else {
      console.log('🔍 Unexpected status, checking response...');
      const deleteData = await deleteResponse.text();
      console.log('DELETE Response:', deleteData);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

testDeleteAccountAPI();
