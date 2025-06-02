import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { fullName, email, phone, password, gender, age } = body

    if (!fullName || !email || !phone || !password || !gender || !age) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    // Check if user already exists
    // In a real app, you would check against your database
    const existingUser = await checkUserExists(email, phone)

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email or phone" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user profile
    const newUser = {
      id: generateUserId(),
      fullName,
      email,
      phone,
      password: hashedPassword,
      gender,
      age: Number.parseInt(age),
      profileStatus: "pending", // pending, approved, rejected
      subscription: "free", // free, premium, vip
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...body, // Include other profile fields
    }

    // Save to database
    await saveUserToDatabase(newUser)

    // Send verification email/SMS
    await sendVerificationEmail(email)
    await sendVerificationSMS(phone)

    return NextResponse.json(
      {
        message: "Registration successful! Please verify your email and phone.",
        userId: newUser.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper functions (implement with your database)
async function checkUserExists(email: string, phone: string) {
  // Check database for existing user
  return false // Placeholder
}

async function hashPassword(password: string) {
  // Use bcrypt or similar to hash password
  return password // Placeholder
}

function generateUserId() {
  return Math.random().toString(36).substr(2, 9)
}

async function saveUserToDatabase(user: any) {
  // Save to MongoDB/PostgreSQL/etc
  console.log("Saving user:", user)
}

async function sendVerificationEmail(email: string) {
  // Send verification email
  console.log("Sending verification email to:", email)
}

async function sendVerificationSMS(phone: string) {
  // Send verification SMS
  console.log("Sending verification SMS to:", phone)
}
