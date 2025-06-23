import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options-redis"
import { redis } from "@/lib/redis-client"

interface RedisUser extends Record<string, string> {
  id: string;
  email: string;
  fullName: string;
  age: string;
  location: string;
  profession: string;
  profilePhoto: string;
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

export async function GET(request: NextRequest) {
  try {
    // Get user session to verify authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    const currentUserId = session.user.id
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'sent', 'received', or null (all)
    const profileId = searchParams.get('profileId') // specific profile interests
    
    // Get all interests from Redis
    const interestKeys = await redis.keys("interest:*")
    const interestPromises = interestKeys.map(async key => {
      const interest = await redis.hgetall(key)
      return interest && Object.keys(interest).length > 0 ? interest as RedisInterest : null
    })
    
    const interestResults = await Promise.all(interestPromises)
    const allInterests = interestResults.filter((i): i is RedisInterest => i !== null)
    
    let filteredInterests: RedisInterest[] = []
    
    if (profileId) {
      // Return interests for a specific profile (both sent and received)
      const sentInterests = allInterests.filter(i => 
        i.senderId === currentUserId && i.receiverId === profileId
      )
      const receivedInterests = allInterests.filter(i => 
        i.senderId === profileId && i.receiverId === currentUserId
      )
      
      return NextResponse.json({
        sentInterests,
        receivedInterests
      })
    }
    
    // Filter based on type
    if (type === 'sent') {
      filteredInterests = allInterests.filter(i => i.senderId === currentUserId)
    } else if (type === 'received') {
      filteredInterests = allInterests.filter(i => i.receiverId === currentUserId)
    } else {
      // Return all interests for the current user
      filteredInterests = allInterests.filter(i => 
        i.senderId === currentUserId || i.receiverId === currentUserId
      )
    }
    
    // Get user details for each interest
    const interestsWithUserDetails = await Promise.all(
      filteredInterests.map(async (interest) => {
        // Determine which user's details to fetch
        const otherUserId = interest.senderId === currentUserId ? interest.receiverId : interest.senderId
        
        try {
          const userKey = `user:${otherUserId}`
          const userData = await redis.hgetall(userKey)
          
          if (!userData || Object.keys(userData).length === 0) {
            return null
          }
          
          const user = userData as RedisUser
          
          return {
            id: parseInt(interest.id),
            fromUserId: parseInt(interest.senderId),
            toUserId: parseInt(interest.receiverId),
            status: interest.status as "pending" | "accepted" | "declined",
            createdAt: interest.createdAt,
            message: interest.message || '',
            fromUser: {
              id: parseInt(user.id),
              fullName: user.fullName || user.email || 'Unknown User',
              age: parseInt(user.age || '0'),
              location: user.location || 'Not specified',
              profession: user.profession || 'Not specified',
              profilePhoto: user.profilePhoto || null
            }
          }
        } catch (error) {
          console.error(`Error fetching user details for ${otherUserId}:`, error)
          return null
        }
      })
    )
    
    // Filter out null results
    const validInterests = interestsWithUserDetails.filter(interest => interest !== null)
    
    return NextResponse.json(validInterests)
    
  } catch (error) {
    console.error("Error fetching interests:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
