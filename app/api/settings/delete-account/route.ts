import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options-redis"
import { redis } from "@/lib/redis-client"

export async function DELETE(request: NextRequest) {
  console.log('🗑️ Delete account API called')
  
  try {
    const session = await getServerSession(authOptions)
    
    console.log('🔐 Session check:', {
      hasSession: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    })
    
    if (!session?.user?.id) {
      console.log('❌ Unauthorized: No session or user ID')
      return NextResponse.json({ 
        error: "Unauthorized" 
      }, { status: 401 })
    }

    const userId = session.user.id
    const userKey = `user:${userId}`

    console.log('👤 Looking up user:', { userId, userKey })

    // Get current user data to verify user exists
    const userData = await redis.hgetall(userKey)
    
    console.log('📊 User data found:', {
      hasData: !!userData && Object.keys(userData).length > 0,
      keys: userData ? Object.keys(userData) : []
    })
    
    if (!userData || Object.keys(userData).length === 0) {
      console.log('❌ User not found in Redis')
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
    console.log('🔑 Keys deleted:', uniqueKeysToDelete.slice(0, 5)) // Log first 5 keys

    return NextResponse.json({ 
      message: "Account deleted successfully",
      deletedKeys: uniqueKeysToDelete.length
    }, { status: 200 })

  } catch (error) {
    console.error("❌ Delete account error:", error)
    console.error("❌ Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Add a simple GET method for testing route accessibility
export async function GET(request: NextRequest) {
  console.log('🔍 Delete account GET endpoint called - route is accessible')
  return NextResponse.json({ 
    message: "Delete account endpoint is accessible",
    note: "Use DELETE method to actually delete account"
  }, { status: 200 })
}

// Add OPTIONS method for CORS if needed
export async function OPTIONS(request: NextRequest) {
  console.log('🔧 Delete account OPTIONS called')
  return NextResponse.json(
    { message: "DELETE method allowed" },
    { 
      status: 200,
      headers: {
        'Allow': 'DELETE, GET, OPTIONS',
        'Access-Control-Allow-Methods': 'DELETE, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  )
}

// Add POST method that redirects to DELETE for compatibility
export async function POST(request: NextRequest) {
  console.log('🔄 Delete account POST called - redirecting to DELETE method')
  return NextResponse.json(
    { 
      error: "Use DELETE method for account deletion",
      hint: "Change your request method from POST to DELETE"
    },
    { status: 405 }
  )
}
