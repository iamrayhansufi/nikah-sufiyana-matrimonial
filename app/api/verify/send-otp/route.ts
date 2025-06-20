import { NextRequest, NextResponse } from "next/server";
import { createVerificationOTP } from "@/lib/verification-redis";
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

    const otpResult = await createVerificationOTP(email, purpose);
    if (!otpResult.success) {
      return NextResponse.json({ error: otpResult.error }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: "OTP sent successfully" 
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
