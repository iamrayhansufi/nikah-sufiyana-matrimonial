import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { database } from "@/lib/database-service";
import { redis } from "@/lib/redis-client";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long"),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format"),
  password: z.string().min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/, 
      "Password must include letters, numbers, and special characters"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender must be either male or female" }),
  }),
  age: z.number().min(18, "Age must be at least 18").max(80, "Age must be less than 80"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  preferredLocation: z.string().min(1, "Location is required"),
  education: z.string().min(1, "Education is required"),
  profession: z.string().optional(),
  sect: z.string().min(1, "Sect is required"),
  motherTongue: z.string().optional(), // Made optional as requested
  height: z.string().min(1, "Height is required"),
  complexion: z.string().optional(),
  maritalPreferences: z.string().optional(),
  aboutMe: z.string().optional(),
  familyDetails: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userData = registerSchema.parse(body);

    // Check if user already exists with phone number
    const userIds = await redis.smembers("users");
    for (const id of userIds) {
      const user = await redis.hgetall(`user:${id}`);
      if (user && user.phone === userData.phone) {
        return NextResponse.json(
          { error: "Phone number already registered" },
          { status: 409 }
        );
      }
    }

    // Check if user exists with email (if provided)
    if (userData.email) {
      const existingUserByEmail = await database.users.getByEmail(userData.email);
      
      if (existingUserByEmail) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 409 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Generate user ID
    const userId = `user:${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    // Create user with all provided fields
    const newUserData = {
      id: userId,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      whatsappNumber: userData.phone, // Auto-fill WhatsApp with phone number from registration
      password: hashedPassword,
      gender: userData.gender,
      age: userData.age,
      country: userData.country,
      city: userData.city,
      location: userData.preferredLocation,
      education: userData.education,
      profession: userData.profession,
      sect: userData.sect,
      motherTongue: userData.motherTongue || null, // Made optional
      height: userData.height,
      complexion: userData.complexion,
      profileStatus: "approved", // All profiles are automatically approved
      subscription: "free",
      lastActive: new Date().toISOString(),
      // Optional fields
      maritalStatus: userData.maritalPreferences,
      aboutMe: userData.aboutMe,
      familyDetails: userData.familyDetails,
      verified: false,
      createdAt: new Date().toISOString(),
      role: "user"
    };

    // Save user to Redis
    await database.users.create(newUserData);

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: userId,
        email: newUserData.email,
        fullName: newUserData.fullName,
        profileStatus: newUserData.profileStatus,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Registration failed. Please try again later." },
      { status: 500 }
    );
  }
}
