"use client"

import { useEffect } from 'react'

export function ServiceWorkerManager() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered successfully:', registration)
          
          // Set up periodic cache cleanup
          setInterval(() => {
            if (registration.active) {
              registration.active.postMessage({ type: 'CLEAN_CACHE' })
            }
          }, 60 * 60 * 1000) // Clean every hour
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            console.log('🔄 Service Worker update found')
            const newWorker = registration.installing
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🆕 New Service Worker available')
                  // Optionally show user a notification about the update
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error)
        })
      
      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_CLEANED') {
          console.log('🧹 Cache cleaned by service worker')
        }
      })
      
      // Clean up when tab becomes visible (user returns to tab)
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'CLEAN_CACHE' })
        }
      })
    }
  }, [])

  return null // This component doesn't render anything
}

export default ServiceWorkerManager
