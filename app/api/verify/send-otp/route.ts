import { NextRequest, NextResponse } from "next/server";
import { createVerificationOTP } from "@/lib/verification";
import { z } from "zod";

// Input validation schema
const requestSchema = z.object({
  email: z.string().email("Invalid email address"),
  purpose: z.enum(["registration", "password-reset"]).default("registration")
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = requestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const { email, purpose } = validationResult.data;
      try {
      // Generate and send OTP
      const otp = await createVerificationOTP(email, purpose);
      
      // Log success for debugging (remove in production)
      console.log(`OTP generated for ${email}: ${otp}`);
      
      return NextResponse.json(
        { 
          success: true,
          message: "Verification code sent successfully" 
        },
        { status: 200 }
      );
    } catch (error) {
      // Cast the unknown error to a type with message property
      const otpError = error as Error;
      console.error("Error sending verification code:", otpError);
      
      // Return a more specific error message
      return NextResponse.json(
        { 
          error: "Failed to send verification code",
          details: process.env.NODE_ENV === 'development' 
            ? otpError.message 
            : undefined
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Failed to process verification code request:", error);
    return NextResponse.json(
      { error: "Internal server error processing verification request" },
      { status: 500 }
    );
  }
}
