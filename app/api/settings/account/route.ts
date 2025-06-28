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
      'email', 
      'phone', 
      'whatsappNumber', 
      'language', 
      'theme', 
      'twoFactorEnabled'
    ]

    const updates: Record<string, string> = {}
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        if (key === 'email' && value) {
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value as string)) {
            return NextResponse.json({ 
              error: "Invalid email format" 
            }, { status: 400 })
          }

          // Check if email is already taken by another user
          const users = await redis.keys('user:*')
          for (const otherUserKey of users) {
            if (otherUserKey !== userKey) {
              const otherUserData = await redis.hgetall(otherUserKey)
              if (otherUserData && otherUserData.email === value) {
                return NextResponse.json({ 
                  error: "Email is already in use" 
                }, { status: 400 })
              }
            }
          }
        }

        if (key === 'phone' && value) {
          // Validate phone format (basic validation)
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
          if (!phoneRegex.test(value as string)) {
            return NextResponse.json({ 
              error: "Invalid phone number format" 
            }, { status: 400 })
          }

          // Check if phone is already taken by another user
          const users = await redis.keys('user:*')
          for (const otherUserKey of users) {
            if (otherUserKey !== userKey) {
              const otherUserData = await redis.hgetall(otherUserKey)
              if (otherUserData && (otherUserData.phone === value || otherUserData.mobileNumber === value)) {
                return NextResponse.json({ 
                  error: "Phone number is already in use" 
                }, { status: 400 })
              }
            }
          }
        }

        updates[key] = String(value)
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        error: "No valid fields to update" 
      }, { status: 400 })
    }

    // Update user data in Redis
    await redis.hset(userKey, updates)

    // If email was updated, also update the mobileNumber field if phone was updated
    if (updates.phone) {
      await redis.hset(userKey, { mobileNumber: updates.phone })
    }

    return NextResponse.json({ 
      message: "Account settings updated successfully",
      updated: Object.keys(updates)
    }, { status: 200 })

  } catch (error) {
    console.error("Update account settings error:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}
