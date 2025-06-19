import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/src/db"
import { eq, and } from "drizzle-orm"
import { users, interests, notifications } from "@/src/db/schema"
import { authOptions } from "@/lib/auth-options"

export async function DELETE(request: NextRequest) {
  try {
    // Get user session to verify authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ 
          error: "You must be logged in to undo interest" 
        }), 
        { status: 401 }
      )
    }
    
    // Get the request body
    const body = await request.json()
    const { profileId } = body
    
    if (!profileId) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Profile ID is required" 
        }), 
        { status: 400 }
      )
    }
    
    // Get the current user (sender)
    const senderUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email)
    })
    
    if (!senderUser) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Sender user not found" 
        }), 
        { status: 404 }
      )
    }
    
    // Get the target user (receiver)
    const targetUser = await db.query.users.findFirst({
      where: eq(users.id, profileId)
    })
    
    if (!targetUser) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Target profile not found" 
        }), 
        { status: 404 }
      )
    }
    
    // Find the existing interest
    const existingInterest = await db
      .select()
      .from(interests)
      .where(
        and(
          eq(interests.fromUserId, senderUser.id),
          eq(interests.toUserId, targetUser.id)
        )
      )
      .limit(1);

    if (existingInterest.length === 0) {
      return new NextResponse(
        JSON.stringify({ 
          error: "No interest found to undo" 
        }), 
        { status: 404 }
      )
    }
    
    const interest = existingInterest[0];
    
    // Check if interest has been accepted - don't allow undo if it's already a match
    if (interest.status === 'accepted') {
      return new NextResponse(
        JSON.stringify({ 
          error: "Cannot undo interest that has already been accepted" 
        }), 
        { status: 400 }
      )
    }
    
    // Delete the interest record
    await db
      .delete(interests)
      .where(eq(interests.id, interest.id));
      // Remove related notifications (simplified approach)
    try {
      await db
        .delete(notifications)
        .where(
          and(
            eq(notifications.userId, targetUser.id),
            eq(notifications.type, "interest")
          )
        );
    } catch (notificationError) {
      console.warn("Could not remove related notifications:", notificationError);
      // Don't fail the entire operation if notification cleanup fails
    }
    
    console.log(`Interest undone: User ${senderUser.id} removed interest in User ${targetUser.id}`);
    
    return new NextResponse(
      JSON.stringify({ 
        success: true,
        message: "Interest undone successfully"
      }), 
      { status: 200 }
    )
    
  } catch (error) {
    console.error("Error undoing interest:", error)
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to undo interest" 
      }), 
      { status: 500 }
    )
  }
}
