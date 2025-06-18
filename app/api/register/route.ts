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
    
    const userData = validation.data;

    // Check if user already exists - with robust error handling    
    try {
      // Import sqlClient directly from db module
      const { sqlClient } = await import('@/src/db');      // Check if email exists using raw SQL for better compatibility
      const emailCheckResult = await sqlClient`SELECT id FROM users WHERE email = ${userData.email} LIMIT 1`;
      
      // Access array of results with type assertion
      if ((emailCheckResult as any[]).length > 0) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 409 }
        );
      }      // Check if phone exists using raw SQL
      const phoneCheckResult = await sqlClient`SELECT id FROM users WHERE phone = ${userData.phone} LIMIT 1`;
      
      // Access array of results with type assertion
      if ((phoneCheckResult as any[]).length > 0) {
        return NextResponse.json(
          { error: "Phone number already registered" },
          { status: 409 }
        );
      }
    } catch (dbError) {
      console.error("Database error checking for existing user:", dbError);
      return NextResponse.json(
        { 
          error: "Failed to verify account availability", 
          details: dbError instanceof Error ? dbError.message : "Unknown database error"
        },
        { status: 500 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Use preferredLocation as location if location is not provided
    const locationValue = userData.location || userData.preferredLocation || userData.city || "";
      try {
      // Clean and prepare data object with proper types
      const userInsertData = {
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
        // Additional fields from userData
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
        profileStatus: "pending_verification", // User needs email verification
      };
      
      console.log("Preparing to insert user with data:", {
        ...userInsertData,
        password: "[REDACTED]" // Don't log the password
      });
        // Create user record - with explicit error handling
      const { sqlClient } = await import('@/src/db');      await sqlClient`
        INSERT INTO users (
          full_name, email, phone, password, gender, age, country, city, location, education, sect, 
          profile_status, profession, income, height, complexion, marital_status, 
          preferred_age_min, preferred_age_max, preferred_education, preferred_location, 
          preferred_occupation, housing_status, about_me, family_details, expectations, mother_tongue
        ) VALUES (
          ${userInsertData.fullName},
          ${userInsertData.email},
          ${userInsertData.phone},
          ${userInsertData.password},
          ${userInsertData.gender},
          ${userInsertData.age},
          ${userInsertData.country},
          ${userInsertData.city},
          ${userInsertData.location},
          ${userInsertData.education},
          ${userInsertData.sect},
          ${userInsertData.profileStatus},
          ${userInsertData.profession},
          ${userInsertData.income},
          ${userInsertData.height},
          ${userInsertData.complexion},
          ${userInsertData.maritalStatus},
          ${userInsertData.preferredAgeMin},
          ${userInsertData.preferredAgeMax},
          ${userInsertData.preferredEducation},
          ${userInsertData.preferredLocation},
          ${userInsertData.preferredOccupation},
          ${userInsertData.housingStatus},
          ${userInsertData.aboutMe},
          ${userInsertData.familyDetails},
          ${userInsertData.expectations},
          ${userInsertData.motherTongue}
        )
      `;
      
      console.log(`User created successfully with email: ${userData.email}`);
    } catch (dbInsertError) {
      console.error("Failed to insert user:", dbInsertError);
      return NextResponse.json(
        { 
          error: "Failed to create user account", 
          details: dbInsertError instanceof Error ? dbInsertError.message : "Database insert failed"
        },
        { status: 500 }
      );
    }

    // Generate and send verification OTP
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
    
    // Provide more detailed error information based on error type
    let errorDetails = "Unknown error occurred";
    let statusCode = 500;
    
    if (error instanceof Error) {
      // Format the error message
      errorDetails = `${error.name}: ${error.message}`;
      
      // Check for specific types of errors
      if (error.message.includes("duplicate key") || error.message.includes("unique constraint")) {
        statusCode = 409;
        if (error.message.includes("email")) {
          errorDetails = "Email already registered";
        } else if (error.message.includes("phone")) {
          errorDetails = "Phone number already registered";
        } else {
          errorDetails = "This account already exists";
        }
      } else if (error.message.includes("database") || error.message.includes("connection")) {
        errorDetails = "Database connection error. Please try again later.";
      }
    }
    
    // Add stack trace in development environment only
    const devDetails = process.env.NODE_ENV === 'development' && error instanceof Error 
      ? { stack: error.stack } 
      : {};
    
    return NextResponse.json(
      { 
        error: "Failed to register user", 
        details: errorDetails,
        ...devDetails
      },
      { status: statusCode }
    );
  }
}
