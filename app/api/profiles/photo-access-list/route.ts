import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options-redis"
import { redis } from "@/lib/redis-client"

interface RedisUser extends Record<string, string> {
  id: string;
  email: string;
  fullName: string;
  profilePhoto: string;
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
        error: "You must be logged in to view photo access list" 
      }, { status: 401 })
    }
    
    // Get the current user
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
    
    // Find all interests where current user is receiver and interest is accepted with photo access
    const interestKeys = await redis.keys(`interest:*`)
    const photoAccessList = []
    
    for (const key of interestKeys) {
      const interest = await redis.hgetall(key) as RedisInterest
      
      if (interest && 
          interest.receiverId === currentUser.id && 
          interest.status === 'accepted' && 
          interest.photoAccessDuration &&
          interest.photoAccessRevoked !== 'true') {
        
        // Get sender information
        const senderUser = await redis.hgetall(`user:${interest.senderId}`) as RedisUser
        
        if (senderUser && senderUser.id) {
          // Check if access has expired (but not revoked)
          let isExpired = false;
          let remainingTime = null;
          
          if (interest.photoAccessExpiryDate && interest.photoAccessDuration !== 'permanent') {
            const expiryDate = new Date(interest.photoAccessExpiryDate);
            const now = new Date();
            const timeDiff = expiryDate.getTime() - now.getTime();
            
            if (timeDiff <= 0) {
              isExpired = true;
            } else {
              const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
              const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              remainingTime = { days, hours, totalMs: timeDiff };
            }
          }
          
          // Only include active (non-expired) access
          if (!isExpired) {
            photoAccessList.push({
              interestId: interest.id,
              senderId: interest.senderId,
              senderName: senderUser.fullName || 'Unknown User',
              senderPhoto: senderUser.profilePhoto || '',
              duration: interest.photoAccessDuration,
              grantedAt: interest.photoAccessGrantedAt,
              expiryDate: interest.photoAccessExpiryDate,
              isPermanent: interest.photoAccessDuration === 'permanent',
              remainingTime
            });
          }
        }
      }
    }
    
    // Sort by granted date (newest first)
    photoAccessList.sort((a, b) => 
      new Date(b.grantedAt).getTime() - new Date(a.grantedAt).getTime()
    );
    
    return NextResponse.json({ 
      photoAccessList,
      total: photoAccessList.length
    })
    
  } catch (error) {
    console.error("Error fetching photo access list:", error)
    return NextResponse.json({ 
      error: "Failed to fetch photo access list" 
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
