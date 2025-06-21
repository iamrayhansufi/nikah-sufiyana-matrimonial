import { redis } from "./redis-client";
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
export async function createVerificationOTP(email: string, purpose = "registration"): Promise<{ 
  success: boolean; 
  otp?: string;
  error?: string;
}> {
  // Generate a 6-digit OTP
  const otp = generateOTP();
  
  // Set expiration time (10 minutes)
  const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes in milliseconds
  
  try {
    // Store in Redis
    const verificationKey = `verification:${email}:${purpose}`;
    
    await redis.hset(verificationKey, {
      email,
      code: otp,
      purpose,
      expiresAt: expiresAt.toString(),
      isUsed: "false",
      createdAt: Date.now().toString()
    });
    
    // Set expiration for the key itself
    await redis.expire(verificationKey, 600); // 600 seconds = 10 minutes
    
    // Send email with OTP
    await sendOTPVerificationEmail(email, otp);
    
    return {
      success: true,
      otp
    };
  } catch (error) {
    console.error("Error in createVerificationOTP:", error);
    
    // Still try to send the email even if Redis operations fail
    try {
      await sendOTPVerificationEmail(email, otp);
      return {
        success: true,
        otp,
        error: "Saved to email only, not to database"
      };
    } catch (emailError) {
      console.error("Failed to send OTP email as fallback:", emailError);
      return {
        success: false,
        error: "Failed to create or send verification code"
      };
    }
  }
}

// Function to verify an OTP
export async function verifyOTP(email: string, code: string, purpose = "registration"): Promise<boolean> {
  try {
    console.log(`🔍 verifyOTP: Checking OTP for ${email}, purpose: ${purpose}, code: ${code}`);
    
    const verificationKey = `verification:${email}:${purpose}`;
    
    // Get the verification record
    const verification = await redis.hgetall(verificationKey);
    
    console.log(`📝 verifyOTP: Retrieved verification data:`, {
      hasData: !!verification && Object.keys(verification).length > 0,
      keys: verification ? Object.keys(verification) : [],
      storedCode: verification?.code,
      isUsed: verification?.isUsed,
      expiresAt: verification?.expiresAt
    });
    
    if (!verification || Object.keys(verification).length === 0) {
      console.log(`❌ verifyOTP: No verification record found for ${email}`);
      return false;
    }
      const now = Date.now();
      // Handle potential undefined or non-string expiresAt value
    let expiresAt = 0;
    if (verification.expiresAt) {
      // Redis might return numbers as strings or actual numbers
      if (typeof verification.expiresAt === 'string') {
        expiresAt = parseInt(verification.expiresAt);
      } else if (typeof verification.expiresAt === 'number') {
        expiresAt = verification.expiresAt;
      }
    }
      // Check if the OTP is used - Redis might store as boolean false/true or string "false"/"true"
    const isNotUsed = verification.isUsed === false || 
                      verification.isUsed === "false" || 
                      !verification.isUsed;
    
    console.log(`🔍 verifyOTP: Validation checks:`, {
      codeMatch: String(verification.code) === String(code),
      notUsed: isNotUsed,
      notExpired: expiresAt > now,
      currentTime: now,
      expiresAt: expiresAt,
      rawIsUsed: verification.isUsed,
      rawExpiresAt: verification.expiresAt,
      storedCodeType: typeof verification.code,
      inputCodeType: typeof code,
      storedCodeValue: verification.code,
      inputCodeValue: code
    });
    
    const isValid = 
      String(verification.code) === String(code) &&
      isNotUsed &&
      expiresAt > now;
    
    if (isValid) {
      console.log(`✅ verifyOTP: OTP is valid, marking as used`);
      // Mark as used
      await redis.hset(verificationKey, {
        isUsed: "true"
      });
      
      return true;
    } else {
      console.log(`❌ verifyOTP: OTP validation failed`);
    }
    
    return false;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return false;
  }
}

// Check if an email is verified
export async function isEmailVerified(email: string): Promise<boolean> {
  try {
    const userIds = await redis.smembers("users");
    
    for (const userId of userIds) {
      const user = await redis.hgetall(`user:${userId}`);
      
      if (user && user.email === email) {
        return user.emailVerified === "true" || user.emailVerified === true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error checking email verification status:", error);
    return false;
  }
}

// Mark an email as verified
export async function markEmailAsVerified(email: string): Promise<boolean> {
  try {
    const userIds = await redis.smembers("users");
    
    for (const userId of userIds) {
      const user = await redis.hgetall(`user:${userId}`);
      
      if (user && user.email === email) {
        await redis.hset(`user:${userId}`, {
          emailVerified: "true"
        });
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error marking email as verified:", error);
    return false;
  }
}
