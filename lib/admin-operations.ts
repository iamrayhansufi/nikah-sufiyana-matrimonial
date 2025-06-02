import { connectToDatabase, type User, getUserStats, getUsers as getDatabaseUsers, getUserById, updateUserProfile } from "./database"

export async function getDashboardStats() {
  await connectToDatabase()

  // Get current date ranges
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const stats = await getUserStats()
  
  // Get users for this month and last month
  const thisMonthUsers = await getDatabaseUsers(
    { createdAt: { $gte: startOfMonth } },
    1,
    1000
  )

  const lastMonthUsers = await getDatabaseUsers(
    { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } },
    1,
    1000
  )

  const monthlyGrowth = lastMonthUsers.length > 0 
    ? ((thisMonthUsers.length - lastMonthUsers.length) / lastMonthUsers.length) * 100 
    : 0

  return {
    totalRegistrations: stats.total,
    activeSubscriptions: stats.premium,
    pendingApprovals: stats.pending,
    monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
    thisMonthRegistrations: thisMonthUsers.length,
    successfulMatches: await getSuccessfulMatches(),
    averageResponseTime: await getAverageResponseTime(),
    topLocations: await getTopLocations(),
  }
}

export async function getRecentActivity() {
  await connectToDatabase()
  return await getDatabaseUsers({}, 1, 10)
}

export async function bulkUpdateUsers(userIds: string[], updateData: Partial<User>) {
  await connectToDatabase()

  try {
    const updatedUsers = await Promise.all(
      userIds.map(id => updateUserProfile(id, updateData))
    )

    return {
      affected: updatedUsers.filter(Boolean).length,
      success: true,
    }
  } catch (error) {
    console.error("Bulk update error:", error)
    return {
      affected: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

type NotificationType = "email" | "sms"

interface NotificationData {
  type: NotificationType
  subject?: string
  message: string
}

interface BulkNotificationResult {
  affected: number
  failed: number
  success: boolean
  errors?: Array<{
    userId: string
    error: string
  }>
}

export async function sendBulkNotifications(
  userIds: string[],
  notificationData: NotificationData
): Promise<BulkNotificationResult> {
  await connectToDatabase()

  const users = await Promise.all(userIds.map(id => getUserById(id)))
  const validUsers = users.filter((user): user is User => user !== null)

  let successCount = 0
  let failedCount = 0
  const errors: Array<{ userId: string; error: string }> = []

  for (const user of validUsers) {
    try {
      if (notificationData.type === "email") {
        if (!notificationData.subject) {
          throw new Error("Email subject is required")
        }
        await sendEmail({
          to: user.email,
          subject: notificationData.subject,
          message: notificationData.message,
          userName: user.fullName,
        })
      } else if (notificationData.type === "sms") {
        await sendSMS({
          to: user.phone,
          message: notificationData.message,
          userName: user.fullName,
        })
      }
      successCount++
    } catch (error) {
      console.error(`Failed to send notification to ${user.email}:`, error)
      failedCount++
      errors.push({
        userId: user.id,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    }
  }

  return {
    affected: successCount,
    failed: failedCount,
    success: failedCount === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

// Helper functions (implement these based on your requirements)
async function getSuccessfulMatches(): Promise<number> {
  return 0 // Implement based on your matching system
}

async function getAverageResponseTime(): Promise<number> {
  return 0 // Implement based on your messaging system
}

async function getTopLocations(): Promise<Array<{ location: string, count: number }>> {
  return [] // Implement based on your user data
}

interface EmailParams {
  to: string
  subject: string
  message: string
  userName: string
}

interface SMSParams {
  to: string
  message: string
  userName: string
}

async function sendEmail(params: EmailParams): Promise<void> {
  // Implement email sending logic
  console.log('Sending email:', params)
}

async function sendSMS(params: SMSParams): Promise<void> {
  // Implement SMS sending logic
  console.log('Sending SMS:', params)
}
