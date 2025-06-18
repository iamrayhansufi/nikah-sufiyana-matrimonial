import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { isEmailVerified, createVerificationOTP } from "@/lib/verification";
import { logDbOperation, logDbError } from "@/lib/db-logger";

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

    // Try multiple connection approaches with better error handling
    let isExistingUser = false;
    let dbAuthError = false;
    
    // Check if user already exists
    try {
      // Use direct DB module with custom retry mechanism
      const { neon } = await import("@neondatabase/serverless");
      
      // Try each connection URL in order of preference
      const connectionUrls = [
        process.env.DATABASE_URL_UNPOOLED,
        process.env.POSTGRES_URL_NON_POOLING,
        process.env.DATABASE_URL,
        process.env.POSTGRES_URL
      ].filter(Boolean); // Remove undefined/null values
      
      if (connectionUrls.length === 0) {
        throw new Error("No database URL defined in environment");
      }
      
      // Try each connection URL until one works
      let sql;
      let usedUrl;
      let existingUsers;
      
      for (const url of connectionUrls) {
        try {
          logDbOperation("Attempting connection", { 
            urlPrefix: url?.substring(0, 20) + '...',
            purpose: "user existence check" 
          });
          
          sql = neon(url as string);
          
          // Quick connection test
          await sql`SELECT 1`;
          
          // If we get here, connection worked
          logDbOperation("Connection successful", { 
            urlPrefix: url?.substring(0, 20) + '...' 
          });
          usedUrl = url;
          
          // Now check for existing user
          existingUsers = await sql`
            SELECT id, email, phone FROM users 
            WHERE email = ${userData.email} OR phone = ${userData.phone}
            LIMIT 1
          `;
          
          logDbOperation("Existing user check completed", { 
            found: existingUsers?.length > 0,
            email: userData.email
          });
          break; // Exit loop if connection and query succeed
          
        } catch (connErr) {
          logDbError("Connection attempt failed", connErr, {
            urlPrefix: url?.substring(0, 20) + '...'
          });
            // Continue to next URL
          if (connErr instanceof Error && connErr.message.includes('password authentication')) {
            dbAuthError = true;
          }
        }
      }
      
      // Check if we found any user
      if (existingUsers && Array.isArray(existingUsers) && existingUsers.length > 0) {
        isExistingUser = true;
        const existing = existingUsers[0];
        
        if (existing.email === userData.email) {
          return NextResponse.json(
            { error: "Email already registered" },
            { status: 409 }
          );
        } else {
          return NextResponse.json(
            { error: "Phone number already registered" },
            { status: 409 }
          );
        }
      }
      
    } catch (dbError) {
      console.error("Error during duplicate check:", dbError);
      
      // Skip duplicate check on authentication errors
      // The database's constraints will still catch duplicates
      if (dbError instanceof Error && 
         !dbError.message.includes("password authentication") &&
         !dbError.message.includes("authentication failed")) {
        return NextResponse.json(
          { 
            error: "Failed to verify account availability", 
            details: dbError instanceof Error ? dbError.message : "Unknown database error"
          },
          { status: 500 }
        );
      } else {
        console.warn("Skipping duplicate check due to authentication error, proceeding with insert");
        dbAuthError = true;
      }
    }
    
    // If we encountered authentication errors and the user didn't already exist,
    // suggest using the fallback registration route
    if (dbAuthError && !isExistingUser) {
      console.warn("Database authentication issues detected, suggesting fallback registration");
      return NextResponse.json(
        {
          error: "Database authentication issue",
          details: "We're experiencing technical difficulties with our database. Please try the alternative registration method.",
          suggestFallback: true
        },
        { status: 503 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Use preferredLocation as location if location is not provided
    const locationValue = userData.location || userData.preferredLocation || userData.city || "";
    
    // Prepare user data
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
    
    try {
      // Try using the most direct connection method
      const { neon } = await import("@neondatabase/serverless");
      
      // Prioritize unpooled connection for better reliability in serverless environments
      const unpooledUrl = process.env.DATABASE_URL_UNPOOLED || 
                          process.env.POSTGRES_URL_NON_POOLING ||
                          process.env.DATABASE_URL;

      if (!unpooledUrl) {
        throw new Error("No database URL defined in environment");
      }
      
      logDbOperation("Preparing user insertion", {
        email: userInsertData.email,
        urlType: unpooledUrl === process.env.DATABASE_URL_UNPOOLED ? 
                "DATABASE_URL_UNPOOLED" : 
                unpooledUrl === process.env.POSTGRES_URL_NON_POOLING ? 
                "POSTGRES_URL_NON_POOLING" : "other"
      });
      
      // Create a direct connection
      const sql = neon(unpooledUrl);
      
      // Log insert attempt
      logDbOperation("Attempting user insertion", {
        email: userInsertData.email,
        phone: userInsertData.phone,
      });
      
      // Insert only essential fields first
      await sql`
        INSERT INTO users (
          full_name, email, phone, password, gender, age, country, city,
          location, education, sect, profile_status
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
          ${userInsertData.profileStatus}
        )
      `;
      
      logDbOperation("Basic user data inserted successfully", {
        email: userInsertData.email
      });
      
      // Try to update with additional fields
      try {
        await sql`
          UPDATE users 
          SET 
            profession = ${userInsertData.profession},
            income = ${userInsertData.income},
            height = ${userInsertData.height},
            complexion = ${userInsertData.complexion},
            marital_status = ${userInsertData.maritalStatus},
            preferred_age_min = ${userInsertData.preferredAgeMin},
            preferred_age_max = ${userInsertData.preferredAgeMax},
            preferred_education = ${userInsertData.preferredEducation},
            preferred_location = ${userInsertData.preferredLocation},
            preferred_occupation = ${userInsertData.preferredOccupation},
            housing_status = ${userInsertData.housingStatus},
            about_me = ${userInsertData.aboutMe},
            family_details = ${userInsertData.familyDetails},
            expectations = ${userInsertData.expectations},
            mother_tongue = ${userInsertData.motherTongue}
          WHERE email = ${userInsertData.email}
        `;
        logDbOperation("Additional user fields updated successfully", {
          email: userInsertData.email
        });
      } catch (updateError) {
        logDbError("Non-critical error updating optional fields", updateError, {
          email: userInsertData.email
        });
        // Non-critical error, continue with registration
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
    } catch (dbInsertError) {
      logDbError("Failed to insert user", dbInsertError, {
        email: userData.email,
        operation: "user_registration"
      });
      
      let errorDetails = "Database insert failed";
      let statusCode = 500;
      
      if (dbInsertError instanceof Error) {
        errorDetails = dbInsertError.message;
        
        // Check for common error types
        if (errorDetails.includes("duplicate key") || errorDetails.includes("unique constraint")) {
          statusCode = 409;
          
          if (errorDetails.includes("email")) {
            errorDetails = "Email already registered";
          } else if (errorDetails.includes("phone")) {
            errorDetails = "Phone number already registered";
          } else {
            errorDetails = "This account already exists";
          }
        }
      }
      
      return NextResponse.json(
        { 
          error: "Failed to create user account", 
          details: errorDetails
        },
        { status: statusCode }
      );
    }
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
      } else if (error.message.includes("authentication") || error.message.includes("password")) {
        errorDetails = "Database authentication error. Please contact support.";
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
