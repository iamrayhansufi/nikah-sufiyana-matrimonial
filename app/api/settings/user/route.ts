import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options-redis"
import { redis } from "@/lib/redis-client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: "Unauthorized" 
      }, { status: 401 })
    }

    // Get user data from Redis
    const userKey = `user:${session.user.id}`
    const userData = await redis.hgetall(userKey)

    if (!userData || Object.keys(userData).length === 0) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 })
    }

    // Return user settings
    const userSettings = {
      email: userData.email || '',
      phone: userData.phone || userData.mobileNumber || '',
      whatsappNumber: userData.whatsappNumber || '',
      language: userData.language || 'english',
      profileVisibility: userData.profileVisibility || 'all',
      photoPrivacy: userData.photoPrivacy || 'all',
      theme: userData.theme || 'system'
    }

    return NextResponse.json(userSettings, { status: 200 })

  } catch (error) {
    console.error("Get user settings error:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}
