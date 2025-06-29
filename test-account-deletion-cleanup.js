/**
 * Test script to verify account deletion and session cleanup
 * Run in browser console after attempting to delete an account
 */

async function testAccountDeletion() {
  console.log('🧪 Testing account deletion and session cleanup...')
  
  // Test 1: Check if session is still valid
  console.log('\n1️⃣ Testing session validity...')
  try {
    const sessionResponse = await fetch('/api/auth/session')
    const sessionData = await sessionResponse.json()
    
    if (!sessionData || !sessionData.user) {
      console.log('✅ Session successfully cleared')
    } else {
      console.log('❌ Session still exists:', sessionData.user)
    }
  } catch (error) {
    console.log('✅ Session cleared (fetch failed as expected):', error.message)
  }
  
  // Test 2: Try to fetch user profile
  console.log('\n2️⃣ Testing profile access...')
  try {
    const profileResponse = await fetch('/api/profiles/user', {
      credentials: 'include'
    })
    
    if (profileResponse.status === 401) {
      console.log('✅ Profile access properly denied (401 Unauthorized)')
    } else if (profileResponse.status === 404) {
      console.log('✅ Profile not found (404) - expected after deletion')
    } else {
      console.log('❌ Unexpected profile response:', profileResponse.status)
      const data = await profileResponse.json()
      console.log('Profile data:', data)
    }
  } catch (error) {
    console.log('✅ Profile access failed as expected:', error.message)
  }
  
  // Test 3: Check local storage
  console.log('\n3️⃣ Testing local storage cleanup...')
  const localStorageKeys = Object.keys(localStorage)
  if (localStorageKeys.length === 0) {
    console.log('✅ Local storage successfully cleared')
  } else {
    console.log('❌ Local storage still contains data:', localStorageKeys)
  }
  
  // Test 4: Check session storage
  console.log('\n4️⃣ Testing session storage cleanup...')
  const sessionStorageKeys = Object.keys(sessionStorage)
  if (sessionStorageKeys.length === 0) {
    console.log('✅ Session storage successfully cleared')
  } else {
    console.log('❌ Session storage still contains data:', sessionStorageKeys)
  }
  
  // Test 5: Check NextAuth cookies
  console.log('\n5️⃣ Testing cookie cleanup...')
  const cookies = document.cookie
  const hasNextAuthCookies = cookies.includes('next-auth') || cookies.includes('nextauth')
  
  if (!hasNextAuthCookies) {
    console.log('✅ NextAuth cookies successfully cleared')
  } else {
    console.log('❌ NextAuth cookies still present:', cookies)
  }
  
  console.log('\n🏁 Account deletion test completed!')
}

// Run the test
testAccountDeletion()
