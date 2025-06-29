import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options-redis"
import { redis } from "@/lib/redis-client"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: "Unauthorized" 
      }, { status: 401 })
    }

    const body = await request.json()
    const { type, userId } = body

    console.log(`🧹 Cache cleanup request - Type: ${type}, User: ${userId || session.user.id}`)

    let keysDeleted = 0
    const targetUserId = userId || session.user.id

    switch (type) {
      case 'user':
        // Clear user-specific cache
        const userCacheKeys = await redis.keys(`*${targetUserId}*`)
        const userDataKeys = await redis.keys(`dashboard_*${targetUserId}*`)
        const userProfileKeys = await redis.keys(`profile_*${targetUserId}*`)
        const userInterestKeys = await redis.keys(`interests_*${targetUserId}*`)
        
        const allUserKeys = [...userCacheKeys, ...userDataKeys, ...userProfileKeys, ...userInterestKeys]
        
        if (allUserKeys.length > 0) {
          await redis.del(...allUserKeys)
          keysDeleted = allUserKeys.length
        }
        break

      case 'expired':
        // Clear expired cache entries
        const allKeys = await redis.keys('*_timestamp')
        const now = Date.now()
        const expiredKeys: string[] = []

        for (const timestampKey of allKeys) {
          const timestamp = await redis.get(timestampKey)
          if (timestamp && typeof timestamp === 'string' && (now - parseInt(timestamp)) > 60 * 60 * 1000) { // 1 hour
            expiredKeys.push(timestampKey)
            expiredKeys.push(timestampKey.replace('_timestamp', ''))
          }
        }

        if (expiredKeys.length > 0) {
          await redis.del(...expiredKeys)
          keysDeleted = expiredKeys.length
        }
        break

      case 'all':
        // Clear all non-essential cache (keep user data and sessions)
        const cacheKeys = await redis.keys('dashboard_*')
        const profileCacheKeys = await redis.keys('profile_cache_*')
        const browseKeys = await redis.keys('profiles_*')
        const statsKeys = await redis.keys('stats_*')
        
        const allCacheKeys = [...cacheKeys, ...profileCacheKeys, ...browseKeys, ...statsKeys]
        
        if (allCacheKeys.length > 0) {
          await redis.del(...allCacheKeys)
          keysDeleted = allCacheKeys.length
        }
        break

      default:
        return NextResponse.json({ 
          error: "Invalid cache type specified" 
        }, { status: 400 })
    }

    console.log(`✅ Cache cleanup completed - ${keysDeleted} keys deleted`)

    return NextResponse.json({ 
      message: "Cache cleaned successfully",
      keysDeleted,
      type
    }, { status: 200 })

  } catch (error) {
    console.error("❌ Cache cleanup error:", error)
    return NextResponse.json({ 
      error: "Failed to clean cache" 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: "Unauthorized" 
      }, { status: 401 })
    }

    // Get cache statistics
    const allKeys = await redis.keys('*')
    const userKeys = await redis.keys(`*${session.user.id}*`)
    const cacheKeys = await redis.keys('*_timestamp')
    const expiredKeys: string[] = []
    
    const now = Date.now()
    for (const timestampKey of cacheKeys) {
      const timestamp = await redis.get(timestampKey)
      if (timestamp && typeof timestamp === 'string' && (now - parseInt(timestamp)) > 60 * 60 * 1000) {
        expiredKeys.push(timestampKey)
      }
    }

    return NextResponse.json({ 
      statistics: {
        totalKeys: allKeys.length,
        userKeys: userKeys.length,
        cacheKeys: cacheKeys.length,
        expiredKeys: expiredKeys.length
      }
    }, { status: 200 })

  } catch (error) {
    console.error("❌ Cache stats error:", error)
    return NextResponse.json({ 
      error: "Failed to get cache statistics" 
    }, { status: 500 })
  }
}
