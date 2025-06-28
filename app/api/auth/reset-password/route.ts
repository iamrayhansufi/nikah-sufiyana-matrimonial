import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis-client"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, phone, method, otp, newPassword } = await request.json()

    if (!method || (method !== 'email' && method !== 'phone')) {
      return NextResponse.json({ 
        error: "Invalid reset method" 
      }, { status: 400 })
    }

    if (!otp || !newPassword) {
      return NextResponse.json({ 
        error: "OTP and new password are required" 
      }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ 
        error: "Password must be at least 8 characters long" 
      }, { status: 400 })
    }

    const identifier = method === 'email' ? email : phone
    if (!identifier) {
      return NextResponse.json({ 
        error: `${method} is required` 
      }, { status: 400 })
    }

    // Verify OTP
    const resetKey = `password_reset:${method}:${identifier}`
    const resetData = await redis.hgetall(resetKey)

    if (!resetData || !resetData.otp) {
      return NextResponse.json({ 
        error: "Invalid or expired reset code" 
      }, { status: 400 })
    }

    // Check if OTP has expired
    const expiryTime = parseInt(resetData.expiryTime as string)
    if (Date.now() > expiryTime) {
      await redis.del(resetKey)
      return NextResponse.json({ 
        error: "Reset code has expired. Please request a new one." 
      }, { status: 400 })
    }

    // Verify OTP
    if (resetData.otp !== otp) {
      return NextResponse.json({ 
        error: "Invalid reset code" 
      }, { status: 400 })
    }

    // Find and update user password
    const userId = resetData.userId
    const userKey = `user:${userId}`
    const userData = await redis.hgetall(userKey)

    if (!userData || !userData.id) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update user password
    await redis.hset(userKey, {
      password: hashedPassword,
      passwordUpdatedAt: new Date().toISOString()
    })

    // Clean up reset data
    await redis.del(resetKey)

    console.log(`Password reset successful for user ${userId}`)

    return NextResponse.json({ 
      success: true,
      message: "Password reset successful. You can now log in with your new password."
    }, { status: 200 })

  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}
