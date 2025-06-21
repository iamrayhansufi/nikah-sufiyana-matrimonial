import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/verification-redis";
import { z } from "zod";
import { database } from "@/lib/database-service";

// Input validation schema
const requestSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "Verification code must be 6 digits"),
  purpose: z.enum(["registration", "password-reset"]).default("registration")
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 verify-otp API: Request received');
    
    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.log('❌ verify-otp API: Failed to parse JSON body', parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    
    console.log('📝 verify-otp API: Request body', { 
      email: body.email, 
      codeProvided: !!body.code,
      codeLength: body.code?.length,
      purpose: body.purpose 
    });
    
    const validationResult = requestSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.log('❌ verify-otp API: Validation failed', validationResult.error.errors);
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }
    
    const { email, code, purpose } = validationResult.data;    // Verify OTP
    console.log(`🔄 verify-otp API: Verifying OTP for ${email}`);
    const isValid = await verifyOTP(email, code, purpose);
    
    // Get additional details for better error messages if verification failed
    let errorMessage = "Invalid or expired verification code";
    
    if (!isValid) {
      try {
        // Check what specifically went wrong by examining the verification record
        const redis = (await import("@/lib/redis-client")).redis;
        const verificationKey = `verification:${email}:${purpose}`;
        const verification = await redis.hgetall(verificationKey);
        
        if (!verification || Object.keys(verification).length === 0) {
          errorMessage = "No verification code found. Please request a new code.";
        } else {
          const now = Date.now();
          let expiresAt = 0;
            if (verification.expiresAt) {
            expiresAt = typeof verification.expiresAt === 'string' 
              ? parseInt(verification.expiresAt) 
              : typeof verification.expiresAt === 'number'
                ? verification.expiresAt
                : 0;
          }
          
          const isUsed = verification.isUsed === true || verification.isUsed === "true";
          const isExpired = expiresAt <= now;
          const codeMatch = String(verification.code) === String(code);
          
          if (isUsed) {
            errorMessage = "This verification code has already been used. Please request a new code.";
          } else if (isExpired) {
            errorMessage = "This verification code has expired. Please request a new code.";
          } else if (!codeMatch) {
            errorMessage = "Invalid verification code. Please check and try again.";
          }
        }
      } catch (checkError) {
        console.error("Error checking verification details:", checkError);
      }
    }
    
    if (isValid) {
      console.log(`✅ verify-otp API: OTP is valid for ${email}`);
      try {
        // Update the user's verified status in the database
        if (purpose === "registration") {
          console.log(`🔄 verify-otp API: Updating verified status for ${email}`);
          
          // Find user by email
          const user = await database.users.getByEmail(email);
          
          if (user) {
            // Update user verification status
            await database.users.update(user.id, { 
              verified: true 
            });
            
            // Get the updated user data
            const updatedUser = await database.users.getById(user.id);
            
            console.log(`✅ verify-otp API: User verified status updated to ${updatedUser?.verified}`);
            
            const userData = {
              id: updatedUser.id,
              email: updatedUser.email,
              fullName: updatedUser.fullName,
              phone: updatedUser.phone,
              verified: updatedUser.verified === true || updatedUser.verified === 'true'
            };
            
            return NextResponse.json(
              {
                success: true,
                message: "Email verified successfully",
                user: userData
              },
              { status: 200 }
            );
          } else {
            return NextResponse.json(
              {
                success: false,
                message: "User not found"
              },
              { status: 404 }
            );
          }
        } else {
          // For password reset or other purposes
          return NextResponse.json(
            {
              success: true,
              message: "Verification code is valid"
            },
            { status: 200 }
          );
        }
      } catch (dbError) {
        console.error("Database error updating user verification status:", dbError);
        return NextResponse.json(
          {
            success: true,
            message: "Verification code is valid, but failed to update user status"
          },
          { status: 200 }
        );
      }    } else {
      return NextResponse.json(
        {
          success: false,
          message: errorMessage
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to verify code:", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
