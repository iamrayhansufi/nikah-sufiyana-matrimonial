import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis-client"
import { verifyAdminAuth } from "@/lib/auth"
import { sendVerificationEmail, sendProfileApprovalEmail } from "@/lib/notifications"

interface RedisUser extends Record<string, string> {
  id: string;
  email: string;
}

type AdminUserFilters = {
  profileStatus?: "pending" | "approved" | "rejected" | "suspended"
  subscription?: "free" | "premium" | "vip"
}

type AdminAction = "approve" | "reject" | "suspend"

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdminAuth(request)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const subscription = searchParams.get("subscription")

    // Get all user keys
    const userKeys = await redis.keys("user:*")
    const users: RedisUser[] = []

    // Fetch all users
    for (const key of userKeys) {
      const user = await redis.hgetall(key) as RedisUser
      if (user) {
        // Apply filters
        const statusMatch = !status || user.profileStatus === status
        const subscriptionMatch = !subscription || user.subscription === subscription

        if (statusMatch && subscriptionMatch) {
          users.push(user)
        }
      }
    }

    // Sort by creation date if available, else by email
    users.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      if (dateA !== dateB) return dateB - dateA
      return (a.email || '').localeCompare(b.email || '')
    })

    // Apply pagination
    const start = (page - 1) * limit
    const paginatedUsers = users.slice(start, start + limit)

    return NextResponse.json({
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: users.length
      }
    })

  } catch (error) {
    console.error('Admin users fetch error:', error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdminAuth(request)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, action, reason } = body

    if (!userId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get user from Redis
    const userKey = `user:${userId}`
    const user = await redis.hgetall(userKey) as RedisUser
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Update user status based on action
    let newStatus: string
    let notificationTitle: string
    let notificationMessage: string

    switch (action) {
      case 'approve':
        newStatus = 'approved'
        notificationTitle = 'Profile Approved'
        notificationMessage = 'Your profile has been approved by our admin team.'
        // Send approval email
        await sendProfileApprovalEmail(user.email, user.fullName || user.email, true)
        break
      case 'reject':
        newStatus = 'rejected'
        notificationTitle = 'Profile Rejected'
        notificationMessage = reason || 'Your profile has been rejected by our admin team.'
        // Send rejection email
        await sendProfileApprovalEmail(user.email, user.fullName || user.email, false)
        break
      case 'suspend':
        newStatus = 'suspended'
        notificationTitle = 'Profile Suspended'
        notificationMessage = reason || 'Your profile has been suspended by our admin team.'
        // No email for suspension to prevent potential abuse
        break
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }

    // Update user status in Redis
    await redis.hmset(userKey, {
      profileStatus: newStatus,
      statusUpdatedAt: new Date().toISOString(),
      statusReason: reason || ''
    })

    // Store notification in Redis
    const notificationId = `notification:${Date.now()}`
    await redis.hmset(notificationId, {
      userId,
      title: notificationTitle,
      message: notificationMessage,
      type: 'admin',
      data: JSON.stringify({ action, reason }),
      createdAt: new Date().toISOString(),
      read: 'false'
    })

    // Add notification to user's notification list
    const userNotificationsKey = `notifications:${userId}`
    await redis.lpush(userNotificationsKey, notificationId)

    return NextResponse.json({
      message: `User status updated to ${newStatus}`,
      user: {
        ...user,
        profileStatus: newStatus
      }
    })

  } catch (error) {
    console.error('Admin user update error:', error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
