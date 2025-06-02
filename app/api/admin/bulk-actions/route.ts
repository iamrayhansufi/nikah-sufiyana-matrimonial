import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/auth"
import { bulkUpdateUsers, sendBulkNotifications } from "@/lib/admin-operations"

export async function POST(request: NextRequest) {
  try {
    const adminUser = await verifyAdminAuth(request)
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, userIds, data } = body

    if (!action || !userIds || !Array.isArray(userIds)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    let result
    switch (action) {
      case "approve":
        result = await bulkUpdateUsers(userIds, {
          profileStatus: "approved",
          approvedAt: new Date(),
          approvedBy: adminUser.id,
        })
        break
      case "reject":
        result = await bulkUpdateUsers(userIds, {
          profileStatus: "rejected",
          rejectedAt: new Date(),
          rejectedBy: adminUser.id,
        })
        break
      case "suspend":
        result = await bulkUpdateUsers(userIds, {
          profileStatus: "suspended",
          suspendedAt: new Date(),
          suspendedBy: adminUser.id,
        })
        break
      case "send_email":
        result = await sendBulkNotifications(userIds, {
          type: "email",
          subject: data.subject,
          message: data.message,
          sentBy: adminUser.id,
        })
        break
      case "send_sms":
        result = await sendBulkNotifications(userIds, {
          type: "sms",
          message: data.message,
          sentBy: adminUser.id,
        })
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      message: `Bulk ${action} completed successfully`,
      affected: result.affected,
      failed: result.failed || 0,
    })
  } catch (error) {
    console.error("Bulk action API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
