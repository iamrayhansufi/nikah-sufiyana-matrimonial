import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../../../../src/db";
import { subscriptionPlans, subscriptionHistory, users } from "../../../../src/db/schema";
import { verifyAuth } from "../../../../src/lib/auth";
import { z } from "zod";

const purchaseSchema = z.object({
  planId: z.number(),
  paymentId: z.string(),
});

export async function POST(req: Request) {
  try {
    // Verify authentication
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { planId, paymentId } = purchaseSchema.parse(body);

    // Get the subscription plan
    const plan = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.id, planId))
      .limit(1);

    if (!plan || plan.length === 0 || !plan[0].active) {
      return NextResponse.json(
        { error: "Invalid subscription plan" },
        { status: 400 }
      );
    }

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan[0].duration);

    // Create subscription record
    const [subscription] = await db
      .insert(subscriptionHistory)
      .values({
        userId,
        planId,
        startDate,
        endDate,
        paymentId,
        status: "active",
      })
      .returning();

    // Update user's subscription status
    await db
      .update(users)
      .set({
        subscription: plan[0].name.toLowerCase(),
        subscriptionExpiry: endDate,
      })
      .where(eq(users.id, userId));

    return NextResponse.json({
      message: "Subscription purchased successfully",
      subscription: {
        id: subscription.id,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        plan: plan[0].name,
      },
    });
  } catch (error) {
    console.error("Subscription purchase error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to purchase subscription" },
      { status: 500 }
    );
  }
} 