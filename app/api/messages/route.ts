import { NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";
import { z } from "zod";

const querySchema = z.object({
  otherUserId: z.string().optional(),
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("20"),
});

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

export async function GET(request: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get and validate query params
    const url = new URL(request.url);
    const result = querySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!result.success) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const { otherUserId, page, limit } = result.data;
    const skip = (page - 1) * limit;

    // Get messages from Redis
    const messageKeys = await redis.keys("message:*");
    const messages: Message[] = [];

    for (const key of messageKeys) {
      const message = await redis.hgetall(key) as Message;
      if (!message) continue;

      // Filter messages for the current user
      if (message.senderId === session.user.id || message.receiverId === session.user.id) {
        if (!otherUserId || message.senderId === otherUserId || message.receiverId === otherUserId) {
          messages.push(message);
        }
      }
    }

    // Sort messages by createdAt
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply pagination
    const paginatedMessages = messages.slice(skip, skip + limit);

    // Get user details for the messages
    const userIds = new Set<string>();
    paginatedMessages.forEach(msg => {
      userIds.add(msg.senderId);
      userIds.add(msg.receiverId);
    });

    const users: Record<string, any> = {};
    for (const userId of userIds) {
      const user = await redis.hgetall(`user:${userId}`);
      if (user) {
        users[userId] = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        };
      }
    }

    return NextResponse.json({
      messages: paginatedMessages,
      users,
      total: messages.length,
      page,
      limit
    });
  } catch (error) {
    console.error("Error in GET /api/messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}