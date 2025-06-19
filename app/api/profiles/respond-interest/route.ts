import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/src/db"
import { eq, and } from "drizzle-orm"
import { users, interests, notifications } from "@/src/db/schema"
import { authOptions } from "@/lib/auth-options"
import { createNotification } from "@/lib/notifications"

export async function POST(request: NextRequest) {
  try {
    // Get user session to verify authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ 
          error: "You must be logged in to respond to interests" 
        }), 
        { status: 401 }
      )
    }
    
    // Get the request body
    const body = await request.json()
    const { interestId, action } = body // action: 'accept' or 'decline'
    
    if (!interestId || !action) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Interest ID and action are required" 
        }), 
        { status: 400 }
      )
    }
    
    if (!['accept', 'decline'].includes(action)) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Action must be 'accept' or 'decline'" 
        }), 
        { status: 400 }
      )
    }
    
    // Get the current user (receiver)
    const receiverUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email)
    })
    
    if (!receiverUser) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Receiver user not found" 
        }), 
        { status: 404 }
      )
    }
    
    // Find the interest record
    const existingInterest = await db
      .select()
      .from(interests)
      .where(
        and(
          eq(interests.id, interestId),
          eq(interests.toUserId, receiverUser.id)
        )
      )
      .limit(1);

    if (existingInterest.length === 0) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Interest not found or you're not authorized to respond to it" 
        }), 
        { status: 404 }
      )
    }
    
    const interest = existingInterest[0];
    
    // Check if interest has already been responded to
    if (interest.status !== 'pending') {
      return new NextResponse(
        JSON.stringify({ 
          error: `Interest has already been ${interest.status}` 
        }), 
        { status: 400 }
      )
    }
      // Update the interest status
    await db
      .update(interests)
      .set({ 
        status: action === 'accept' ? 'accepted' : 'declined'
      })
      .where(eq(interests.id, interest.id));
    
    // Get sender information for notification
    const senderUser = await db.query.users.findFirst({
      where: eq(users.id, interest.fromUserId)
    })
      if (senderUser) {
      // Create notification for the sender
      const notificationMessage = action === 'accept' 
        ? `🎉 ${receiverUser.fullName || 'Someone'} has accepted your interest! You can now view their photos. Click to visit their profile.`
        : `${receiverUser.fullName || 'Someone'} has declined your interest.`;
      
      await createNotification({
        userId: String(senderUser.id),
        type: action === 'accept' ? "interest_accepted" : "interest_declined",
        message: notificationMessage,
        link: `/profile/${receiverUser.id}`,
        metadata: {
          responderName: receiverUser.fullName,
          responderId: String(receiverUser.id),
          interestId: String(interest.id),
          action: action
        }
      });
    }
    
    console.log(`Interest ${action}ed: Interest ${interest.id} by User ${receiverUser.id}`);
    
    return new NextResponse(
      JSON.stringify({ 
        success: true,
        message: `Interest ${action}ed successfully`,
        action: action
      }), 
      { status: 200 }
    )
    
  } catch (error) {
    console.error("Error responding to interest:", error)
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to respond to interest" 
      }), 
      { status: 500 }
    )
  }
}
