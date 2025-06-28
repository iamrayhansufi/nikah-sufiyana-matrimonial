import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options-redis"
import { redis } from "@/lib/redis-client"
import bcrypt from "bcryptjs"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: "Unauthorized" 
      }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ 
        error: "Current password and new password are required" 
      }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ 
        error: "New password must be at least 8 characters long" 
      }, { status: 400 })
    }

    const userKey = `user:${session.user.id}`
    
    // Get current user data
    const userData = await redis.hgetall(userKey)
    if (!userData || Object.keys(userData).length === 0) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 })
    }

    // Verify current password
    const currentHashedPassword = userData.password as string
    if (!currentHashedPassword) {
      return NextResponse.json({ 
        error: "No password set for this account" 
      }, { status: 400 })
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentHashedPassword)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ 
        error: "Current password is incorrect" 
      }, { status: 400 })
    }

    // Hash new password
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password in Redis
    await redis.hset(userKey, {
      password: hashedNewPassword,
      passwordUpdatedAt: new Date().toISOString()
    })

    return NextResponse.json({ 
      message: "Password changed successfully" 
    }, { status: 200 })

  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}
