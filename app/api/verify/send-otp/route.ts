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
    
    // Generate and send OTP
    await createVerificationOTP(email, purpose);
    
    return NextResponse.json(
      { 
        success: true,
        message: "Verification code sent successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send verification code:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
