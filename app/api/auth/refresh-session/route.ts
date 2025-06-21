import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options-redis";
import { redisTables } from "@/lib/redis-client";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    console.log(`🔄 Refresh session API: Checking verification status for user ${session.user.id}`);
    
    // Get fresh user data from Redis
    const freshUser = await redisTables.users.get(session.user.id);
    
    if (!freshUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    const isVerified = freshUser.verified === true || freshUser.verified === 'true';
    
    console.log(`🔄 Refresh session API: User ${session.user.id} verification status: ${isVerified}`);
    
    return NextResponse.json({
      success: true,
      user: {
        id: freshUser.id,
        email: freshUser.email,
        verified: isVerified,
        name: freshUser.fullName
      }
    });
    
  } catch (error) {
    console.error("Error refreshing session:", error);
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    );
  }
}
