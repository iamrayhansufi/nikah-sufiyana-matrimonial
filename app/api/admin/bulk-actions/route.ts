import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/auth"
import { bulkUpdateUsers, sendBulkNotifications } from "@/lib/admin-operations"
import { AdminUser } from "@/lib/database"

type BulkAction = "approve" | "reject" | "suspend" | "send_email" | "send_sms"

interface NotificationData {
  subject?: string
  message: string
}

interface BulkActionRequest {
  action: BulkAction
  userIds: string[]
  data?: NotificationData
}

interface BulkActionResult {
  affected: number
  success: boolean
  error?: string
  failed?: number
}

export async function POST(request: NextRequest) {
  try {
    const adminUser = (await verifyAdminAuth(request)) as AdminUser | false
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, userIds, data } = body as BulkActionRequest

    if (!action || !userIds || !Array.isArray(userIds)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    // Validate notification data
    if ((action === "send_email" || action === "send_sms") && (!data || !data.message)) {
      return NextResponse.json({ error: "Message is required for notifications" }, { status: 400 })
    }

    if (action === "send_email" && !data?.subject) {
      return NextResponse.json({ error: "Subject is required for email notifications" }, { status: 400 })
    }

    let result: BulkActionResult

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
          subject: data!.subject,
          message: data!.message,
        })
        break
      case "send_sms":
        result = await sendBulkNotifications(userIds, {
          type: "sms",
          message: data!.message,
        })
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      message: `Bulk ${action} completed successfully`,
      affected: result.affected,
      failed: result.failed ?? 0,
    })
  } catch (error) {
    console.error("Bulk action API error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal server error" 
    }, { status: 500 })
  }
}
