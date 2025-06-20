import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options-redis";
import { database } from "@/lib/database-service";

// GET - Fetch notifications for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the user's notifications
    const notifications = await database.notifications.getUserNotifications(session.user.id);
      // Define metadata type outside the map function
    interface NotificationMetadata {
      relatedUserId?: string;
      [key: string]: any;
    }
    
    // Handle notifications with relatedUserId to fetch related user info
    const enhancedNotifications = await Promise.all(notifications.map(async notification => {
      let metadata: NotificationMetadata = {};
      let relatedUser = null;
      
      // Parse metadata if it exists
      try {
        if (notification.metadata) {
          if (typeof notification.metadata === 'string') {
            metadata = JSON.parse(notification.metadata) as NotificationMetadata;
          } else {
            metadata = notification.metadata as NotificationMetadata;
          }
          
          // Fetch related user if available
          const relatedUserId = metadata.relatedUserId;
          if (relatedUserId) {
            const user = await database.users.getById(relatedUserId);
            if (user) {
              relatedUser = {
                id: user.id,
                fullName: user.fullName,
                profilePhoto: user.profilePhoto
              };
            }
          }
        }
      } catch (error) {
        console.error("Error parsing notification metadata:", error);
      }
      
      return {
        ...notification,
        metadata,
        relatedUser,
        read: notification.read === "true" || notification.read === true
      };
    }));
    
    return NextResponse.json(enhancedNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

// POST - Mark a notification as read
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { notificationId } = await request.json();
    
    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
    }
    
    // Mark the notification as read
    await database.notifications.markAsRead(notificationId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 });
  }
}
