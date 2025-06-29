/**
 * Simple test to verify delete account endpoint is working
 * Run this in Node.js to test the endpoint
 */

const BASE_URL = 'http://localhost:3004'

async function testDeleteAccountEndpoint() {
  console.log('🧪 Testing delete account endpoint accessibility...')
  
  try {
    // Test 1: Check if the endpoint is accessible with GET (should return method info)
    console.log('\n1️⃣ Testing endpoint accessibility...')
    const response = await fetch(`${BASE_URL}/api/settings/delete-account`, {
      method: 'GET'
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Endpoint is accessible:', data.message)
    } else {
      console.log('❌ Endpoint not accessible:', response.status, response.statusText)
    }
    
    // Test 2: Test unauthorized DELETE request (should return 401)
    console.log('\n2️⃣ Testing unauthorized delete request...')
    const deleteResponse = await fetch(`${BASE_URL}/api/settings/delete-account`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (deleteResponse.status === 401) {
      console.log('✅ Properly returns 401 for unauthorized requests')
    } else {
      console.log('❌ Unexpected response for unauthorized request:', deleteResponse.status)
      const errorData = await deleteResponse.text()
      console.log('Response:', errorData)
    }
    
    console.log('\n✅ Delete account endpoint tests completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDeleteAccountEndpoint()
}

module.exports = { testDeleteAccountEndpoint }
