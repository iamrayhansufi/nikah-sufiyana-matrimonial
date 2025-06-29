// Service Worker for automatic cache management
const CACHE_NAME = 'nikah-sufiyana-v1'
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Files to cache
const STATIC_CACHE_FILES = [
  '/',
  '/manifest.json',
  '/Nikah-Sufiyana-Logo.svg',
  '/Nikah-Sufiyana-Icon.svg'
]

// Files that should not be cached
const NO_CACHE_PATTERNS = [
  '/api/',
  '/_next/webpack-hmr',
  '/socket.io'
]

self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static files...')
        return cache.addAll(STATIC_CACHE_FILES)
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully')
        return self.skipWaiting()
      })
  )
})

self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('✅ Service Worker activated')
        return self.clients.claim()
      })
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // Skip caching for certain patterns
  if (NO_CACHE_PATTERNS.some(pattern => url.pathname.startsWith(pattern))) {
    return
  }
  
  // Skip caching for non-GET requests
  if (event.request.method !== 'GET') {
    return
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Check if cached response is still valid
        if (cachedResponse) {
          const cachedDate = new Date(cachedResponse.headers.get('date'))
          const now = new Date()
          
          if (now - cachedDate < CACHE_EXPIRY) {
            console.log('📦 Serving from cache:', url.pathname)
            return cachedResponse
          } else {
            console.log('⏰ Cache expired for:', url.pathname)
          }
        }
        
        // Fetch from network and update cache
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            
            // Clone the response for caching
            const responseToCache = response.clone()
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                console.log('💾 Caching:', url.pathname)
                cache.put(event.request, responseToCache)
              })
            
            return response
          })
          .catch(() => {
            // Return cached version if network fails
            if (cachedResponse) {
              console.log('🌐 Network failed, serving stale cache:', url.pathname)
              return cachedResponse
            }
            
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/')
            }
          })
      })
  )
})

// Clean up expired caches periodically
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    console.log('🧹 Cleaning expired cache...')
    
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.keys()
      })
      .then((requests) => {
        return Promise.all(
          requests.map((request) => {
            return caches.match(request)
              .then((response) => {
                if (response) {
                  const cachedDate = new Date(response.headers.get('date'))
                  const now = new Date()
                  
                  if (now - cachedDate > CACHE_EXPIRY) {
                    console.log('🗑️ Removing expired cache:', request.url)
                    return caches.open(CACHE_NAME).then(cache => cache.delete(request))
                  }
                }
              })
          })
        )
      })
      .then(() => {
        console.log('✅ Cache cleanup completed')
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'CACHE_CLEANED' })
          })
        })
      })
  }
})

// Handle cache quota exceeded
self.addEventListener('quotaexceeded', () => {
  console.log('⚠️ Cache quota exceeded, cleaning up...')
  
  caches.keys()
    .then((cacheNames) => {
      // Delete oldest caches first
      const sortedCaches = cacheNames.sort()
      const cachesToDelete = sortedCaches.slice(0, Math.floor(sortedCaches.length / 2))
      
      return Promise.all(
        cachesToDelete.map((cacheName) => {
          console.log('🗑️ Deleting cache due to quota:', cacheName)
          return caches.delete(cacheName)
        })
      )
    })
})
