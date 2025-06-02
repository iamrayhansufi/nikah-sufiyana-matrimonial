import { connectToDatabase, getUsers, type User } from "./database"

export interface UserReportEntry {
  name: string
  email: string
  phone: string
  age: number
  location: string
  education: string
  profession: string
  subscription: string
  status: string
  joinedDate: string
}

export interface RevenueReportEntry {
  month: string
  revenue: number
  subscriptions: number
}

export interface ActivityReportEntry {
  dailyRegistrations: Array<{
    date: string
    registrations: number
  }>
  statusBreakdown: Array<{
    status: string
    count: number
  }>
}

export async function generateUserReport(startDate?: string, endDate?: string): Promise<UserReportEntry[]> {
  await connectToDatabase()

  const dateFilter: Record<string, Date> = {}
  if (startDate) dateFilter.$gte = new Date(startDate)
  if (endDate) dateFilter.$lte = new Date(endDate)

  const users = await getUsers(
    Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {},
    1,
    1000
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

export async function generateRevenueReport(startDate?: string, endDate?: string): Promise<RevenueReportEntry[]> {
  // For now, return static data
  // TODO: Implement actual revenue calculation from database
  return [
    { month: "January 2024", revenue: 245000, subscriptions: 312 },
    { month: "February 2024", revenue: 267000, subscriptions: 345 },
    { month: "March 2024", revenue: 289000, subscriptions: 378 },
  ]
}

export async function generateActivityReport(startDate?: string, endDate?: string): Promise<ActivityReportEntry> {
  await connectToDatabase()

  const dateFilter: Record<string, Date> = {}
  if (startDate) dateFilter.$gte = new Date(startDate)
  if (endDate) dateFilter.$lte = new Date(endDate)

  const users = await getUsers(
    Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {},
    1,
    1000
  )

  // Process daily registrations
  const dailyRegistrations = users.reduce((acc: Record<string, number>, user) => {
    const date = user.createdAt.toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  // Process status breakdown
  const statusBreakdown = users.reduce((acc: Record<string, number>, user) => {
    acc[user.profileStatus] = (acc[user.profileStatus] || 0) + 1
    return acc
  }, {})

  return {
    dailyRegistrations: Object.entries(dailyRegistrations).map(([date, count]) => ({
      date,
      registrations: count,
    })),
    statusBreakdown: Object.entries(statusBreakdown).map(([status, count]) => ({
      status,
      count,
    })),
  }
}
