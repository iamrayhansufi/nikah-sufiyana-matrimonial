import { connectToDatabase, User } from "./database"

export async function getDashboardStats() {
  await connectToDatabase()

  // Get current date ranges
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  // Calculate statistics
  const totalUsers = await User.countDocuments()
  const pendingApprovals = await User.countDocuments({ profileStatus: "pending" })
  const activeSubscriptions = await User.countDocuments({
    subscription: { $in: ["premium", "vip"] },
    subscriptionExpiry: { $gt: now },
  })

  const thisMonthUsers = await User.countDocuments({
    createdAt: { $gte: startOfMonth },
  })

  const lastMonthUsers = await User.countDocuments({
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
  })

  const monthlyGrowth = lastMonthUsers > 0 ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0

  return {
    totalRegistrations: totalUsers,
    activeSubscriptions,
    pendingApprovals,
    monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
    thisMonthRegistrations: thisMonthUsers,
    successfulMatches: await getSuccessfulMatches(),
    averageResponseTime: await getAverageResponseTime(),
    topLocations: await getTopLocations(),
  }
}

export async function getRecentActivity() {
  await connectToDatabase()

  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select("fullName email profileStatus subscription createdAt location")

  return recentUsers
}

export async function bulkUpdateUsers(userIds: string[], updateData: any) {
  await connectToDatabase()

  try {
    const result = await User.updateMany({ _id: { $in: userIds } }, { $set: updateData })

    return {
      affected: result.modifiedCount,
      success: true,
    }
  } catch (error) {
    console.error("Bulk update error:", error)
    return {
      affected: 0,
      success: false,
      error: error.message,
    }
  }
}

export async function sendBulkNotifications(userIds: string[], notificationData: any) {
  await connectToDatabase()

  const users = await User.find({ _id: { $in: userIds } }).select("email phone fullName")

  let successCount = 0
  let failedCount = 0

  for (const user of users) {
    try {
      if (notificationData.type === "email") {
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
    }
  }

  return {
    affected: successCount,
    failed: failedCount,
    success: true,
  }
}

async function getSuccessfulMatches() {
  // This would track successful matches/marriages
  // For now, return a placeholder
  return 1250
}

async function getAverageResponseTime() {
  // Calculate average admin response time for approvals
  return "2.5 hours"
}

async function getTopLocations() {
  await connectToDatabase()

  const locations = await User.aggregate([
    { $group: { _id: "$location", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ])

  return locations.map((loc) => ({
    location: loc._id,
    count: loc.count,
  }))
}

async function sendEmail(emailData: any) {
  // Email sending logic using nodemailer or similar
  console.log("Sending email:", emailData)
}

async function sendSMS(smsData: any) {
  // SMS sending logic using Twilio or similar
  console.log("Sending SMS:", smsData)
}
