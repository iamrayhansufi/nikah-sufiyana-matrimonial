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
  photoAccessDuration: string;
  photoAccessExpiryDate: string;
  photoAccessGrantedAt: string;
  photoAccessRevoked: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get user session to verify authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: "You must be logged in to check photo access" 
      }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId')
    
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
    
    // Get the current user (viewer)
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

    // Get target user
    const targetUser = await redis.hgetall(targetProfileId) as RedisUser
    if (!targetUser || !targetUser.id) {
      return NextResponse.json({ 
        error: "Target profile not found" 
      }, { status: 404 })
    }
    
    // Find interest where current user sent interest to target user and it was accepted
    const interestKeys = await redis.keys(`interest:*`)
    let relevantInterest: RedisInterest | null = null
    
    for (const key of interestKeys) {
      const interest = await redis.hgetall(key) as RedisInterest
      if (interest && 
          interest.senderId === currentUser.id && 
          interest.receiverId === targetUser.id &&
          interest.status === 'accepted') {
        relevantInterest = interest
        break
      }
    }

    if (!relevantInterest) {
      return NextResponse.json({ 
        hasPhotoAccess: false,
        reason: "No accepted interest found"
      })
    }

    // Check if photo access was revoked
    if (relevantInterest.photoAccessRevoked === 'true') {
      return NextResponse.json({ 
        hasPhotoAccess: false,
        reason: "Photo access was revoked",
        revokedAt: relevantInterest.photoAccessRevokedAt
      })
    }

    // Check if photo access has expired
    if (relevantInterest.photoAccessExpiryDate) {
      const expiryDate = new Date(relevantInterest.photoAccessExpiryDate)
      const now = new Date()
      
      if (now > expiryDate && relevantInterest.photoAccessDuration !== 'permanent') {
        return NextResponse.json({ 
          hasPhotoAccess: false,
          reason: "Photo access has expired",
          expiryDate: relevantInterest.photoAccessExpiryDate
        })
      }
    }

    // Calculate remaining time
    let remainingTime = null;
    if (relevantInterest.photoAccessExpiryDate && relevantInterest.photoAccessDuration !== 'permanent') {
      const expiryDate = new Date(relevantInterest.photoAccessExpiryDate);
      const now = new Date();
      const timeDiff = expiryDate.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        remainingTime = { days, hours, totalMs: timeDiff };
      }
    }
    
    return NextResponse.json({ 
      hasPhotoAccess: true,
      duration: relevantInterest.photoAccessDuration,
      grantedAt: relevantInterest.photoAccessGrantedAt,
      expiryDate: relevantInterest.photoAccessExpiryDate,
      remainingTime,
      isPermanent: relevantInterest.photoAccessDuration === 'permanent'
    })
    
  } catch (error) {
    console.error("Error checking photo access:", error)
    return NextResponse.json({ 
      error: "Failed to check photo access" 
    }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
