import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { isEmailVerified, createVerificationOTP } from "@/lib/verification";

// Input validation schema
const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  gender: z.string().min(1, "Gender is required"),
  age: z.string().min(1, "Age is required").or(z.number()),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  location: z.string().min(1, "Location is required"),
  education: z.string().min(1, "Education is required"),
  sect: z.string().min(1, "Sect is required"),
  // Add other required fields as needed
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    // Log request for debugging
    console.log('Registration request received:', {
      email: body.email,
      phone: body.phone,
      // Don't log password or full body for security
    });
    
    const validation = registerSchema.safeParse(body);
    
    if (!validation.success) {
      // Log the detailed validation errors
      console.error('Validation failed:', validation.error.errors);
      
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }
    
    const userData = validation.data;

    // Check if user already exists
    const existingUserByEmail = await db.query.users.findFirst({
      where: eq(users.email, userData.email),
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const existingUserByPhone = await db.query.users.findFirst({
      where: eq(users.phone, userData.phone),
    });

    if (existingUserByPhone) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);    // Create user record
    await db.insert(users).values({
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      password: hashedPassword,
      gender: userData.gender,
      age: typeof userData.age === 'string' ? parseInt(userData.age, 10) : userData.age,
      country: userData.country,
      city: userData.city,
      location: userData.location,
      education: userData.education,
      sect: userData.sect,
      // Add other fields from userData
      profileStatus: "pending_verification", // User needs email verification
    });    // Generate and send verification OTP
    try {
      await createVerificationOTP(userData.email, "registration");
      console.log(`Verification OTP sent to ${userData.email}`);
    } catch (otpError) {
      console.error("Error sending verification OTP:", otpError);
      // Continue with registration success but log the email issue
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful! Please check your email to verify your account.",
        email: userData.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorName = error instanceof Error ? error.name : "Error";
    
    return NextResponse.json(
      { 
        error: "Failed to register user", 
        details: `${errorName}: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
