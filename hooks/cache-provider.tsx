"use client"

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import CacheManager, { useCacheManager } from '@/lib/cache-manager'

interface CacheContextType {
  clearAllStorage: () => Promise<void>
  clearUserCache: (userId?: string) => void
  forceRefresh: () => Promise<void>
  startAutoClear: (intervalMs?: number) => void
  stopAutoClear: () => void
}

const CacheContext = createContext<CacheContextType | undefined>(undefined)

export function CacheProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const cacheManager = useCacheManager({
    clearOnMount: true, // Clear expired cache when app loads
    clearInterval: 30 * 60 * 1000, // Auto-clear every 30 minutes
    clearOnUserChange: true
  })

  // Update current user when session changes
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      cacheManager.setCurrentUser(session.user.id)
    } else if (status === 'unauthenticated') {
      cacheManager.setCurrentUser(null)
    }
  }, [session?.user?.id, status, cacheManager])

  // Clear cache when user logs out
  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log('🧹 User logged out, clearing cache...')
      cacheManager.clearAllStorage()
    }
  }, [status, cacheManager])

  return (
    <CacheContext.Provider value={cacheManager}>
      {children}
    </CacheContext.Provider>
  )
}

export function useCache() {
  const context = useContext(CacheContext)
  if (context === undefined) {
    throw new Error('useCache must be used within a CacheProvider')
  }
  return context
}
