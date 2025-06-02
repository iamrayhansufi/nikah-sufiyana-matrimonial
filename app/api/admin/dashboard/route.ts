import { NextResponse } from "next/server";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "../../../../src/db";
import { users, subscriptionHistory, messages, subscriptionPlans } from "../../../../src/db/schema";
import { verifyAuth } from "../../../../src/lib/auth";

export async function GET(req: Request) {
  try {
    // Verify admin authentication (TODO: Add admin check)
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get date for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get total users count
    const [{ totalUsers }] = await db
      .select({ totalUsers: sql`count(*)` })
      .from(users);

    // Get new users in last 30 days
    const [{ newUsers }] = await db
      .select({ newUsers: sql`count(*)` })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo));

    // Get pending profiles count
    const [{ pendingProfiles }] = await db
      .select({ pendingProfiles: sql`count(*)` })
      .from(users)
      .where(eq(users.profileStatus, "pending"));

    // Get premium users count
    const [{ premiumUsers }] = await db
      .select({ premiumUsers: sql`count(*)` })
      .from(users)
      .where(
        and(
          eq(users.subscription, "premium"),
          gte(users.subscriptionExpiry, new Date())
        )
      );

    // Get total revenue
    const [{ totalRevenue }] = await db
      .select({
        totalRevenue: sql`sum(sp.price)`
      })
      .from(subscriptionHistory)
      .innerJoin(
        subscriptionPlans,
        eq(subscriptionHistory.planId, subscriptionPlans.id)
      )
      .where(eq(subscriptionHistory.status, "active"));

    // Get total messages
    const [{ totalMessages }] = await db
      .select({ totalMessages: sql`count(*)` })
      .from(messages);

    // Get active users in last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const [{ activeUsers }] = await db
      .select({ activeUsers: sql`count(*)` })
      .from(users)
      .where(gte(users.lastActive, yesterday));

    return NextResponse.json({
      statistics: {
        totalUsers: Number(totalUsers),
        newUsers: Number(newUsers),
        pendingProfiles: Number(pendingProfiles),
        premiumUsers: Number(premiumUsers),
        totalRevenue: Number(totalRevenue) || 0,
        totalMessages: Number(totalMessages),
        activeUsers: Number(activeUsers),
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to get dashboard statistics" },
      { status: 500 }
    );
  }
}
