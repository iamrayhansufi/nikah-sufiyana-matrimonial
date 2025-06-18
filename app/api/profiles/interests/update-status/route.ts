import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { interests, users } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { verifyAuth } from "@/src/lib/auth";
import { createNotification } from "@/lib/notifications";
import { z } from "zod";

const updateInterestSchema = z.object({
  interestId: z.number(),
  status: z.enum(["accepted", "declined"]),
});

export async function PUT(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { interestId, status } = updateInterestSchema.parse(body);

    // Verify interest belongs to the current user
    const existingInterest = await db
      .select()
      .from(interests)
      .where(
        and(
          eq(interests.id, interestId),
          eq(interests.toUserId, userId)
        )
      )
      .limit(1);

    if (existingInterest.length === 0) {
      return NextResponse.json(
        { error: "Interest not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    const interest = existingInterest[0];

    // Update interest status
    await db
      .update(interests)
      .set({ status })
      .where(eq(interests.id, interestId));

    // Get sender user details for notification
    const senderUser = await db
      .select()
      .from(users)
      .where(eq(users.id, interest.fromUserId))
      .limit(1);

    const receiverUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (senderUser.length > 0 && receiverUser.length > 0) {
      // Create notification for the sender based on status
      if (status === "accepted") {
        await createNotification({
          userId: String(interest.fromUserId),
          type: "interest_accepted",
          message: `${receiverUser[0].fullName || 'Someone'} has accepted your interest!`,
          link: `/profile/${userId}`,
          metadata: {
            userName: receiverUser[0].fullName,
            userId: String(userId),
            interestId: String(interestId),
          }
        });

        // Check if this creates a match
        const mutualInterest = await db
          .select()
          .from(interests)
          .where(
            and(
              eq(interests.fromUserId, userId),
              eq(interests.toUserId, interest.fromUserId)
            )
          )
          .limit(1);

        // If user has also shown interest in the other person
        if (mutualInterest.length > 0) {
          // Update the status of the other interest as well
          await db
            .update(interests)
            .set({ status: "accepted" })
            .where(eq(interests.id, mutualInterest[0].id));

          // Send match notifications
          await createNotification({
            userId: String(interest.fromUserId),
            type: "match",
            message: `You have a new match with ${receiverUser[0].fullName}!`,
            link: `/profile/${userId}`,
            metadata: {
              matchName: receiverUser[0].fullName,
              matchId: String(userId),
            }
          });
          
          await createNotification({
            userId: String(userId),
            type: "match",
            message: `You have a new match with ${senderUser[0].fullName}!`,
            link: `/profile/${interest.fromUserId}`,
            metadata: {
              matchName: senderUser[0].fullName,
              matchId: String(interest.fromUserId),
            }
          });
        }
      } else if (status === "declined") {
        // Optionally notify of decline
        await createNotification({
          userId: String(interest.fromUserId),
          type: "interest_declined",
          message: `Your interest was not accepted at this time.`,
          link: `/browse`,
          metadata: {
            interestId: String(interestId),
          }
        });
      }
    }

    return NextResponse.json({
      message: `Interest ${status === "accepted" ? "accepted" : "declined"} successfully`,
      status,
    });
  } catch (error) {
    console.error("Update interest status error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update interest status" },
      { status: 500 }
    );
  }
}
