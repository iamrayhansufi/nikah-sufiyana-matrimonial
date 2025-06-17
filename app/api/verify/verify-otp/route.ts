import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/verification";
import { z } from "zod";

// Input validation schema
const requestSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "Verification code must be 6 digits"),
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
    
    const { email, code, purpose } = validationResult.data;
    
    // Verify OTP
    const isValid = await verifyOTP(email, code, purpose);
    
    if (isValid) {
      return NextResponse.json(
        {
          success: true,
          message: "Verification code is valid"
        },
        { status: 200 }
      );
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
