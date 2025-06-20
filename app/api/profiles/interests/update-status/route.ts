import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { z } from "zod";
import { getAuthSession } from "@/lib/auth";

interface RedisUser extends Record<string, string> {
  id: string;
  email: string;
}

interface RedisInterest extends Record<string, string> {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
}

const updateInterestSchema = z.object({
  interestId: z.string(),
  status: z.enum(["accepted", "declined"]),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { interestId, status } = updateInterestSchema.parse(body);

    // Get current user
    const userKeys = await redis.keys("user:*");
    let currentUser: RedisUser | null = null;
    
    for (const key of userKeys) {
      const user = await redis.hgetall(key) as RedisUser;
      if (user && user.email === session.user.email) {
        currentUser = user;
        break;
      }
    }

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the interest
    const interest = await redis.hgetall(interestId) as RedisInterest;
    
    if (!interest || interest.receiverId !== currentUser.id) {
      return NextResponse.json(
        { error: "Interest not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    // Get sender info
    const sender = await redis.hgetall(`user:${interest.senderId}`) as RedisUser;
    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }

    // Update interest status
    await redis.hmset(interestId, {
      status,
      updatedAt: new Date().toISOString()
    });

    // Create notification for sender
    const notificationId = `notification:${Date.now()}`;
    const notificationData = {
      userId: sender.id,
      title: `Interest ${status === 'accepted' ? 'Accepted' : 'Declined'}`,
      message: status === 'accepted' 
        ? `${currentUser.fullName || 'Someone'} has accepted your interest request!`
        : `${currentUser.fullName || 'Someone'} has declined your interest request.`,
      type: 'interest_response',
      data: JSON.stringify({
        interestId,
        status,
        responderId: currentUser.id,
        responderName: currentUser.fullName || 'Anonymous'
      }),
      read: 'false',
      createdAt: new Date().toISOString()
    };

    await redis.hmset(notificationId, notificationData);
    await redis.lpush(`notifications:${sender.id}`, notificationId);

    return NextResponse.json({
      message: `Interest ${status} successfully`,
      data: {
        interestId,
        status,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Error updating interest status:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update interest status" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
