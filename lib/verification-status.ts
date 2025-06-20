import { redis } from "@/lib/redis-client";
import { database } from "@/lib/database-service";

/**
 * Check if a user is verified in the database
 * @param userId User ID to check verification status for
 * @returns Object containing verified status and user data
 */
export async function checkVerificationStatus(email: string) {
  try {
    console.log(`🔍 Checking verification status for ${email}`);
    
    const user = await database.users.getByEmail(email);
    
    if (!user) {
      console.log(`❌ User not found with email ${email}`);
      return { exists: false, verified: false, user: null };
    }
    
    console.log(`✅ User ${email}: verified=${user.verified}`);
    
    return {
      exists: true,
      verified: !!user.verified,
      user: {
        id: user.id,
        email: user.email,
        verified: user.verified
      }
    };
  } catch (error) {
    console.error("Error checking verification status:", error);
    return { exists: false, verified: false, user: null, error };
  }
}

/**
 * Mark a user as verified in the database
 * @param email User email to mark as verified
 */
export async function markUserAsVerified(email: string) {
  try {
    console.log(`🔄 Marking user ${email} as verified`);
    
    const user = await database.users.getByEmail(email);
    
    if (!user) {
      console.log(`❌ User not found with email ${email}`);
      throw new Error("User not found");
    }
    
    // Update verified status in Redis
    await redis.hset(`user:${user.id}`, {
      verified: "true"
    });
    
    console.log(`✅ User ${email} marked as verified`);
    
    return {
      success: true,
      userId: user.id
    };
  } catch (error) {
    console.error(`❌ Error marking user ${email} as verified:`, error);
    return { success: false, error };
  }
}

/**
 * Check if a phone number is verified in the database
 * @param phone Phone number to check
 * @returns Object containing verified status
 */
export async function checkPhoneVerificationStatus(phone: string) {
  try {
    console.log(`🔍 Checking phone verification for ${phone}`);
    
    // Get the user by phone number
    const allUserIds = await database.users.getAllUserIds();
    for (const userId of allUserIds) {
      const user = await database.users.getById(userId);
      if (user?.phone === phone) {
        return {
          exists: true,
          verified: user.phoneVerified === true,
          user: {
            id: user.id,
            phone: user.phone,
            phoneVerified: user.phoneVerified
          }
        };
      }
    }
    
    return { exists: false, verified: false, user: null };
  } catch (error) {
    console.error("Error checking phone verification:", error);
    return { exists: false, verified: false, user: null, error };
  }
}

/**
 * Mark a user's phone number as verified
 * @param phone Phone number to mark as verified
 */
export async function markPhoneAsVerified(phone: string) {
  try {
    console.log(`🔄 Marking phone ${phone} as verified`);
    
    // Find user by phone
    const allUserIds = await database.users.getAllUserIds();
    let userId = null;
    
    for (const id of allUserIds) {
      const user = await database.users.getById(id);
      if (user?.phone === phone) {
        userId = id;
        break;
      }
    }
    
    if (!userId) {
      console.log(`❌ User not found with phone ${phone}`);
      throw new Error("User not found");
    }
    
    // Update phoneVerified status in Redis
    await redis.hset(`user:${userId}`, {
      phoneVerified: "true"
    });
    
    console.log(`✅ Phone ${phone} marked as verified`);
    
    return {
      success: true,
      userId
    };
  } catch (error) {
    console.error(`❌ Error marking phone ${phone} as verified:`, error);
    return { success: false, error };
  }
}
