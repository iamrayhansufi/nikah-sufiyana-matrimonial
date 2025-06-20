import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";
import { z } from "zod";
import { nanoid } from "nanoid";

const blockSchema = z.object({
  blockedUserId: z.string(),
  reason: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = blockSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const { blockedUserId, reason } = result.data;

    // Check if user exists
    const blockedUser = await redis.hgetall(`user:${blockedUserId}`);
    if (!blockedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create block record
    const blockId = nanoid();
    const block = {
      id: blockId,
      userId: session.user.id,
      blockedUserId,
      reason: reason || "",
      createdAt: new Date().toISOString(),
    };

    await redis.hset(`block:${blockId}`, block);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error blocking user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}