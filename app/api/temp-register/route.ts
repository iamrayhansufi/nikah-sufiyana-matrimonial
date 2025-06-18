import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import fs from 'fs/promises';
import path from 'path';
import { createVerificationOTP } from "@/lib/verification";

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

// File path for storing temp registrations
const TEMP_USERS_DIRECTORY = path.join(process.cwd(), 'temp-registrations');

/**
 * Fallback registration API that stores user data in temporary files
 * This can be used when database access is having issues
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    // Log request for debugging
    console.log('Registration request received:', {
      email: body.email,
      phone: body.phone,
      fields: Object.keys(body),
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

    // Ensure temp directory exists
    try {
      await fs.mkdir(TEMP_USERS_DIRECTORY, { recursive: true });
    } catch (mkdirError) {
      console.error("Failed to create temp directory:", mkdirError);
    }

    // Check if user already exists in temp files
    try {
      const tempFiles = await fs.readdir(TEMP_USERS_DIRECTORY);
      
      // Check for email duplication
      const emailExists = tempFiles.some(file => file === `${userData.email.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
      if (emailExists) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 409 }
        );
      }
      
      // Check for phone duplication (simple check)
      for (const file of tempFiles) {
        try {
          const content = await fs.readFile(path.join(TEMP_USERS_DIRECTORY, file), 'utf-8');
          const user = JSON.parse(content);
          if (user.phone === userData.phone) {
            return NextResponse.json(
              { error: "Phone number already registered" },
              { status: 409 }
            );
          }
        } catch (readError) {
          console.error(`Error reading file ${file}:`, readError);
          // Continue checking other files
        }
      }
    } catch (fsError) {
      console.error("Error checking existing users:", fsError);
      // Continue - if we can't read directory, assume no users yet
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Use preferredLocation as location if location is not provided
    const locationValue = userData.location || userData.preferredLocation || userData.city || "";
    
    // Prepare user data for storing
    const userToStore = {
      id: Date.now().toString(),
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      password: hashedPassword,
      gender: userData.gender,
      age: typeof userData.age === 'string' ? parseInt(userData.age, 10) : userData.age,
      country: userData.country,
      city: userData.city,
      location: locationValue,
      education: userData.education,
      sect: userData.sect,
      profession: userData.profession || null,
      income: userData.income || null,
      height: userData.height || null,
      complexion: userData.complexion || null,
      maritalStatus: userData.maritalPreferences || null,
      preferredAgeMin: userData.preferredAgeMin ? (typeof userData.preferredAgeMin === 'string' ? parseInt(userData.preferredAgeMin, 10) : userData.preferredAgeMin) : null,
      preferredAgeMax: userData.preferredAgeMax ? (typeof userData.preferredAgeMax === 'string' ? parseInt(userData.preferredAgeMax, 10) : userData.preferredAgeMax) : null,
      preferredEducation: userData.preferredEducation || null,
      preferredLocation: userData.preferredLocation || null,
      preferredOccupation: userData.preferredProfession || null,
      housingStatus: userData.housing || null,
      aboutMe: userData.aboutMe || null,
      familyDetails: userData.familyDetails || null,
      expectations: userData.expectations || null,
      motherTongue: userData.motherTongue || null,
      profileStatus: "pending_verification",
      createdAt: new Date().toISOString()
    };
    
    // Store user in temp file
    const filePath = path.join(TEMP_USERS_DIRECTORY, `${userData.email.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
    try {
      await fs.writeFile(filePath, JSON.stringify(userToStore, null, 2));
      console.log(`User data stored in temp file: ${filePath}`);
    } catch (writeError) {
      console.error("Failed to write user data to temp file:", writeError);
      return NextResponse.json(
        { error: "Failed to store user data" },
        { status: 500 }
      );
    }
    
    // Try to send verification OTP if possible
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
        message: "Registration completed! You can now log in. Please check your email for verification instructions.",
        email: userData.email,
        tempRegistration: true,
        note: "Your account has been temporarily stored and will be migrated to the database when connectivity is restored."
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in temporary registration:", error);
    return NextResponse.json(
      { 
        error: "Failed to register user", 
        details: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}
