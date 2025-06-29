import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/auth"
import { redis } from "@/lib/redis-client"

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
  try {
    const userKeys = await redis.keys("user:*")
    return userKeys.length
  } catch (error) {
    console.error("Error getting total users:", error)
    return 0
  }
}

async function getActiveSubscriptions(): Promise<number> {
  try {
    const userKeys = await redis.keys("user:*")
    let activeSubscriptions = 0
    
    for (const key of userKeys) {
      const user = await redis.hgetall(key) as Record<string, string>
      if (user && user.subscription && ["premium", "vip"].includes(user.subscription)) {
        activeSubscriptions++
      }
    }
    return activeSubscriptions
  } catch (error) {
    console.error("Error getting active subscriptions:", error)
    return 0
  }
}

async function getPendingApprovals(): Promise<number> {
  try {
    const userKeys = await redis.keys("user:*")
    let pendingApprovals = 0
    
    for (const key of userKeys) {
      const user = await redis.hgetall(key) as Record<string, string>
      if (user && user.profileStatus === "pending") {
        pendingApprovals++
      }
    }
    return pendingApprovals
  } catch (error) {
    console.error("Error getting pending approvals:", error)
    return 0
  }
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
  try {
    const userKeys = await redis.keys("user:*")
    const recentUsers: RecentRegistration[] = []
    
    for (const key of userKeys) {
      const user = await redis.hgetall(key) as Record<string, string>
      if (user && user.createdAt) {
        recentUsers.push({
          id: user.id || key.replace('user:', ''),
          name: user.fullName || 'Unknown',
          email: user.email || 'Unknown',
          date: user.createdAt
        })
      }
    }
    
    // Sort by creation date (newest first) and return top 10
    return recentUsers
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
  } catch (error) {
    console.error("Error getting recent registrations:", error)
    return []
  }
}

async function getTopActiveUsers(): Promise<TopActiveUser[]> {
  try {
    const userKeys = await redis.keys("user:*")
    const activeUsers: TopActiveUser[] = []
    
    for (const key of userKeys) {
      const user = await redis.hgetall(key) as Record<string, string>
      if (user && user.lastActive) {
        activeUsers.push({
          id: user.id || key.replace('user:', ''),
          name: user.fullName || 'Unknown',
          profileViews: parseInt(user.profileViews || '0'),
          interests: parseInt(user.interestsSent || '0'),
          lastActive: user.lastActive
        })
      }
    }
    
    // Sort by last active (most recent first) and return top 10
    return activeUsers
      .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
      .slice(0, 10)
  } catch (error) {
    console.error("Error getting top active users:", error)
    return []
  }
}

async function getSubscriptionBreakdown(): Promise<SubscriptionBreakdown> {
  try {
    const userKeys = await redis.keys("user:*")
    const breakdown = { free: 0, premium: 0, vip: 0 }
    
    for (const key of userKeys) {
      const user = await redis.hgetall(key) as Record<string, string>
      if (user) {
        const subscription = user.subscription || 'free'
        if (subscription === 'premium') breakdown.premium++
        else if (subscription === 'vip') breakdown.vip++
        else breakdown.free++
      }
    }
    
    return breakdown
  } catch (error) {
    console.error("Error getting subscription breakdown:", error)
    return { free: 0, premium: 0, vip: 0 }
  }
}

async function getRevenueByMonth(): Promise<MonthlyRevenue[]> {
  return [] // Placeholder
}
