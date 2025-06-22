import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options-redis"
import { redis } from "@/lib/redis-client"
import { sendInterestResponseEmail } from "@/lib/email-service"

interface RedisUser extends Record<string, string> {
  id: string;
  email: string;
  fullName: string;
}

interface RedisInterest extends Record<string, string> {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to calculate expiry date
function calculateExpiryDate(duration: string): Date {
  const now = new Date();
  
  switch (duration) {
    case '1day':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case '2days':
      return new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    case '1week':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case '1month':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    case 'permanent':
      return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year
    default:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Default 1 week
  }
}

// Helper function to convert duration codes to human-readable text
function getDurationText(duration: string): string {
  switch (duration) {
    case '1day': return '1 day';
    case '2days': return '2 days';
    case '1week': return '1 week';
    case '1month': return '1 month';
    case 'permanent': return 'permanently';
    default: return '1 week';
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user session to verify authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: "You must be logged in to respond to interests" 
      }, { status: 401 })
    }
    
    // Get the request body
    const body = await request.json()
    const { interestId, action, photoAccessDuration = '1week' } = body // action: 'accept' or 'decline', photoAccessDuration: '1day', '2days', '1week', '1month', 'permanent'
    
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

    // Validate photo access duration
    const validDurations = ['1day', '2days', '1week', '1month', 'permanent'];
    if (action === 'accept' && !validDurations.includes(photoAccessDuration)) {
      return NextResponse.json({ 
        error: "Invalid photo access duration" 
      }, { status: 400 })
    }
    
    // Get the current user (receiver)
    const userKeys = await redis.keys("user:*")
    let receiverUser: RedisUser | null = null
    
    for (const key of userKeys) {
      const user = await redis.hgetall(key) as RedisUser
      if (user && user.email === session.user.email) {
        receiverUser = user
        break
      }
    }

    if (!receiverUser) {
      return NextResponse.json({ 
        error: "Receiver user not found" 
      }, { status: 404 })
    }
    
    // Get the interest
    const interest = await redis.hgetall(interestId) as RedisInterest
    
    if (!interest || !interest.id) {
      return NextResponse.json({ 
        error: "Interest not found" 
      }, { status: 404 })
    }

    // Verify the current user is the receiver of this interest
    if (interest.receiverId !== receiverUser.id) {
      return NextResponse.json({ 
        error: "You're not authorized to respond to this interest" 
      }, { status: 403 })
    }
    
    // Check if interest has already been responded to
    if (interest.status !== 'pending') {
      return NextResponse.json({ 
        error: `Interest has already been ${interest.status}` 
      }, { status: 400 })
    }
    
    // Update the interest status and add photo access information if accepted
    const updateData: Record<string, string> = {
      status: action === 'accept' ? 'accepted' : 'declined',
      updatedAt: new Date().toISOString()
    }

    if (action === 'accept') {
      const expiryDate = calculateExpiryDate(photoAccessDuration);
      updateData.photoAccessDuration = photoAccessDuration;
      updateData.photoAccessExpiryDate = expiryDate.toISOString();
      updateData.photoAccessGrantedAt = new Date().toISOString();
    }
    
    await redis.hmset(interestId, updateData)
    
    // Get sender information for notification and email
    const senderUser = await redis.hgetall(`user:${interest.senderId}`) as RedisUser
    
    if (senderUser && senderUser.id) {
      // Create notification for the sender
      const notificationMessage = action === 'accept' 
        ? `🎉 ${receiverUser.fullName || 'Someone'} has accepted your interest! You can now view their photos for ${getDurationText(photoAccessDuration)}. Visit their profile to connect.`
        : `${receiverUser.fullName || 'Someone'} has declined your interest.`;
      
      // Create notification
      const notificationId = `notification:${Date.now()}`
      const notificationData = {
        userId: senderUser.id,
        title: action === 'accept' ? 'Interest Accepted! 🎉' : 'Interest Update',
        message: notificationMessage,
        type: action === 'accept' ? "interest_accepted" : "interest_declined",
        data: JSON.stringify({
          responderName: receiverUser.fullName,
          responderId: receiverUser.id,
          interestId: interestId,
          action: action,
          photoAccessDuration: action === 'accept' ? photoAccessDuration : undefined,
          photoAccessExpiry: action === 'accept' ? updateData.photoAccessExpiryDate : undefined
        }),
        read: 'false',
        createdAt: new Date().toISOString()
      }

      await redis.hmset(notificationId, notificationData)
      await redis.lpush(`notifications:${senderUser.id}`, notificationId)      // Send email notification
      try {
        await sendInterestResponseEmail(
          senderUser.email,
          senderUser.fullName || 'User',
          receiverUser.fullName || 'Someone',
          action as 'accept' | 'decline',
          action === 'accept' ? photoAccessDuration : undefined
        )
      } catch (emailError) {
        console.error('Failed to send interest response email:', emailError)
        // Don't fail the entire request if email fails
      }
    }
    
    console.log(`Interest ${action}ed: Interest ${interestId} by User ${receiverUser.id}`);
    
    return NextResponse.json({ 
      success: true,
      message: `Interest ${action}ed successfully`,
      action: action,
      ...(action === 'accept' && {
        photoAccessDuration: photoAccessDuration,
        photoAccessExpiry: updateData.photoAccessExpiryDate
      })
    }, { status: 200 })
    
  } catch (error) {
    console.error("Error responding to interest:", error)
    return NextResponse.json({ 
      error: "Failed to respond to interest" 
    }, { status: 500 })
  }
}
