import { NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";
import { z } from "zod";
import { nanoid } from "nanoid";

const messageSchema = z.object({
  receiverId: z.string(),
  content: z.string().min(1).max(1000),
});

export async function POST(request: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request body
    const body = await request.json();
    const result = messageSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid message data" }, { status: 400 });
    }

    const { receiverId, content } = result.data;

    // Verify receiver exists
    const receiver = await redis.hgetall(`user:${receiverId}`);
    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
    }

    // Create message in Redis
    const messageId = nanoid();
    const message = {
      id: messageId,
      senderId: session.user.id,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
    };

    await redis.hset(`message:${messageId}`, message);

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error in POST /api/messages/send:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}