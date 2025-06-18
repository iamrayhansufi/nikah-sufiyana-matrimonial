import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

/**
 * Check if a user is verified in the database
 * @param userId User ID to check verification status for
 * @returns Object containing verified status and user data
 */
export async function checkVerificationStatus(email: string) {
  try {
    console.log(`🔍 Checking verification status for ${email}`);
    
    const userData = await db
      .select({
        id: users.id,
        email: users.email,
        verified: users.verified,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (!userData || userData.length === 0) {
      console.log(`❌ User not found with email ${email}`);
      return { exists: false, verified: false, user: null };
    }
    
    const user = userData[0];
    console.log(`✅ User ${email}: verified=${user.verified}`);
    
    return {
      exists: true,
      verified: !!user.verified,
      user
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
    
    const result = await db
      .update(users)
      .set({ verified: true })
      .where(eq(users.email, email))
      .returning({ id: users.id, verified: users.verified });
    
    if (result && result.length > 0) {
      console.log(`✅ User ${email} marked as verified:`, result[0]);
      return { success: true, user: result[0] };
    } else {
      console.log(`❌ Failed to mark user ${email} as verified: No rows updated`);
      return { success: false, reason: "No user found" };
    }
  } catch (error) {
    console.error(`❌ Error marking user ${email} as verified:`, error);
    return { success: false, error };
  }
}
