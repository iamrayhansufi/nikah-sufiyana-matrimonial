import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/auth"

interface RecentRegistration {
  id: string
  name: string
  email: string
  date: string
}

interface TopActiveUser {
  id: string
  name: string
  profileViews: number
  interests: number
  lastActive: string
}

interface MonthlyRevenue {
  month: string
  revenue: number
  subscriptions: number
}

interface SubscriptionBreakdown {
  free: number
  premium: number
  vip: number
}

interface AdminStats {
  totalRegistrations: number
  activeSubscriptions: number
  pendingApprovals: number
  totalRevenue: number
  monthlyGrowth: number
  successfulMatches: number
  recentRegistrations: RecentRegistration[]
  topActiveUsers: TopActiveUser[]
  subscriptionBreakdown: SubscriptionBreakdown
  revenueByMonth: MonthlyRevenue[]
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdminAuth(request)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get various statistics
    const stats: AdminStats = {
      totalRegistrations: await getTotalUsers(),
      activeSubscriptions: await getActiveSubscriptions(),
      pendingApprovals: await getPendingApprovals(),
      totalRevenue: await getTotalRevenue(),
      monthlyGrowth: await getMonthlyGrowth(),
      successfulMatches: await getSuccessfulMatches(),
      recentRegistrations: await getRecentRegistrations(),
      topActiveUsers: await getTopActiveUsers(),
      subscriptionBreakdown: await getSubscriptionBreakdown(),
      revenueByMonth: await getRevenueByMonth(),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal server error" 
    }, { status: 500 })
  }
}

// Helper functions for statistics
async function getTotalUsers(): Promise<number> {
  return 15420 // Placeholder
}

async function getActiveSubscriptions(): Promise<number> {
  return 3240 // Placeholder
}

async function getPendingApprovals(): Promise<number> {
  return 156 // Placeholder
}

async function getTotalRevenue(): Promise<number> {
  return 2450000 // Placeholder
}

async function getMonthlyGrowth(): Promise<number> {
  return 12.5 // Placeholder
}

async function getSuccessfulMatches(): Promise<number> {
  return 1250 // Placeholder
}

async function getRecentRegistrations(): Promise<RecentRegistration[]> {
  return [] // Placeholder
}

async function getTopActiveUsers(): Promise<TopActiveUser[]> {
  return [] // Placeholder
}

async function getSubscriptionBreakdown(): Promise<SubscriptionBreakdown> {
  return {
    free: 12180,
    premium: 2640,
    vip: 600,
  }
}

async function getRevenueByMonth(): Promise<MonthlyRevenue[]> {
  return [] // Placeholder
}
