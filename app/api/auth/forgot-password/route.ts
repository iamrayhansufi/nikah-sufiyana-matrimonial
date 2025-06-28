import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis-client"
import { sendOTPVerificationEmail } from "@/lib/email-service"
import { sendVerificationSMS } from "@/lib/notifications"

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email, phone, method } = await request.json()

    if (!method || (method !== 'email' && method !== 'phone')) {
      return NextResponse.json({ 
        error: "Invalid reset method. Use 'email' or 'phone'" 
      }, { status: 400 })
    }

    if (method === 'email' && !email) {
      return NextResponse.json({ 
        error: "Email address is required" 
      }, { status: 400 })
    }

    if (method === 'phone' && !phone) {
      return NextResponse.json({ 
        error: "Phone number is required" 
      }, { status: 400 })
    }

    // Check if user exists in the database
    let userExists = false
    let userId = null
    let userName = 'User'

    if (method === 'email') {
      // Find user by email
      const users = await redis.keys('user:*')
      for (const userKey of users) {
        const userData = await redis.hgetall(userKey)
        if (userData && userData.email === email) {
          userExists = true
          userId = userData.id
          userName = (userData.fullName || userData.name || 'User') as string
          break
        }
      }
    } else if (method === 'phone') {
      // Find user by phone
      const users = await redis.keys('user:*')
      for (const userKey of users) {
        const userData = await redis.hgetall(userKey)
        if (userData && (userData.phone === phone || userData.mobileNumber === phone)) {
          userExists = true
          userId = userData.id
          userName = (userData.fullName || userData.name || 'User') as string
          break
        }
      }
    }

    if (!userExists) {
      return NextResponse.json({ 
        error: method === 'email' 
          ? "No account found with this email address" 
          : "No account found with this phone number"
      }, { status: 404 })
    }

    // Generate OTP and set expiry (10 minutes)
    const otp = generateOTP()
    const expiryTime = Date.now() + (10 * 60 * 1000) // 10 minutes

    // Store OTP in Redis with expiry
    const resetKey = `password_reset:${method}:${method === 'email' ? email : phone}`
    await redis.hset(resetKey, {
      otp,
      userId,
      expiryTime: expiryTime.toString(),
      verified: 'false'
    })
    await redis.expire(resetKey, 600) // 10 minutes TTL

    // Send OTP via email or SMS
    try {
      if (method === 'email') {
        const emailSent = await sendOTPVerificationEmail(email, otp, userName, 'password_reset')
        if (!emailSent) {
          throw new Error('Failed to send email')
        }
      } else if (method === 'phone') {
        await sendVerificationSMS(phone, otp)
      }
    } catch (error) {
      console.error('Error sending reset code:', error)
      return NextResponse.json({ 
        error: `Failed to send reset code via ${method}. Please try again.` 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: `Reset code sent to your ${method}`,
      expiresIn: 600 // 10 minutes in seconds
    }, { status: 200 })

  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}
