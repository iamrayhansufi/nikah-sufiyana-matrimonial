import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "../../../../src/db";
import { userReports, users } from "../../../../src/db/schema";
import { verifyAuth } from "../../../../src/lib/auth";
import { z } from "zod";

const reportSchema = z.object({
  reportedUserId: z.number(),
  reason: z.enum([
    "fake_profile",
    "inappropriate_content",
    "harassment",
    "spam",
    "other"
  ]),
  description: z.string().min(10).max(500),
});

export async function POST(req: Request) {
  try {
    // Verify authentication
    const reporterId = await verifyAuth(req);
    if (!reporterId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { reportedUserId, reason, description } = reportSchema.parse(body);

    // Check if reported user exists
    const reportedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, reportedUserId))
      .limit(1);

    if (!reportedUser || reportedUser.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Prevent self-reporting
    if (reporterId === reportedUserId) {
      return NextResponse.json(
        { error: "You cannot report yourself" },
        { status: 400 }
      );
    }

    // Check for existing report
    const existingReport = await db
      .select()
      .from(userReports)
      .where(
        and(
          eq(userReports.reporterId, reporterId),
          eq(userReports.reportedUserId, reportedUserId),
          eq(userReports.status, "pending")
        )
      )
      .limit(1);

    if (existingReport && existingReport.length > 0) {
      return NextResponse.json(
        { error: "You have already reported this user" },
        { status: 400 }
      );
    }

    // Create report
    const [report] = await db
      .insert(userReports)
      .values({
        reporterId,
        reportedUserId,
        reason,
        description,
        status: "pending",
      })
      .returning();

    return NextResponse.json({
      message: "Report submitted successfully",
      reportId: report.id,
    });
  } catch (error) {
    console.error("Report user error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to submit report" },
      { status: 500 }
    );
  }
} 