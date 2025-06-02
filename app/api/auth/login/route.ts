import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByEmail, updateUser } from "@/lib/database"
import { generateJWT } from "@/lib/auth"
import bcrypt from "bcryptjs"

type ProfileStatus = "pending" | "approved" | "rejected"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, password } = body

    if ((!email && !phone) || !password) {
      return NextResponse.json({ error: "Email/phone and password are required" }, { status: 400 })
    }

    // Find user by email or phone
    const user = await getUserByEmail(email || phone)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if profile is approved
    if (user.profileStatus !== "approved") {
      return NextResponse.json({ error: "Profile is pending approval" }, { status: 403 })
    }

    // Generate JWT token
    const token = generateJWT(user.id)

    // Create response with cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        subscription: user.subscription,
        profileStatus: user.profileStatus as ProfileStatus,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    // Update last login
    await updateUser(user.id, { lastActive: new Date() })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword)
}
