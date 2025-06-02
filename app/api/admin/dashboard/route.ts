import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/auth"
import { getDashboardStats, getRecentActivity } from "@/lib/admin-operations"

export async function GET(request: NextRequest) {
  try {
    const adminUser = await verifyAdminAuth(request)
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await getDashboardStats()
    const recentActivity = await getRecentActivity()

    return NextResponse.json({
      stats,
      recentActivity,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
