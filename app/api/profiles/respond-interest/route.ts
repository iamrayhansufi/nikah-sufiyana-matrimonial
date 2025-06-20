import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options-redis"
import { database } from "@/lib/database-service"

export async function POST(request: NextRequest) {
  try {
    // Get user session to verify authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: "You must be logged in to respond to interests" 
      }, { status: 401 })
    }
    
    // Get the request body
    const body = await request.json()
    const { interestId, action } = body // action: 'accept' or 'decline'
    
    if (!interestId || !action) {
      return NextResponse.json({ 
        error: "Interest ID and action are required" 
      }, { status: 400 })
    }
    
    if (!['accept', 'decline'].includes(action)) {
      return NextResponse.json({ 
        error: "Action must be 'accept' or 'decline'" 
      }, { status: 400 })
    }
    
    // Get the current user (receiver)
    const receiverUserId = session.user.id
    const receiverUser = await database.users.getById(receiverUserId)
    
    if (!receiverUser) {
      return NextResponse.json({ 
        error: "Receiver user not found" 
      }, { status: 404 })
    }
    
    // Get all interests
    const receivedInterests = await database.interests.getReceivedInterests(receiverUserId);
    
    // Find the specific interest
    const interest = receivedInterests.find(i => i.id === interestId);

    if (!interest) {
      return NextResponse.json({ 
        error: "Interest not found or you're not authorized to respond to it" 
      }, { status: 404 })
    }
    
    // Check if interest has already been responded to
    if (interest.status !== 'pending') {
      return NextResponse.json({ 
        error: `Interest has already been ${interest.status}` 
      }, { status: 400 })
    }
    
    // Update the interest status
    await database.interests.update(interestId, { 
      status: action === 'accept' ? 'accepted' : 'declined'
    });
    
    // Get sender information for notification
    const senderUserId = interest.fromUserId
    const senderUser = await database.users.getById(senderUserId)
    
    if (senderUser) {
      // Create notification for the sender
      const notificationMessage = action === 'accept' 
        ? `🎉 ${receiverUser.fullName || 'Someone'} has accepted your interest! You can now view their photos. Click to visit their profile.`
        : `${receiverUser.fullName || 'Someone'} has declined your interest.`;
      
      // Create notification
      await database.notifications.create({
        userId: senderUserId,
        type: action === 'accept' ? "interest_accepted" : "interest_declined",
        message: notificationMessage,
        link: `/profile/${receiverUserId}`,
        read: false,
        createdAt: new Date().toISOString(),
        metadata: JSON.stringify({
          responderName: receiverUser.fullName,
          responderId: receiverUserId,
          interestId: interestId,
          action: action
        })
      });
    }
    
    console.log(`Interest ${action}ed: Interest ${interestId} by User ${receiverUserId}`);
    
    return NextResponse.json({ 
      success: true,
      message: `Interest ${action}ed successfully`,
      action: action
    }, { status: 200 })
    
  } catch (error) {
    console.error("Error responding to interest:", error)
    return NextResponse.json({ 
      error: "Failed to respond to interest" 
    }, { status: 500 })
  }
}
