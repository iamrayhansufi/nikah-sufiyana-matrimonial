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

    console.log('🔄 Undo Interest Debug:', {
      sessionUserId: session.user.id,
      receiverId,
      rawBody: body
    });

    // Normalize the receiverId format
    let normalizedReceiverId = receiverId;
    if (!normalizedReceiverId.startsWith('user:')) {
      normalizedReceiverId = `user:${normalizedReceiverId}`;
    }

    console.log('🔄 Normalized receiver ID:', normalizedReceiverId);

    // Find relevant interest
    const interestKeys = await redis.keys("interest:*");
    console.log(`🔍 Found ${interestKeys.length} interests to check`);

    for (const key of interestKeys) {
      const interest = await redis.hgetall(key);
      
      console.log('🔍 Checking interest:', {
        key,
        senderId: interest?.senderId,
        receiverId: interest?.receiverId,
        status: interest?.status,
        matches: interest?.senderId === session.user.id && 
                interest?.receiverId === normalizedReceiverId &&
                interest?.status === "pending"
      });

      if (interest &&
          interest.senderId === session.user.id &&
          interest.receiverId === normalizedReceiverId &&
          interest.status === "pending") {
        
        console.log('✅ Found matching interest to delete:', key);
        
        // Delete the interest
        await redis.del(key);
        
        // Also remove from user interest lists
        await redis.lrem(`sent_interests:${session.user.id}`, 0, key);
        await redis.lrem(`received_interests:${normalizedReceiverId}`, 0, key);
        
        return NextResponse.json({ success: true, message: "Interest removed successfully" });
      }
    }

    console.log('❌ No matching interest found');
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
