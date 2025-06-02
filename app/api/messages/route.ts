import { NextResponse } from "next/server";
import { and, eq, or } from "drizzle-orm";
import { db } from "../../../src/db";
import { messages, users } from "../../../src/db/schema";
import { verifyAuth } from "../../../src/lib/auth";
import { z } from "zod";

const querySchema = z.object({
  otherUserId: z.string().optional(),
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("20"),
});

export async function GET(req: Request) {
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
    const params = querySchema.parse(Object.fromEntries(url.searchParams));
    const { otherUserId, page, limit } = params;

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build query conditions
    let conditions = [];
    if (otherUserId) {
      const otherId = parseInt(otherUserId);
      conditions.push(
        or(
          and(
            eq(messages.senderId, userId),
            eq(messages.receiverId, otherId)
          ),
          and(
            eq(messages.senderId, otherId),
            eq(messages.receiverId, userId)
          )
        )
      );
    } else {
      conditions.push(
        or(
          eq(messages.senderId, userId),
          eq(messages.receiverId, userId)
        )
      );
    }

    // Get messages with user details
    const messagesList = await db
      .select({
        id: messages.id,
        content: messages.content,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        read: messages.read,
        createdAt: messages.createdAt,
        senderName: users.fullName,
        senderPhoto: users.profilePhoto,
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(and(...conditions))
      .orderBy(messages.createdAt)
      .limit(limit)
      .offset(offset);

    // Mark messages as read
    if (messagesList.length > 0) {
      await db
        .update(messages)
        .set({ read: true })
        .where(
          and(
            eq(messages.receiverId, userId),
            eq(messages.read, false)
          )
        );
    }

    // Get unread count
    const [{ count }] = await db
      .select({ count: messages.id })
      .from(messages)
      .where(
        and(
          eq(messages.receiverId, userId),
          eq(messages.read, false)
        )
      );

    return NextResponse.json({
      messages: messagesList,
      unreadCount: Number(count),
      pagination: {
        page,
        limit,
        hasMore: messagesList.length === limit,
      },
    });
  } catch (error) {
    console.error("Get messages error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid parameters", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to get messages" },
      { status: 500 }
    );
  }
} 