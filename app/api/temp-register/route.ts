import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { createVerificationOTP } from "@/lib/verification-redis";
import { z } from "zod";
import { nanoid } from "nanoid";

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
  // Make location optional or derive from preferredLocation if available
  location: z.string().optional().default(""),
  // Also accept preferredLocation as a potential location value
  preferredLocation: z.string().optional(),
  education: z.string().min(1, "Education is required"),
  sect: z.string().min(1, "Sect is required"),
  // Additional fields
  countryCode: z.string().optional(),
  profession: z.string().optional(),
  income: z.string().optional(),
  religion: z.string().optional(),
  hijabNiqab: z.string().optional(),
  beard: z.string().optional(),
  height: z.string().optional(),
  complexion: z.string().optional(),
  maritalPreferences: z.string().optional(),
  preferredAgeMin: z.string().optional().or(z.number().optional()),
  preferredAgeMax: z.string().optional().or(z.number().optional()),
  preferredEducation: z.string().optional(),
  preferredProfession: z.string().optional(),
  housing: z.string().optional(),
  aboutMe: z.string().optional(),
  familyDetails: z.string().optional(),
  expectations: z.string().optional(),
  termsAccepted: z.boolean().optional(),
  privacyAccepted: z.boolean().optional(),
  profileVisibility: z.string().optional(),
  motherTongue: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { email, password, fullName, phone, ...rest } = result.data;

    // Check if user already exists
    const existingUser = await redis.hgetall(`user:${email}`);
    if (existingUser && existingUser.email) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Create temporary user record
    const userId = nanoid();
    const tempUser = {
      id: userId,
      email,
      password,
      fullName,
      phone,
      status: "pending_verification",
      createdAt: new Date().toISOString(),
      ...rest
    };

    await redis.hset(`temp_user:${userId}`, tempUser);

    // Send verification code
    await createVerificationOTP(email, "registration");

    return NextResponse.json({ 
      success: true,
      message: "Registration completed! You can now log in. Please check your email for verification instructions.",
      email,
      tempRegistration: true,
      note: "Your account has been temporarily stored and will be migrated to the database when connectivity is restored."
    }, { status: 201 });
  } catch (error) {
    console.error("Error in temporary registration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
