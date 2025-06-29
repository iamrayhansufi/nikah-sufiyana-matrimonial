"use client"

import { useEffect } from 'react'

interface CacheManagerOptions {
  clearOnMount?: boolean
  clearOnUnmount?: boolean
  clearInterval?: number // in milliseconds
  clearOnUserChange?: boolean
}

class CacheManager {
  private static instance: CacheManager
  private clearIntervalId: NodeJS.Timeout | null = null
  private currentUserId: string | null = null

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  /**
   * Clear all browser storage
   */
  async clearAllStorage(): Promise<void> {
    try {
      console.log('🧹 Starting comprehensive cache cleanup...')
      
      // Clear localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        const localStorageSize = Object.keys(localStorage).length
        localStorage.clear()
        console.log(`✅ Cleared localStorage (${localStorageSize} items)`)
      }

      // Clear sessionStorage
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const sessionStorageSize = Object.keys(sessionStorage).length
        sessionStorage.clear()
        console.log(`✅ Cleared sessionStorage (${sessionStorageSize} items)`)
      }

      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map(async (cacheName) => {
            await caches.delete(cacheName)
            console.log(`✅ Cleared cache: ${cacheName}`)
          })
        )
        console.log(`✅ Cleared ${cacheNames.length} cache storage(s)`)
      }

      // Clear cookies (for current domain)
      this.clearCookies()

      // Clear IndexedDB
      await this.clearIndexedDB()

      console.log('✅ Comprehensive cache cleanup completed')
    } catch (error) {
      console.error('❌ Error during cache cleanup:', error)
    }
  }

  /**
   * Clear cookies for current domain
   */
  private clearCookies(): void {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';')
      let clearedCount = 0

      cookies.forEach(cookie => {
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        
        if (name) {
          // Clear for current domain
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
          // Clear for parent domain
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
          // Clear for subdomain
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`
          clearedCount++
        }
      })

      console.log(`✅ Cleared ${clearedCount} cookies`)
    }
  }

  /**
   * Clear IndexedDB databases
   */
  private async clearIndexedDB(): Promise<void> {
    if ('indexedDB' in window) {
      try {
        // Get all database names (this is a newer API, may not be supported everywhere)
        if ('databases' in indexedDB) {
          const databases = await (indexedDB as any).databases()
          await Promise.all(
            databases.map(async (db: any) => {
              const deleteReq = (indexedDB as any).deleteDatabase(db.name)
              await new Promise((resolve, reject) => {
                deleteReq.onsuccess = () => resolve(true)
                deleteReq.onerror = () => reject(deleteReq.error)
              })
              console.log(`✅ Cleared IndexedDB: ${db.name}`)
            })
          )
        } else {
          // Fallback: try to delete common database names
          const commonDbNames = ['keyval-store', 'firebaseLocalStorageDb', 'workbox-precache']
          for (const dbName of commonDbNames) {
            try {
              const deleteReq = (indexedDB as any).deleteDatabase(dbName)
              await new Promise((resolve) => {
                deleteReq.onsuccess = () => resolve(true)
                deleteReq.onerror = () => resolve(false) // Don't fail if DB doesn't exist
              })
            } catch (error) {
              // Ignore errors for non-existent databases
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ Could not clear IndexedDB:', error)
      }
    }
  }

  /**
   * Clear user-specific cached data
   */
  clearUserCache(userId?: string): void {
    if (typeof window === 'undefined') return

    const targetUserId = userId || this.currentUserId
    if (!targetUserId) return

    console.log(`🧹 Clearing user-specific cache for user: ${targetUserId}`)

    // Clear user-specific localStorage items
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.includes(targetUserId) ||
        key.includes('profile_') ||
        key.includes('dashboard_') ||
        key.includes('user_') ||
        key.includes('interests_') ||
        key.includes('notifications_')
      )) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
      console.log(`🗑️ Removed localStorage key: ${key}`)
    })

    // Clear user-specific sessionStorage items
    const sessionKeysToRemove: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && (
        key.includes(targetUserId) ||
        key.includes('profile_') ||
        key.includes('dashboard_') ||
        key.includes('user_') ||
        key.includes('interests_') ||
        key.includes('notifications_')
      )) {
        sessionKeysToRemove.push(key)
      }
    }

    sessionKeysToRemove.forEach(key => {
      sessionStorage.removeItem(key)
      console.log(`🗑️ Removed sessionStorage key: ${key}`)
    })

    console.log(`✅ Cleared user cache (${keysToRemove.length + sessionKeysToRemove.length} items)`)
  }

  /**
   * Start automatic cache clearing at intervals
   */
  startAutoClear(intervalMs: number = 30 * 60 * 1000): void { // Default 30 minutes
    this.stopAutoClear() // Clear any existing interval

    this.clearIntervalId = setInterval(() => {
      console.log('⏰ Auto-clearing expired cache...')
      this.clearExpiredCache()
    }, intervalMs)

    console.log(`🕐 Auto-clear started with ${intervalMs / 1000 / 60} minute intervals`)
  }

  /**
   * Stop automatic cache clearing
   */
  stopAutoClear(): void {
    if (this.clearIntervalId) {
      clearInterval(this.clearIntervalId)
      this.clearIntervalId = null
      console.log('⏹️ Auto-clear stopped')
    }
  }

  /**
   * Clear expired cached items
   */
  clearExpiredCache(): void {
    if (typeof window === 'undefined') return

    const now = Date.now()
    const keysToRemove: string[] = []

    // Check localStorage for expired items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.endsWith('_timestamp')) {
        const timestampStr = localStorage.getItem(key)
        if (timestampStr) {
          const timestamp = parseInt(timestampStr)
          const dataKey = key.replace('_timestamp', '')
          
          // Consider data expired after 1 hour
          if (now - timestamp > 60 * 60 * 1000) {
            keysToRemove.push(key)
            keysToRemove.push(dataKey)
          }
        }
      }
    }

    // Check sessionStorage for expired items
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.endsWith('_timestamp')) {
        const timestampStr = sessionStorage.getItem(key)
        if (timestampStr) {
          const timestamp = parseInt(timestampStr)
          const dataKey = key.replace('_timestamp', '')
          
          // Consider data expired after 30 minutes
          if (now - timestamp > 30 * 60 * 1000) {
            keysToRemove.push(`session_${key}`)
            keysToRemove.push(`session_${dataKey}`)
          }
        }
      }
    }

    // Remove expired items
    keysToRemove.forEach(key => {
      if (key.startsWith('session_')) {
        const actualKey = key.replace('session_', '')
        sessionStorage.removeItem(actualKey)
      } else {
        localStorage.removeItem(key)
      }
    })

    if (keysToRemove.length > 0) {
      console.log(`🧹 Cleared ${keysToRemove.length} expired cache items`)
    }
  }

  /**
   * Set current user ID for user-specific cache management
   */
  setCurrentUser(userId: string | null): void {
    const previousUserId = this.currentUserId
    this.currentUserId = userId

    // If user changed, clear previous user's cache
    if (previousUserId && previousUserId !== userId) {
      console.log(`🔄 User changed from ${previousUserId} to ${userId}`)
      this.clearUserCache(previousUserId)
    }
  }

  /**
   * Force clear all cache and reload page
   */
  async forceRefresh(): Promise<void> {
    await this.clearAllStorage()
    
    if (typeof window !== 'undefined') {
      console.log('🔄 Force refreshing page...')
      window.location.reload()
    }
  }
}

// Hook for using cache manager in React components
export function useCacheManager(options: CacheManagerOptions = {}) {
  const cacheManager = CacheManager.getInstance()

  useEffect(() => {
    if (options.clearOnMount) {
      cacheManager.clearExpiredCache()
    }

    if (options.clearInterval) {
      cacheManager.startAutoClear(options.clearInterval)
    }

    return () => {
      if (options.clearOnUnmount) {
        cacheManager.clearExpiredCache()
      }
      
      if (options.clearInterval) {
        cacheManager.stopAutoClear()
      }
    }
  }, [])

  return {
    clearAllStorage: () => cacheManager.clearAllStorage(),
    clearUserCache: (userId?: string) => cacheManager.clearUserCache(userId),
    startAutoClear: (intervalMs?: number) => cacheManager.startAutoClear(intervalMs),
    stopAutoClear: () => cacheManager.stopAutoClear(),
    setCurrentUser: (userId: string | null) => cacheManager.setCurrentUser(userId),
    forceRefresh: () => cacheManager.forceRefresh()
  }
}

export default CacheManager
