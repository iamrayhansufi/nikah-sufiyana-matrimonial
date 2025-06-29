import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";
import { z } from "zod";

const undoInterestSchema = z.object({
  receiverId: z.string(),
});

// Also accept legacy profileId parameter for backwards compatibility
const undoInterestLegacySchema = z.object({
  profileId: z.string(),
});

async function handleUndoInterest(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Try new schema first, then legacy
    let receiverId: string;
    const newResult = undoInterestSchema.safeParse(body);
    if (newResult.success) {
      receiverId = newResult.data.receiverId;
    } else {
      const legacyResult = undoInterestLegacySchema.safeParse(body);
      if (legacyResult.success) {
        receiverId = legacyResult.data.profileId;
      } else {
        return NextResponse.json({ 
          error: "Invalid request data. Expected receiverId or profileId." 
        }, { status: 400 });
      }
    }

    // Find relevant interest
    const interestKeys = await redis.keys("interest:*");
    for (const key of interestKeys) {
      const interest = await redis.hgetall(key);
      if (interest &&
          interest.senderId === session.user.id &&
          interest.receiverId === receiverId &&
          interest.status === "pending") {
        // Delete the interest
        await redis.del(key);
        return NextResponse.json({ success: true, message: "Interest removed successfully" });
      }
    }

    return NextResponse.json({ error: "Interest not found or already processed" }, { status: 404 });
  } catch (error) {
    console.error("Error undoing interest:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return handleUndoInterest(request);
}

export async function DELETE(request: NextRequest) {
  return handleUndoInterest(request);
}
