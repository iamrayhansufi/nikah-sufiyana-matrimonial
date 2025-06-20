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
    const body = await request.json();
    console.log('📝 verify-otp API: Request body', { 
      email: body.email, 
      codeLength: body.code?.length,
      purpose: body.purpose 
    });
    
    const validationResult = requestSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.log('❌ verify-otp API: Validation failed', validationResult.error.errors);
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const { email, code, purpose } = validationResult.data;
    
    // Verify OTP
    console.log(`🔄 verify-otp API: Verifying OTP for ${email}`);
    const isValid = await verifyOTP(email, code, purpose);    if (isValid) {
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
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired verification code"
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
