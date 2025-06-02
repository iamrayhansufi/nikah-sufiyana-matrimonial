import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../../../../src/db";
import { messages, users } from "../../../../src/db/schema";
import { verifyAuth } from "../../../../src/lib/auth";
import { z } from "zod";

const messageSchema = z.object({
  receiverId: z.number(),
  content: z.string().min(1).max(1000),
});

export async function POST(req: Request) {
  try {
    // Verify authentication
    const senderId = await verifyAuth(req);
    if (!senderId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { receiverId, content } = messageSchema.parse(body);

    // Check if receiver exists and is approved
    const receiver = await db
      .select()
      .from(users)
      .where(eq(users.id, receiverId))
      .limit(1);

    if (!receiver || receiver.length === 0 || receiver[0].profileStatus !== "approved") {
      return NextResponse.json(
        { error: "Recipient not found or not available" },
        { status: 404 }
      );
    }

    // Create message
    const [newMessage] = await db
      .insert(messages)
      .values({
        senderId,
        receiverId,
        content,
      })
      .returning();

    return NextResponse.json({
      message: "Message sent successfully",
      messageId: newMessage.id,
    });
  } catch (error) {
    console.error("Send message error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
} 