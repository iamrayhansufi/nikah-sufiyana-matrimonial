import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/database"
import { hashPassword } from "@/lib/auth"
import { sendVerificationEmail, sendVerificationSMS } from "@/lib/notifications"

type UserRegistration = {
  fullName: string
  email: string
  phone: string
  password: string
  gender: "male" | "female"
  age: number
  [key: string]: any // For additional profile fields
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { fullName, email, phone, password, gender, age } = body as UserRegistration

    if (!fullName || !email || !phone || !password || !gender || !age) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate OTPs for email and SMS verification
    const emailOTP = generateOTP()
    const smsOTP = generateOTP()

    // Create user profile
    const newUser = await createUser({
      fullName,
      email,
      phone,
      password: hashedPassword,
      gender,
      age: Number.parseInt(age.toString()),
      profileStatus: "pending",
      subscription: "free",
      verified: false,
      lastActive: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      emailOTP, // Store OTPs for verification
      smsOTP,
      ...body, // Include other profile fields
    })

    // Send verification email/SMS
    await sendVerificationEmail(email, emailOTP)
    await sendVerificationSMS(phone, smsOTP)

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
