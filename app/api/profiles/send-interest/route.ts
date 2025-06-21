import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options-redis"
import { redis } from "@/lib/redis-client"

interface RedisUser extends Record<string, string> {
  id: string;
  email: string;
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

export async function POST(request: NextRequest) {
  try {    // Get user session to verify authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: "You must be logged in to send interest" 
      }, { status: 401 })
    }
      // Get the request body
    const body = await request.json()
    const { profileId, message } = body
    
    if (!profileId) {
      return NextResponse.json({ 
        error: "Profile ID is required" 
      }, { status: 400 })
    }

    // Ensure profileId has the correct format
    let targetProfileId = profileId;
    if (!targetProfileId.startsWith('user:')) {
      targetProfileId = `user:${targetProfileId}`;
    }
    
    // Get the current user (sender)
    const userKeys = await redis.keys("user:*")
    let senderUser: RedisUser | null = null
    
    for (const key of userKeys) {
      const user = await redis.hgetall(key) as RedisUser
      if (user && user.email === session.user.email) {
        senderUser = user
        break
      }
    }

    if (!senderUser) {
      return NextResponse.json({ 
        error: "Sender user not found" 
      }, { status: 404 })
    }    // Get the target user (receiver)
    const targetUser = await redis.hgetall(targetProfileId) as RedisUser
    if (!targetUser) {
      return NextResponse.json({ 
        error: "Target user not found" 
      }, { status: 404 })
    }    // Check if sender has basic required profile information
    if (!senderUser.fullName || !senderUser.age || !senderUser.gender) {
      return NextResponse.json({ 
        error: "Please complete your profile before sending interest" 
      }, { status: 403 })
    }

    // Check for existing interest
    const interestKeys = await redis.keys(`interest:*`)
    for (const key of interestKeys) {
      const interest = await redis.hgetall(key) as RedisInterest
      if (interest && 
          interest.senderId === senderUser.id && 
          interest.receiverId === targetUser.id &&
          interest.status !== 'declined') {
        return NextResponse.json({ 
          error: "You have already sent interest to this profile" 
        }, { status: 400 })
      }
    }

    // Create new interest
    const interestId = `interest:${Date.now()}`
    const interestData: Record<string, string> = {
      id: interestId,
      senderId: senderUser.id,
      receiverId: targetUser.id,
      status: 'pending',
      message: message || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await redis.hmset(interestId, interestData)

    // Add interest to lists for both users
    await redis.lpush(`sent_interests:${senderUser.id}`, interestId)
    await redis.lpush(`received_interests:${targetUser.id}`, interestId)

    // Create notification for receiver
    const notificationId = `notification:${Date.now()}`
    const notificationData = {
      userId: targetUser.id,
      title: 'New Interest Received',
      message: `${senderUser.fullName || 'Someone'} has shown interest in your profile!`,
      type: 'interest_received',
      data: JSON.stringify({
        interestId,
        senderId: senderUser.id,
        senderName: senderUser.fullName || 'Anonymous',
        message: message || ''
      }),
      read: 'false',
      createdAt: new Date().toISOString()
    }

    await redis.hmset(notificationId, notificationData)
    await redis.lpush(`notifications:${targetUser.id}`, notificationId)

    return NextResponse.json({
      message: "Interest sent successfully",
      data: {
        interestId,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error("Error sending interest:", error)
    return NextResponse.json(
      { error: "Failed to send interest" },
      { status: 500 }
    )
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
