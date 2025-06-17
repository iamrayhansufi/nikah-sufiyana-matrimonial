import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { markNotificationAsRead } from "@/lib/notifications";
import { db } from "@/src/db";
import { users, notifications } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";

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
    
    // Get the current user ID
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email)
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Verify that the notification belongs to the user
    const notification = await db.query.notifications.findFirst({
      where: and(
        eq(notifications.id, parseInt(notificationId)),
        eq(notifications.userId, user.id)
      )
    });
    
    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }
    
    // Mark the notification as read
    await markNotificationAsRead(notificationId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 });
  }
}
