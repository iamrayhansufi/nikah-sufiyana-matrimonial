import { NextResponse, NextRequest } from "next/server";
import { redis } from "@/lib/redis-client";
import { verifyAdminAuth } from "@/lib/auth";

interface RedisUser {
  [key: string]: string;
  id: string;
  email: string;
  createdAt: string;
  profileStatus: string;
  subscription: string;
  subscriptionExpiry: string;
}

interface DashboardStats {
  totalUsers: number;
  newUsers: number;
  pendingProfiles: number;
  premiumUsers: number;
  totalRevenue: number;
  activeMessages: number;
  matchesCount: number;
  monthlyGrowth: {
    users: number;
    revenue: number;
  };
}

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get date for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all user keys
    const userKeys = await redis.keys("user:*");
    const users: RedisUser[] = [];

    // Fetch all users
    for (const key of userKeys) {
      const user = await redis.hgetall(key) as RedisUser;
      if (user) {
        users.push(user);
      }
    }

    // Calculate statistics
    const stats: DashboardStats = {
      totalUsers: users.length,
      newUsers: users.filter(user => {
        const createdAt = new Date(user.createdAt);
        return createdAt >= thirtyDaysAgo;
      }).length,
      pendingProfiles: users.filter(user => 
        user.profileStatus === "pending"
      ).length,
      premiumUsers: users.filter(user => {
        const isExpired = user.subscriptionExpiry && 
          new Date(user.subscriptionExpiry) > new Date();
        return user.subscription === "premium" && isExpired;
      }).length,
      totalRevenue: 0,
      activeMessages: 0,
      matchesCount: 0,
      monthlyGrowth: {
        users: 0,
        revenue: 0
      }
    };

    // Get total revenue from subscription history
    const subscriptionKeys = await redis.keys("subscription:*");
    for (const key of subscriptionKeys) {
      const subscription = await redis.hgetall(key);
      if (subscription && typeof subscription.amount === 'string' && subscription.amount) {
        stats.totalRevenue += parseInt(subscription.amount);
      }
    }

    // Get active messages count
    const messageKeys = await redis.keys("message:*");
    stats.activeMessages = messageKeys.length;

    // Get matches count (accepted interests)
    const interestKeys = await redis.keys("interest:*");
    for (const key of interestKeys) {
      const interest = await redis.hgetall(key);
      if (interest && interest.status === "accepted") {
        stats.matchesCount++;
      }
    }

    // Calculate monthly growth
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const lastMonthUsers = users.filter(user => {
      const createdAt = new Date(user.createdAt);
      return createdAt >= sixtyDaysAgo && createdAt < thirtyDaysAgo;
    }).length;

    const thisMonthUsers = users.filter(user => {
      const createdAt = new Date(user.createdAt);
      return createdAt >= thirtyDaysAgo;
    }).length;

    stats.monthlyGrowth.users = ((thisMonthUsers - lastMonthUsers) / (lastMonthUsers || 1)) * 100;

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
