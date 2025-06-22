import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options-redis";
import { database } from "@/lib/database-service";

// Simple in-memory cache to reduce Redis calls
const notificationCache = new Map<string, { data: any[], timestamp: number }>();
const CACHE_DURATION = 15000; // 15 seconds cache

// GET - Fetch notifications for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    const now = Date.now();
      // Check cache first
    const cached = notificationCache.get(userId);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log(`📋 Returning cached notifications for user ${userId}`);
      return NextResponse.json({ notifications: cached.data });
    }
    
    console.log(`🔄 Fetching fresh notifications for user ${userId}`);
    
    // Get the user's notifications
    const notifications = await database.notifications.getUserNotifications(userId);
    
    // Ensure notifications is an array
    const notificationsArray = Array.isArray(notifications) ? notifications : [];
    
    // Define metadata type outside the map function
    interface NotificationMetadata {
      relatedUserId?: string;
      [key: string]: any;
    }    // Handle notifications with relatedUserId to fetch related user info
    const enhancedNotifications = await Promise.all(notificationsArray.map(async notification => {
      let metadata: NotificationMetadata = {};
      let relatedUser = null;
      let link = null; // Add link generation
      
      // Parse metadata if it exists
      try {
        if (notification.metadata) {
          if (typeof notification.metadata === 'string') {
            metadata = JSON.parse(notification.metadata) as NotificationMetadata;
          } else {
            metadata = notification.metadata as NotificationMetadata;
          }
        }
        
        // Also check the 'data' field which is commonly used for interest notifications
        if (notification.data && typeof notification.data === 'string') {
          try {
            const parsedData = JSON.parse(notification.data);
            if (parsedData.senderId) {
              metadata.relatedUserId = parsedData.senderId;
            }
            
            // Generate appropriate links based on notification type
            switch (notification.type) {
              case 'interest_received':
                link = '/interests'; // Go to interests page to manage
                break;
              case 'interest_accepted':
              case 'interest_declined':
                if (parsedData.responderId) {
                  link = `/profile/${parsedData.responderId}`;
                }
                break;
              case 'profile_approved':
                link = '/browse';
                break;
              case 'profile_rejected':
                link = '/edit-profile';
                break;
              case 'message_received':
                link = '/messages';
                break;
              default:
                link = '/dashboard';
                break;
            }
          } catch (e) {
            // Ignore parsing errors for data field
          }
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
      } catch (error) {
        console.error("Error parsing notification metadata:", error);
      }
      
      return {
        ...notification,
        metadata,
        relatedUser,
        link, // Add the generated link
        read: notification.read === "true" || notification.read === true
      };
    }));
    
    // Cache the results
    notificationCache.set(userId, {
      data: enhancedNotifications,
      timestamp: now
    });
    
    console.log(`💾 Cached ${enhancedNotifications.length} notifications for user ${userId}`);
    
    return NextResponse.json({ notifications: enhancedNotifications });
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
    
    // Invalidate cache for the user
    const userId = session.user.id;
    notificationCache.delete(userId);
    
    console.log(`📱 Marked notification ${notificationId} as read for user ${userId}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 });
  }
}
