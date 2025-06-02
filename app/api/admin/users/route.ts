import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/auth"
import { getUsers, getUserStats, updateUserProfile, type User } from "@/lib/database"
import { sendUserNotification } from "@/lib/notifications"

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
    const status = searchParams.get("status") as AdminUserFilters["profileStatus"]
    const subscription = searchParams.get("subscription") as AdminUserFilters["subscription"]

    const filters: AdminUserFilters = {}
    if (status) filters.profileStatus = status
    if (subscription) filters.subscription = subscription

    const users = await getUsers(filters, page, limit)
    const stats = await getUserStats()

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: stats.total,
        pages: Math.ceil(stats.total / limit),
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
