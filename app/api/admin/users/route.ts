import { NextRequest, NextResponse } from "next/server"
import { db } from "@/src/db/index"
import { users } from "@/src/db/schema"
import { eq, and } from "drizzle-orm"
import { verifyAdminAuth } from "@/lib/auth"
import { sendUserNotification } from "@/lib/notifications"
// Fix: Import updateUserProfile and User type from correct source
import { updateUserProfile } from "@/lib/database"
import type { User } from "@/lib/database"

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

    // Build filters
    const filters = []
    if (status) filters.push(eq(users.profileStatus, status))
    if (subscription) filters.push(eq(users.subscription, subscription))

    // Query users with filters
    let userList = []
    if (filters.length > 0) {
      userList = await db.select().from(users).where(and(...filters)).limit(limit).offset((page - 1) * limit)
    } else {
      userList = await db.select().from(users).limit(limit).offset((page - 1) * limit)
    }

    return NextResponse.json({
      users: userList,
      pagination: {
        page,
        limit,
        total: userList.length, // Replace with real total if you add a count query
      },
    })
  } catch (error) {
    console.error("Admin get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdminAuth(request)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, action } = body as { userId: string; action: AdminAction }

    if (!userId || !action) {
      return NextResponse.json({ error: "User ID and action are required" }, { status: 400 })
    }

    let newStatus: User['profileStatus']
    switch (action) {
      case "approve":
        newStatus = "approved"
        break
      case "reject":
        newStatus = "rejected"
        break
      case "suspend":
        newStatus = "suspended"
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    await updateUserProfile(userId, { profileStatus: newStatus })

    // Send notification to user
    await sendUserNotification(userId, `Your profile has been ${action}ed`)

    return NextResponse.json({
      message: `User ${action}ed successfully`,
    })
  } catch (error) {
    console.error("Admin update user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
