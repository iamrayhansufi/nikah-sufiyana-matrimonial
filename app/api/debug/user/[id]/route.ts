import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

/**
 * Debug endpoint to fetch raw user data from database
 * Only use during development/debugging
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }
    
    console.log(`🔍 Debug API: Fetching user data for ID ${userId}`);
    
    const userData = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (!userData || userData.length === 0) {
      console.log(`❌ Debug API: User ID ${userId} not found in database`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Sanitize the user data by removing sensitive fields
    const user = userData[0];
    const sanitizedUser = {
      ...user,
      password: undefined
    };
    
    console.log(`✅ Debug API: User found, verified status: ${sanitizedUser.verified}`);
    
    return NextResponse.json(sanitizedUser);
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
