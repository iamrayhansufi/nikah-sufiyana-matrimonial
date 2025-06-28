import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options-redis"
import { redis } from "@/lib/redis-client"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: "Unauthorized" 
      }, { status: 401 })
    }

    const updateData = await request.json()
    const userKey = `user:${session.user.id}`

    // Get current user data
    const currentUserData = await redis.hgetall(userKey)
    if (!currentUserData || Object.keys(currentUserData).length === 0) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 })
    }

    // Validate fields
    const allowedFields = [
      'emailNotifications',
      'smsNotifications', 
      'whatsappNotifications'
    ]

    const updates: Record<string, string> = {}
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        // Convert boolean to string for Redis storage
        updates[key] = String(value)
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        error: "No valid notification settings to update" 
      }, { status: 400 })
    }

    // Update notification settings in Redis
    await redis.hset(userKey, updates)

    return NextResponse.json({ 
      message: "Notification settings updated successfully",
      updated: Object.keys(updates)
    }, { status: 200 })

  } catch (error) {
    console.error("Update notification settings error:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}
