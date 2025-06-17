import { db } from "@/src/db";
import { verificationCodes } from "@/src/db/schema";
import { eq, and, gt, desc } from "drizzle-orm";
import { sendOTPVerificationEmail } from "./email-service";

// Function to generate a random OTP
export function generateOTP(length = 6): string {
  const digits = "0123456789";
  let OTP = "";
  
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  
  return OTP;
}

// Function to create and store an OTP
export async function createVerificationOTP(email: string, purpose = "registration"): Promise<string> {
  // Generate a 6-digit OTP
  const otp = generateOTP();
  
  // Set expiration time (10 minutes from now)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  
  // Store in database
  await db.insert(verificationCodes).values({
    email,
    code: otp,
    purpose,
    expiresAt,
    isUsed: false,
  });

  // Send email with OTP
  await sendOTPVerificationEmail(email, otp);
  
  return otp;
}

// Function to verify an OTP
export async function verifyOTP(email: string, code: string, purpose = "registration"): Promise<boolean> {
  // Find the most recent valid OTP
  const now = new Date();
  
  const result = await db.query.verificationCodes.findFirst({
    where: and(
      eq(verificationCodes.email, email),
      eq(verificationCodes.code, code),
      eq(verificationCodes.purpose, purpose),
      eq(verificationCodes.isUsed, false),
      gt(verificationCodes.expiresAt, now)
    ),
    orderBy: (codes) => [desc(codes.createdAt)]
  });
  
  if (!result) {
    return false;
  }
  
  // Mark the OTP as used
  await db
    .update(verificationCodes)
    .set({ isUsed: true })
    .where(eq(verificationCodes.id, result.id));
  
  return true;
}

// Function to check if email is verified (for registration)
export async function isEmailVerified(email: string): Promise<boolean> {
  const result = await db.query.verificationCodes.findFirst({
    where: and(
      eq(verificationCodes.email, email),
      eq(verificationCodes.purpose, "registration"),
      eq(verificationCodes.isUsed, true)
    )
  });
  
  return !!result;
}
