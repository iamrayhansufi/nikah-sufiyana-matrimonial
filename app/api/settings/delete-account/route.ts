import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options-redis"
import { redis } from "@/lib/redis-client"

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: "Unauthorized" 
      }, { status: 401 })
    }

    const userId = session.user.id
    const userKey = `user:${userId}`

    // Get current user data to verify user exists
    const userData = await redis.hgetall(userKey)
    if (!userData || Object.keys(userData).length === 0) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 })
    }

    // Get all related keys to delete
    const keysToDelete = []
    
    // Add user key
    keysToDelete.push(userKey)
    
    // Find and add related keys (sessions, tokens, etc.)
    const allKeys = await redis.keys('*')
    
    for (const key of allKeys) {
      // Delete session keys related to this user
      if (key.includes(userId) || key.includes(userData.email as string)) {
        keysToDelete.push(key)
      }
      
      // Delete verification keys
      if (key.startsWith('verification:') && key.includes(userData.email as string)) {
        keysToDelete.push(key)
      }
      
      // Delete password reset keys
      if (key.startsWith('password_reset:') && 
          (key.includes(userData.email as string) || key.includes(userData.phone as string))) {
        keysToDelete.push(key)
      }
      
      // Delete any other user-related data
      if (key.startsWith(`user_${userId}:`) || key.includes(`_${userId}_`)) {
        keysToDelete.push(key)
      }
    }

    // Remove duplicates
    const uniqueKeysToDelete = [...new Set(keysToDelete)]
    
    // Delete all related data
    if (uniqueKeysToDelete.length > 0) {
      await redis.del(...uniqueKeysToDelete)
    }

    console.log(`🗑️ Account deleted for user ${userId}. Deleted ${uniqueKeysToDelete.length} keys.`)

    return NextResponse.json({ 
      message: "Account deleted successfully",
      deletedKeys: uniqueKeysToDelete.length
    }, { status: 200 })

  } catch (error) {
    console.error("Delete account error:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}
