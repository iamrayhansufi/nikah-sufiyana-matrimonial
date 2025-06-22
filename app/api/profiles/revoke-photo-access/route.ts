import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options-redis"
import { redis } from "@/lib/redis-client"

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
  photoAccessDuration: string;
  photoAccessExpiryDate: string;
  photoAccessGrantedAt: string;
  photoAccessRevoked: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get user session to verify authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: "You must be logged in to revoke photo access" 
      }, { status: 401 })
    }
    
    // Get the request body
    const body = await request.json()
    const { interestId } = body
    
    if (!interestId) {
      return NextResponse.json({ 
        error: "Interest ID is required" 
      }, { status: 400 })
    }
    
    // Get the current user (should be the receiver who granted access)
    const userKeys = await redis.keys("user:*")
    let currentUser: RedisUser | null = null
    
    for (const key of userKeys) {
      const user = await redis.hgetall(key) as RedisUser
      if (user && user.email === session.user.email) {
        currentUser = user
        break
      }
    }

    if (!currentUser) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 })
    }
    
    // Get the interest
    const interest = await redis.hgetall(interestId) as RedisInterest
    
    if (!interest || !interest.id) {
      return NextResponse.json({ 
        error: "Interest not found" 
      }, { status: 404 })
    }

    // Verify the current user is the receiver of this interest (the one who granted access)
    if (interest.receiverId !== currentUser.id) {
      return NextResponse.json({ 
        error: "You're not authorized to revoke this photo access" 
      }, { status: 403 })
    }
    
    // Check if interest was accepted and has photo access
    if (interest.status !== 'accepted' || !interest.photoAccessDuration) {
      return NextResponse.json({ 
        error: "No photo access to revoke for this interest" 
      }, { status: 400 })
    }

    // Check if already revoked
    if (interest.photoAccessRevoked === 'true') {
      return NextResponse.json({ 
        error: "Photo access has already been revoked" 
      }, { status: 400 })
    }
    
    // Revoke photo access
    const updateData: Record<string, string> = {
      photoAccessRevoked: 'true',
      photoAccessRevokedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await redis.hmset(interestId, updateData)
    
    // Get sender information for notification
    const senderUser = await redis.hgetall(`user:${interest.senderId}`) as RedisUser
    
    if (senderUser && senderUser.id) {
      // Create notification for the sender
      const notificationId = `notification:${Date.now()}`
      const notificationData = {
        userId: senderUser.id,
        title: 'Photo Access Revoked',
        message: `${currentUser.fullName || 'Someone'} has revoked your photo access to their profile.`,
        type: "photo_access_revoked",
        data: JSON.stringify({
          revokerName: currentUser.fullName,
          revokerId: currentUser.id,
          interestId: interestId
        }),
        read: 'false',
        createdAt: new Date().toISOString()
      }

      await redis.hmset(notificationId, notificationData)
      await redis.lpush(`notifications:${senderUser.id}`, notificationId)
    }
    
    console.log(`Photo access revoked: Interest ${interestId} by User ${currentUser.id}`);
    
    return NextResponse.json({ 
      success: true,
      message: "Photo access revoked successfully"
    }, { status: 200 })
    
  } catch (error) {
    console.error("Error revoking photo access:", error)
    return NextResponse.json({ 
      error: "Failed to revoke photo access" 
    }, { status: 500 })
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
  })
}
