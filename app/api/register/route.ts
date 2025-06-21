import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { isEmailVerified, createVerificationOTP } from "@/lib/verification-redis";
import { logDbOperation, logDbError } from "@/lib/db-logger";
import path from 'path';
import fs from 'fs/promises';
import { database } from "@/lib/database-service";

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
  maritalStatus: z.string().optional(),
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
  // Add other fields as needed
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    // Log request for debugging
    console.log('Registration request received:', {
      email: body.email,
      phone: body.phone,
      // Safe fields to log for debugging
      fields: Object.keys(body),
      location: body.location,
      preferredLocation: body.preferredLocation,
      city: body.city,
      country: body.country,
      // Don't log password or sensitive data
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
    
    const userData = validation.data;    // Check if user already exists using Redis
    let isExistingUser = false;
    
    try {
      // Validate email before proceeding
      if (!userData.email || typeof userData.email !== 'string') {
        throw new Error(`Invalid email format: ${typeof userData.email}`);
      }
      
      logDbOperation("Checking if user already exists in Redis", {
        email: userData.email,
        phone: userData.phone
      });
      
      // Check by email
      const existingUserByEmail = await database.users.getByEmail(userData.email);
      
      if (existingUserByEmail) {
        isExistingUser = true;
        return NextResponse.json(
          { error: "A user with this email already exists" },
          { status: 409 }
        );
      }
        // We would need to check by phone as well, but this requires additional functionality
      // For now, we'll use a workaround by scanning all users
      const allUserIds = await database.users.getAllUserIds();
      
      for (const userId of allUserIds) {
        try {
          const user = await database.users.getById(userId);
          if (user && user.phone === userData.phone) {
            isExistingUser = true;
            return NextResponse.json(
              { error: "A user with this phone number already exists" },
              { status: 409 }
            );
          }
        } catch (userCheckError) {
          console.error(`Error checking user ${userId}:`, userCheckError);
          // Continue with other users instead of failing completely
          continue;
        }
      }
      
      logDbOperation("User existence check completed", {
        found: isExistingUser,
        email: userData.email
      });
    } catch (error) {
      logDbError("Error checking user existence", error, {
        email: userData.email
      });
      
      return NextResponse.json(
        { error: "Failed to check user existence. Please try again." },
        { status: 500 }
      );
    }
    
    // If the user doesn't exist, continue with registration
    if (!isExistingUser) {
      try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Prepare location
        let location = userData.location;
        if (!location && userData.preferredLocation) {
          location = userData.preferredLocation;
        }
        if (!location && userData.city) {
          location = `${userData.city}, ${userData.country}`;
        }
        
        // Create the user in Redis
        logDbOperation("Creating new user in Redis", {
          email: userData.email
        });
        
        const newUser = {
          fullName: userData.fullName,
          email: userData.email,
          password: hashedPassword,
          phone: userData.phone,
          gender: userData.gender,
          age: userData.age,
          country: userData.country,
          city: userData.city,
          location: location,
          education: userData.education,
          sect: userData.sect,
          profession: userData.profession || "",
          income: userData.income || "",
          religion: userData.religion || "Islam",
          height: userData.height || "",
          complexion: userData.complexion || "",
          maritalStatus: userData.maritalStatus || "Single",
          motherTongue: userData.motherTongue || "",
          profileCompleted: false,
          emailVerified: false,
          phoneVerified: false,
          role: "user",
          premium: false,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        };
        
        // Create the user
        const userId = await database.users.create(newUser);
        logDbOperation("User created successfully", {
          userId,
          email: userData.email
        });
        
        // Generate and send verification OTP
        const verificationData = await createVerificationOTP(userData.email);
        if (!verificationData.success) {
          logDbError("Failed to create verification OTP", new Error(verificationData.error), {
            email: userData.email
          });
        }
        
        // Return success response
        return NextResponse.json({
          success: true,
          message: "Registration successful. Please verify your email.",
          userId,
          emailVerificationSent: verificationData.success,
        });
      } catch (error) {
        logDbError("Error during user creation", error, {
          email: userData.email
        });
        
        return NextResponse.json(
          { error: "User registration failed. Please try again." },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "Registration failed due to an unexpected error" },
      { status: 500 }
    );
  }
}
