import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options-redis";
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { notificationId } = await request.json();
    
    console.log('📱 Mark as read request:', { notificationId, type: typeof notificationId });
    
    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
    }
    
    // Convert notification ID to string and handle both formats
    let cleanNotificationId = String(notificationId);
    
    // If it's a number, we need to find the actual notification key
    if (typeof notificationId === 'number' || !cleanNotificationId.startsWith('notification:')) {
      // Search through all notifications to find one with matching ID
      const notificationKeys = await redis.keys('notification:*');
      let foundKey = null;
      
      for (const key of notificationKeys) {
        const notification = await redis.hgetall(key) as RedisNotification;
        if (notification && (notification.id === cleanNotificationId || key.endsWith(cleanNotificationId))) {
          foundKey = key;
          break;
        }
      }
      
      if (!foundKey) {
        console.log('❌ Notification not found for ID:', cleanNotificationId);
        return NextResponse.json({ error: "Notification not found" }, { status: 404 });
      }
      
      cleanNotificationId = foundKey;
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
    // Get the notification using the found key
    const notification = await redis.hgetall(cleanNotificationId) as RedisNotification;
    
    if (!notification || !notification.userId) {
      console.log('❌ Notification data not found for key:', cleanNotificationId);
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }
    
    // Extract user ID from the notification's userId (remove user: prefix if present)
    const notificationUserId = notification.userId.startsWith('user:') ? 
      notification.userId.replace('user:', '') : notification.userId;
    
    // Extract session user ID (remove user: prefix if present)
    const sessionUserId = userId.startsWith('user:') ? 
      userId.replace('user:', '') : userId;
    
    if (notificationUserId !== sessionUserId) {
      console.log('❌ Unauthorized access:', { notificationUserId, sessionUserId });
      return NextResponse.json({ error: "Unauthorized to mark this notification as read" }, { status: 403 });
    }
    
    // Mark the notification as read
    await redis.hmset(cleanNotificationId, { read: 'true' });
    
    console.log(`✅ Notification ${notificationId} marked as read for user ${userId}`);
    
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
