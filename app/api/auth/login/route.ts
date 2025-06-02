import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, password } = body

    if ((!email && !phone) || !password) {
      return NextResponse.json({ error: "Email/phone and password are required" }, { status: 400 })
    }

    // Find user by email or phone
    const user = await findUserByEmailOrPhone(email || phone)

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
    const token = generateJWTToken(user.id)

    // Set HTTP-only cookie
    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    // Update last login
    await updateLastLogin(user.id)

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        subscription: user.subscription,
        profileStatus: user.profileStatus,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper functions
async function findUserByEmailOrPhone(identifier: string) {
  // Query database for user
  return null // Placeholder
}

async function verifyPassword(password: string, hashedPassword: string) {
  // Use bcrypt to verify password
  return true // Placeholder
}

function generateJWTToken(userId: string) {
  // Generate JWT token
  return "jwt-token" // Placeholder
}

async function updateLastLogin(userId: string) {
  // Update user's last login timestamp
  console.log("Updating last login for user:", userId)
}
