/**
 * Test script for automatic cache deletion functionality
 * Run this in browser console to test cache management
 */

async function testAutoCacheDelete() {
  console.log('🧪 Testing automatic cache deletion...')
  
  // Test 1: Create some test cache data
  console.log('\n1️⃣ Creating test cache data...')
  
  // Add some test data to localStorage
  localStorage.setItem('test_profile_data', JSON.stringify({ name: 'Test User' }))
  localStorage.setItem('test_profile_data_timestamp', Date.now().toString())
  localStorage.setItem('dashboard_test_user', JSON.stringify({ stats: 'test' }))
  localStorage.setItem('dashboard_test_user_timestamp', (Date.now() - 70 * 60 * 1000).toString()) // 70 minutes ago (expired)
  
  // Add some test data to sessionStorage
  sessionStorage.setItem('session_test_data', JSON.stringify({ temp: 'data' }))
  sessionStorage.setItem('session_test_data_timestamp', (Date.now() - 35 * 60 * 1000).toString()) // 35 minutes ago (expired)
  
  console.log('✅ Test data created')
  console.log('LocalStorage items:', Object.keys(localStorage).length)
  console.log('SessionStorage items:', Object.keys(sessionStorage).length)
  
  // Test 2: Import and test cache manager
  console.log('\n2️⃣ Testing cache manager...')
  
  try {
    // Simulate importing cache manager (in real usage it would be imported)
    const { default: CacheManager } = await import('/lib/cache-manager.ts')
    const cacheManager = CacheManager.getInstance()
    
    console.log('✅ Cache manager loaded')
    
    // Test 3: Test expired cache clearing
    console.log('\n3️⃣ Testing expired cache clearing...')
    cacheManager.clearExpiredCache()
    
    console.log('After clearing expired cache:')
    console.log('LocalStorage items:', Object.keys(localStorage).length)
    console.log('SessionStorage items:', Object.keys(sessionStorage).length)
    
    // Test 4: Test auto-clear functionality
    console.log('\n4️⃣ Testing auto-clear start/stop...')
    cacheManager.startAutoClear(5000) // 5 seconds for testing
    console.log('✅ Auto-clear started (5 second interval)')
    
    setTimeout(() => {
      console.log('⏰ Auto-clear should have run...')
      cacheManager.stopAutoClear()
      console.log('⏹️ Auto-clear stopped')
    }, 6000)
    
    // Test 5: Test user-specific cache clearing
    console.log('\n5️⃣ Testing user-specific cache clearing...')
    localStorage.setItem('profile_user123', JSON.stringify({ id: 'user123' }))
    localStorage.setItem('dashboard_user123', JSON.stringify({ data: 'test' }))
    
    cacheManager.setCurrentUser('user123')
    cacheManager.clearUserCache('user123')
    
    const remainingUserKeys = Object.keys(localStorage).filter(key => key.includes('user123'))
    console.log('Remaining user123 keys:', remainingUserKeys.length)
    
  } catch (error) {
    console.error('❌ Error testing cache manager:', error)
  }
  
  // Test 6: Test service worker cache management (if available)
  console.log('\n6️⃣ Testing service worker cache...')
  
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    console.log('📱 Service worker available')
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAN_CACHE' })
    console.log('📤 Cache clean message sent to service worker')
  } else {
    console.log('⚠️ Service worker not available')
  }
  
  // Test 7: Test cache API
  console.log('\n7️⃣ Testing cache API...')
  
  try {
    const response = await fetch('/api/cache/clean', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type: 'expired' })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Cache API test successful:', result)
    } else {
      console.log('❌ Cache API test failed:', response.status)
    }
  } catch (error) {
    console.log('❌ Cache API error:', error.message)
  }
  
  console.log('\n🏁 Auto cache deletion tests completed!')
  
  // Cleanup test data
  console.log('\n🧹 Cleaning up test data...')
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('test_') || key.includes('user123')) {
      localStorage.removeItem(key)
    }
  })
  
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('session_test_')) {
      sessionStorage.removeItem(key)
    }
  })
  
  console.log('✅ Test cleanup completed')
}

// Function to monitor cache size over time
function monitorCacheSize() {
  console.log('📊 Starting cache size monitoring...')
  
  const logCacheSize = () => {
    const localStorage_size = Object.keys(localStorage).length
    const sessionStorage_size = Object.keys(sessionStorage).length
    
    console.log(`📊 Cache Stats - LocalStorage: ${localStorage_size}, SessionStorage: ${sessionStorage_size}`)
    
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        console.log(`📊 Cache Storages: ${cacheNames.length}`)
      })
    }
  }
  
  logCacheSize()
  return setInterval(logCacheSize, 30000) // Every 30 seconds
}

// Export functions for manual testing
window.testAutoCacheDelete = testAutoCacheDelete
window.monitorCacheSize = monitorCacheSize

console.log('🧪 Cache testing functions loaded:')
console.log('- testAutoCacheDelete() - Run comprehensive cache tests')
console.log('- monitorCacheSize() - Monitor cache size over time')

// Auto-run tests if desired
// testAutoCacheDelete()
