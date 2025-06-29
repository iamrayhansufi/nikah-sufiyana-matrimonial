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
  try {    
    // Get user session to verify authentication
    const session = await getServerSession(authOptions)
    
    console.log('🚀 Send Interest API called', {
      hasSession: !!session,
      userEmail: session?.user?.email,
      userId: session?.user?.id
    })
    
    if (!session?.user?.email) {
      console.log('❌ Authentication failed - no session or email')
      return NextResponse.json({ 
        error: "You must be logged in to send interest" 
      }, { status: 401 })
    }
      
    // Get the request body
    const body = await request.json()
    const { profileId, message } = body
    
    console.log('📝 Request body:', { profileId, message, bodyKeys: Object.keys(body) })
    
    if (!profileId) {
      console.log('❌ No profileId provided')
      return NextResponse.json({ 
        error: "Profile ID is required" 
      }, { status: 400 })
    }

    // Ensure profileId has the correct format
    let targetProfileId = profileId;
    if (!targetProfileId.startsWith('user:')) {
      targetProfileId = `user:${targetProfileId}`;
    }
    
    console.log('🎯 Target profile ID:', targetProfileId)
    console.log('🎯 Original profile ID:', profileId)

    // Get the current user (sender)
    const userKeys = await redis.keys("user:*")
    let senderUser: RedisUser | null = null
    
    console.log(`🔍 Searching through ${userKeys.length} users for sender`);
    
    for (const key of userKeys) {
      const user = await redis.hgetall(key) as RedisUser
      if (user && user.email === session.user.email) {
        senderUser = user
        console.log('✅ Found sender user:', key)
        break
      }
    }

    console.log('👤 Sender user:', {
      found: !!senderUser,
      id: senderUser?.id,
      email: senderUser?.email,
      fullName: senderUser?.fullName,
      hasAge: !!senderUser?.age,
      hasGender: !!senderUser?.gender
    })

    if (!senderUser) {
      console.log('❌ Sender user not found')
      return NextResponse.json({ 
        error: "Sender user not found" 
      }, { status: 404 })
    }

    // Get the target user (receiver) - Try multiple lookup strategies
    let targetUser = null as RedisUser | null
    let finalTargetProfileId = ''
    
    // Strategy 1: Try with user: prefix
    console.log('🔍 Strategy 1: Trying with user: prefix')
    targetUser = await redis.hgetall(targetProfileId) as RedisUser
    
    if (targetUser && targetUser.id) {
      finalTargetProfileId = targetProfileId
      console.log('✅ Found with Strategy 1')
    } else {
      // Strategy 2: Search through all users to find matching ID
      console.log('🔍 Strategy 2: Searching through all users for matching ID')
      
      for (const key of userKeys) {
        const user = await redis.hgetall(key) as RedisUser
        if (user && user.id) {
          // Check if the user ID (with or without prefix) matches our target
          const cleanUserId = user.id.replace('user:', '')
          const cleanProfileId = profileId.replace('user:', '')
          
          if (cleanUserId === cleanProfileId || user.id === profileId || key.replace('user:', '') === cleanProfileId) {
            targetUser = user
            finalTargetProfileId = key
            console.log('✅ Found with Strategy 2:', key)
            break
          }
        }
      }
    }
    
    console.log('🎯 Target user lookup result:', {
      finalTargetProfileId,
      originalId: profileId,
      found: !!targetUser,
      id: targetUser?.id,
      email: targetUser?.email,
      fullName: targetUser?.fullName,
      hasRequiredFields: !!(targetUser?.id && targetUser?.email)
    })
    
    if (!targetUser || !targetUser.id) {
      console.log('❌ Target user not found after all strategies for ID:', profileId)
      
      // List available user IDs for debugging
      console.log('🔍 Available user keys for debugging:')
      for (const key of userKeys.slice(0, 5)) {
        const user = await redis.hgetall(key) as RedisUser
        console.log(`  - Key: ${key}, User ID: ${user?.id}, Name: ${user?.fullName}`)
      }
      
      return NextResponse.json({ 
        error: "Target user not found",
        details: `Profile ID ${profileId} does not match any user in the system`
      }, { status: 404 })
    }

    // Check if sender has basic required profile information
    const requiredFields = ['fullName', 'age', 'gender'];
    const missingFields = requiredFields.filter(field => !senderUser[field]);
    
    if (missingFields.length > 0) {
      console.log('❌ Sender profile incomplete:', {
        missingFields,
        hasFullName: !!senderUser.fullName,
        hasAge: !!senderUser.age,
        hasGender: !!senderUser.gender
      })
      return NextResponse.json({ 
        error: "Please complete your profile before sending interest. Missing: " + missingFields.join(', ')
      }, { status: 403 })
    }

    // More efficient check for existing interest using a Redis Set
    const interestSetKey = 'interests:sent';
    const interestPair = `${senderUser.id}:${targetUser.id}`;

    console.log(`🔍 Checking for existing interest with key: ${interestSetKey} and pair: ${interestPair}`);

    const isMember = await redis.sismember(interestSetKey, interestPair);

    if (isMember) {
      console.log('❌ Existing interest found (using Set)');
      return NextResponse.json({ 
        error: "You have already sent interest to this profile" 
      }, { status: 400 })
    }

    console.log('✅ All validations passed, creating interest...')

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

    // Add to the unique interest set for efficient checking
    await redis.sadd(interestSetKey, interestPair);

    // Add interest to lists for both users    
    await redis.lpush(`sent_interests:${senderUser.id}`, interestId)
    await redis.lpush(`received_interests:${targetUser.id}`, interestId)
    
    console.log('✅ Interest created successfully:', interestId)
    
    // Check for mutual interest using a more efficient method
    const mutualInterestCheckKey = `mutual_check:${targetUser.id}:${senderUser.id}`;
    const mutualInterestId = await redis.get(mutualInterestCheckKey);
    let isMutual = false;

    if (mutualInterestId && typeof mutualInterestId === 'string') {
      console.log('🎉 Mutual interest detected!', { mutualInterestId });
      isMutual = true;

      // Update both interests to accepted status using the correct hset syntax
      await redis.hset(interestId, { status: 'accepted', updatedAt: new Date().toISOString() });
      await redis.hset(mutualInterestId, { status: 'accepted', updatedAt: new Date().toISOString() });

      // Clean up the check key
      await redis.del(mutualInterestCheckKey);
    } else {
      // No mutual interest yet, so store this interest for a future mutual check
      const newMutualCheckKey = `mutual_check:${senderUser.id}:${targetUser.id}`;
      // Set with an expiration to prevent stale keys, e.g., 30 days
      await redis.set(newMutualCheckKey, interestId, { ex: 2592000 }); 
    }
    
    console.log('📧 Sending notification and email...')

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

    // Send email notification to receiver
    try {
      const { sendInterestReceivedEmail } = await import('@/lib/email-service')
      await sendInterestReceivedEmail(
        targetUser.email,
        targetUser.fullName || 'User',
        senderUser.fullName || 'Someone'
      )
      console.log('✅ Email notification sent')
    } catch (emailError) {
      console.error('❌ Failed to send interest received email:', emailError)
      // Don't fail the entire request if email fails
    }

    console.log('🎉 Interest sent successfully!')

    return NextResponse.json({
      message: "Interest sent successfully",
      isMutual: isMutual,
      data: {
        interestId,
        status: isMutual ? 'accepted' : 'pending',
        createdAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error("❌ Error sending interest:", error)
    
    // Provide more specific error messages based on error type
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      )
    }
    
    if (error instanceof Error && error.message.includes('Redis')) {
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 503 }
      )
    }
    
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
