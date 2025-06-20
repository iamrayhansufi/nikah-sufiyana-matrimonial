import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { redis } from "@/lib/redis-client";

interface RedisUser {
  [key: string]: string;
  id: string;
  email: string;
}

interface RedisNotification {
  [key: string]: string;
  userId: string;
  title: string;
  message: string;
  read: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { notificationId } = await request.json();
    
    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
    }
    
    // Get the current user
    const userKeys = await redis.keys("user:*");
    let userId: string | null = null;
    
    for (const key of userKeys) {
      const user = await redis.hgetall(key) as RedisUser;
      if (user && user.email === session.user.email) {
        userId = user.id;
        break;
      }
    }
    
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Get the notification
    const notification = await redis.hgetall(`notification:${notificationId}`) as RedisNotification;
    
    if (!notification || notification.userId !== userId) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }
    
    // Mark the notification as read
    await redis.hmset(`notification:${notificationId}`, { read: 'true' });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
