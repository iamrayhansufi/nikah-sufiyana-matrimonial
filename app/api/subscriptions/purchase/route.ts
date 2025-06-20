import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";
import { z } from "zod";
import { nanoid } from "nanoid";

const purchaseSchema = z.object({
  planId: z.string(),
  paymentMethod: z.string(),
  amount: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = purchaseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const { planId, paymentMethod, amount } = result.data;

    // Create subscription record
    const subscriptionId = nanoid();
    const subscription = {
      id: subscriptionId,
      userId: session.user.id,
      planId,
      amount: amount.toString(),
      paymentMethod,
      status: "active",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };

    await redis.hset(`subscription:${subscriptionId}`, subscription);

    // Update user subscription status
    await redis.hset(`user:${session.user.id}`, {
      subscription: "premium",
      subscriptionExpiry: subscription.expiresAt,
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Error purchasing subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}