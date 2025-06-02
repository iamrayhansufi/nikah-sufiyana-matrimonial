import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../../../../../src/db";
import { verificationRequests, users } from "../../../../../src/db/schema";
import { verifyAuth } from "../../../../../src/lib/auth";
import { z } from "zod";

const reviewSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  notes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication (TODO: Add admin check)
    const adminId = await verifyAuth(request);
    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid verification request ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, notes } = reviewSchema.parse(body);

    // Get verification request
    const verificationRequest = await db
      .select()
      .from(verificationRequests)
      .where(eq(verificationRequests.id, id))
      .limit(1);

    if (!verificationRequest || verificationRequest.length === 0) {
      return NextResponse.json(
        { error: "Verification request not found" },
        { status: 404 }
      );
    }

    if (verificationRequest[0].status !== "pending") {
      return NextResponse.json(
        { error: "This request has already been reviewed" },
        { status: 400 }
      );
    }

    // Update verification request
    const [updatedRequest] = await db
      .update(verificationRequests)
      .set({
        status,
        notes,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      })
      .where(eq(verificationRequests.id, id))
      .returning();

    // If approved, update user's verified status
    if (status === "approved") {
      await db
        .update(users)
        .set({ verified: true })
        .where(eq(users.id, verificationRequest[0].userId));
    }

    return NextResponse.json({
      message: `Verification request ${status}`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Review verification error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to review verification request" },
      { status: 500 }
    );
  }
} 