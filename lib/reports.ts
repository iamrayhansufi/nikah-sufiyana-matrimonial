import { connectToDatabase, User } from "./database"

export async function generateUserReport(startDate?: string, endDate?: string) {
  await connectToDatabase()

  const dateFilter: any = {}
  if (startDate) dateFilter.$gte = new Date(startDate)
  if (endDate) dateFilter.$lte = new Date(endDate)

  const users = await User.find(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}).select(
    "fullName email phone age location education profession subscription profileStatus createdAt",
  )

  return users.map((user) => ({
    name: user.fullName,
    email: user.email,
    phone: user.phone,
    age: user.age,
    location: user.location,
    education: user.education,
    profession: user.profession,
    subscription: user.subscription,
    status: user.profileStatus,
    joinedDate: user.createdAt.toISOString().split("T")[0],
  }))
}

export async function generateRevenueReport(startDate?: string, endDate?: string) {
  // This would integrate with payment data
  // For now, return sample data
  return [
    { month: "January 2024", revenue: 245000, subscriptions: 320 },
    { month: "February 2024", revenue: 267000, subscriptions: 345 },
    { month: "March 2024", revenue: 289000, subscriptions: 378 },
  ]
}

export async function generateActivityReport(startDate?: string, endDate?: string) {
  await connectToDatabase()

  const dateFilter: any = {}
  if (startDate) dateFilter.$gte = new Date(startDate)
  if (endDate) dateFilter.$lte = new Date(endDate)

  const dailyRegistrations = await User.aggregate([
    { $match: Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {} },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  const statusBreakdown = await User.aggregate([
    {
      $group: {
        _id: "$profileStatus",
        count: { $sum: 1 },
      },
    },
  ])

  return {
    dailyRegistrations: dailyRegistrations.map((item) => ({
      date: item._id,
      registrations: item.count,
    })),
    statusBreakdown: statusBreakdown.map((item) => ({
      status: item._id,
      count: item.count,
    })),
  }
}
