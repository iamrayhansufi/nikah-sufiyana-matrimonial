import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "../../../../src/db";
import { blockedUsers, users } from "../../../../src/db/schema";
import { verifyAuth } from "../../../../src/lib/auth";
import { z } from "zod";

const blockSchema = z.object({
  blockedUserId: z.number(),
  reason: z.string().min(1).max(500).optional(),
});

export async function POST(req: Request) {
  try {
    // Verify authentication
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { blockedUserId, reason } = blockSchema.parse(body);

    // Check if blocked user exists
    const blockedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, blockedUserId))
      .limit(1);

    if (!blockedUser || blockedUser.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Prevent self-blocking
    if (userId === blockedUserId) {
      return NextResponse.json(
        { error: "You cannot block yourself" },
        { status: 400 }
      );
    }

    // Check if already blocked
    const existingBlock = await db
      .select()
      .from(blockedUsers)
      .where(
        and(
          eq(blockedUsers.userId, userId),
          eq(blockedUsers.blockedUserId, blockedUserId)
        )
      )
      .limit(1);

    if (existingBlock && existingBlock.length > 0) {
      return NextResponse.json(
        { error: "You have already blocked this user" },
        { status: 400 }
      );
    }

    // Create block
    const [block] = await db
      .insert(blockedUsers)
      .values({
        userId,
        blockedUserId,
        reason,
      })
      .returning();

    return NextResponse.json({
      message: "User blocked successfully",
      blockId: block.id,
    });
  } catch (error) {
    console.error("Block user error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to block user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // Verify authentication
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const blockedUserId = parseInt(url.searchParams.get("userId") || "");

    if (isNaN(blockedUserId)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Remove block
    await db
      .delete(blockedUsers)
      .where(
        and(
          eq(blockedUsers.userId, userId),
          eq(blockedUsers.blockedUserId, blockedUserId)
        )
      );

    return NextResponse.json({
      message: "User unblocked successfully",
    });
  } catch (error) {
    console.error("Unblock user error:", error);
    return NextResponse.json(
      { error: "Failed to unblock user" },
      { status: 500 }
    );
  }
} 