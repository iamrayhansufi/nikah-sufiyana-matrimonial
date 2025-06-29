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

    const sessionUserId = session.user.id
    const sessionUserEmail = session.user.email
    
    console.log('👤 Looking up user with ID:', sessionUserId)

    // Try multiple strategies to find the user
    let userData = null
    let userKey = ''
    
    // Strategy 1: Direct lookup with session user ID
    userKey = `user:${sessionUserId}`
    userData = await redis.hgetall(userKey)
    
    if (userData && Object.keys(userData).length > 0) {
      console.log('✅ Found user with Strategy 1 (direct ID):', userKey)
    } else {
      console.log('❌ Strategy 1 failed, trying Strategy 2...')
      
      // Strategy 2: Search through all users by email
      const userKeys = await redis.keys("user:*")
      console.log(`🔍 Searching through ${userKeys.length} users`)
      
      for (const key of userKeys) {
        const user = await redis.hgetall(key)
        if (user && user.email === sessionUserEmail) {
          userData = user
          userKey = key
          console.log('✅ Found user with Strategy 2 (email match):', key)
          break
        }
      }
      
      if (!userData || Object.keys(userData).length === 0) {
        console.log('❌ Strategy 2 failed, trying Strategy 3...')
        
        // Strategy 3: Try with different user ID format (without user: prefix)
        const cleanUserId = sessionUserId.replace('user:', '')
        userKey = `user:${cleanUserId}`
        userData = await redis.hgetall(userKey)
        
        if (userData && Object.keys(userData).length > 0) {
          console.log('✅ Found user with Strategy 3 (clean ID):', userKey)
        }
      }
    }
    
    console.log('📊 Final user lookup result:', {
      hasData: !!userData && Object.keys(userData).length > 0,
      userKey,
      keys: userData ? Object.keys(userData) : []
    })
    
    if (!userData || Object.keys(userData).length === 0) {
      console.log('❌ User not found in Redis after all strategies')
      
      // List available user keys for debugging
      const userKeys = await redis.keys("user:*")
      console.log('🔍 Available user keys for debugging:')
      for (const key of userKeys.slice(0, 5)) {
        const user = await redis.hgetall(key)
        console.log(`  - Key: ${key}, Email: ${user?.email}, ID: ${user?.id}`)
      }
      
      return NextResponse.json({ 
        error: "User not found",
        debug: {
          sessionUserId,
          sessionUserEmail,
          availableKeys: userKeys.length
        }
      }, { status: 404 })
    }

    console.log('🗑️ Starting comprehensive account deletion...')

    // Get all related keys to delete
    const keysToDelete = []
    
    // Add main user key
    keysToDelete.push(userKey)
    
    // Get all Redis keys for comprehensive deletion
    const allKeys = await redis.keys('*')
    
    console.log(`🔍 Scanning ${allKeys.length} keys for user-related data...`)
    
    // Extract user identifiers for matching
    const cleanUserId = sessionUserId.replace('user:', '')
    const userDataId = userData.id as string || ''
    const userEmail = userData.email as string || ''
    const userPhone = userData.phone as string || ''
    const userWhatsapp = userData.whatsappNumber as string || ''
    
    for (const key of allKeys) {
      let shouldDelete = false
      
      // Delete any key that contains the user ID (with or without prefix)
      if (key.includes(sessionUserId) || 
          key.includes(cleanUserId) || 
          (userDataId && key.includes(userDataId)) ||
          (userEmail && key.includes(userEmail)) ||
          (userPhone && key.includes(userPhone)) ||
          (userWhatsapp && key.includes(userWhatsapp))) {
        shouldDelete = true
      }
      
      // Delete specific patterns
      if (key.startsWith('verification:') && userEmail && key.includes(userEmail)) {
        shouldDelete = true
      }
      
      if (key.startsWith('password_reset:') && 
          ((userEmail && key.includes(userEmail)) || (userPhone && key.includes(userPhone)))) {
        shouldDelete = true
      }
      
      // Delete interest-related data
      if (key.startsWith('interest:')) {
        const interest = await redis.hgetall(key)
        if (interest && (interest.senderId === userDataId || 
                        interest.receiverId === userDataId ||
                        interest.senderId === sessionUserId ||
                        interest.receiverId === sessionUserId)) {
          shouldDelete = true
        }
      }
      
      // Delete notification data
      if (key.startsWith('notification:')) {
        const notification = await redis.hgetall(key)
        if (notification && (notification.userId === userDataId || notification.userId === sessionUserId)) {
          shouldDelete = true
        }
      }
      
      // Delete user lists (sent_interests, received_interests, etc.)
      if (key.startsWith('sent_interests:') || 
          key.startsWith('received_interests:') ||
          key.startsWith('notifications:') ||
          key.startsWith('shortlist:') ||
          key.startsWith('user_connections:') ||
          key.startsWith('user_activity:') ||
          key.startsWith('user_photos:') ||
          key.startsWith('user_settings:')) {
        if ((userDataId && key.includes(userDataId)) || 
            key.includes(sessionUserId) ||
            key.includes(cleanUserId)) {
          shouldDelete = true
        }
      }
      
      // Delete session data
      if (key.startsWith('session:') || 
          key.startsWith('user_session:') ||
          key.startsWith('next-auth.session') ||
          key.startsWith('next-auth.csrf-token') ||
          key.startsWith('next-auth.callback-url')) {
        shouldDelete = true
      }
      
      // Delete any photo-related data
      if (key.includes('photo') && (
          key.includes(sessionUserId) || 
          key.includes(cleanUserId) || 
          (userDataId && key.includes(userDataId)))) {
        shouldDelete = true
      }
      
      if (shouldDelete) {
        keysToDelete.push(key)
      }
    }

    // Remove duplicates and filter out empty keys
    const uniqueKeysToDelete = [...new Set(keysToDelete)].filter(key => key && key.trim())
    
    console.log(`🗑️ Found ${uniqueKeysToDelete.length} keys to delete`)
    console.log('📋 Sample keys to delete:', uniqueKeysToDelete.slice(0, 10)) // Log first 10 keys
    
    // Delete all related data in batches to avoid overwhelming Redis
    const batchSize = 50
    let totalDeleted = 0
    
    for (let i = 0; i < uniqueKeysToDelete.length; i += batchSize) {
      const batch = uniqueKeysToDelete.slice(i, i + batchSize)
      if (batch.length > 0) {
        const deleteResult = await redis.del(...batch)
        totalDeleted += deleteResult
        console.log(`🗑️ Deleted batch ${Math.floor(i/batchSize) + 1}, ${batch.length} keys (${deleteResult} actually deleted)`)
      }
    }

    // Also remove user from any sets
    if (userDataId) {
      await redis.srem('users', userDataId)
    }
    await redis.srem('users', sessionUserId)
    await redis.srem('users', cleanUserId)
    
    // Clean up interests sets
    if (userDataId) {
      await redis.srem('interests:sent', `${userDataId}:*`)
      await redis.srem('interests:sent', `*:${userDataId}`)
    }
    await redis.srem('interests:sent', `${sessionUserId}:*`)
    await redis.srem('interests:sent', `*:${sessionUserId}`)
    await redis.srem('interests:sent', `${cleanUserId}:*`)
    await redis.srem('interests:sent', `*:${cleanUserId}`)
    
    // Clean up any other sets that might contain user data
    const setKeys = await redis.keys('*:users')
    for (const setKey of setKeys) {
      await redis.srem(setKey, sessionUserId)
      await redis.srem(setKey, cleanUserId)
      if (userDataId) {
        await redis.srem(setKey, userDataId)
      }
    }

    console.log(`✅ Account successfully deleted for user ${sessionUserId}`)
    console.log(`📊 Total keys found: ${uniqueKeysToDelete.length}`)
    console.log(`📊 Total keys actually deleted: ${totalDeleted}`)

    return NextResponse.json({ 
      message: "Account deleted successfully",
      keysFound: uniqueKeysToDelete.length,
      keysDeleted: totalDeleted,
      userKey: userKey
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
