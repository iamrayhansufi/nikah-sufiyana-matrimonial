import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/src/db"
import { eq, and } from "drizzle-orm"
import { users, interests } from "@/src/db/schema"
import { createNotification } from "@/lib/notifications"

export async function POST(request: NextRequest) {
  try {
    // Get user session to verify authentication
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ 
          error: "You must be logged in to send interest" 
        }), 
        { status: 401 }
      )
    }
    
    // Get the request body
    const body = await request.json()
    const { profileId, message } = body
    
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
    
    // Check if interest was already sent
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

    if (existingInterest.length > 0) {
      return new NextResponse(
        JSON.stringify({ 
          success: true,
          message: "Interest already sent",
          interestStatus: existingInterest[0].status
        }), 
        { status: 200 }
      )
    }
    
    // Create a new interest record
    const notificationText = message || `${senderUser.fullName || 'Someone'} has shown interest in your profile`
    
    const [interest] = await db
      .insert(interests)
      .values({
        fromUserId: senderUser.id,
        toUserId: targetUser.id,
        message: notificationText,
        status: "pending",
      })
      .returning();
    
    // Create notification for the target user
    await createNotification({
      userId: String(targetUser.id),
      type: "interest",
      message: notificationText,
      link: `/profile/${senderUser.id}`,
      metadata: {
        senderName: senderUser.fullName,
        senderId: String(senderUser.id),
        interestId: String(interest.id)
      }
    })
    
    // Check if there's a mutual interest
    const mutualInterest = await db
      .select()
      .from(interests)
      .where(
        and(
          eq(interests.fromUserId, targetUser.id),
          eq(interests.toUserId, senderUser.id)
        )
      )
      .limit(1);
    
    // If mutual interest exists, automatically approve both
    if (mutualInterest.length > 0) {
      await db
        .update(interests)
        .set({ status: "accepted" })
        .where(eq(interests.id, interest.id));
      
      await db
        .update(interests)
        .set({ status: "accepted" })
        .where(eq(interests.id, mutualInterest[0].id));
      
      // Send notification of match
      await createNotification({
        userId: String(targetUser.id),
        type: "match",
        message: `You have a new match with ${senderUser.fullName}!`,
        link: `/profile/${senderUser.id}`,
        metadata: {
          matchName: senderUser.fullName,
          matchId: String(senderUser.id),
        }
      });
      
      await createNotification({
        userId: String(senderUser.id),
        type: "match",
        message: `You have a new match with ${targetUser.fullName}!`,
        link: `/profile/${targetUser.id}`,
        metadata: {
          matchName: targetUser.fullName,
          matchId: String(targetUser.id),
        }
      });
    }
    
    return new NextResponse(
      JSON.stringify({ 
        success: true,
        message: "Interest sent successfully",
        interest: interest,
        isMutual: mutualInterest.length > 0
      }), 
      { status: 200 }
    )
    
  } catch (error) {
    console.error("Error sending interest:", error)
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to send interest" 
      }), 
      { status: 500 }
    )
  }
}
