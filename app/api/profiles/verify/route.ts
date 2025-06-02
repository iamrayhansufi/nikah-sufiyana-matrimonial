import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { writeFile } from "fs/promises";
import { join } from "path";
import { db } from "../../../../src/db";
import { verificationRequests, users } from "../../../../src/db/schema";
import { verifyAuth } from "../../../../src/lib/auth";
import { z } from "zod";

const verificationSchema = z.object({
  documentType: z.enum(["passport", "id_card", "driving_license"]),
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

    // Check if user already has a pending verification
    const existingRequest = await db
      .select()
      .from(verificationRequests)
      .where(
        eq(verificationRequests.userId, userId)
      )
      .limit(1);

    if (existingRequest && existingRequest.length > 0 && existingRequest[0].status === "pending") {
      return NextResponse.json(
        { error: "You already have a pending verification request" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const documentType = formData.get("documentType") as string;
    const document = formData.get("document") as File;

    // Validate input
    verificationSchema.parse({ documentType });

    if (!document) {
      return NextResponse.json(
        { error: "No document provided" },
        { status: 400 }
      );
    }

    // Validate file type (only images and PDFs)
    if (!document.type.startsWith("image/") && document.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Invalid file type. Only images and PDFs are allowed." },
        { status: 400 }
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `verify-${userId}-${timestamp}-${document.name}`;
    const bytes = await document.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save document to secure location (not public folder)
    const uploadDir = join(process.cwd(), "private", "verifications");
    await writeFile(join(uploadDir, filename), buffer);

    // Create verification request
    const [request] = await db
      .insert(verificationRequests)
      .values({
        userId,
        documentType,
        documentUrl: `/verifications/${filename}`,
        status: "pending",
      })
      .returning();

    return NextResponse.json({
      message: "Verification request submitted successfully",
      requestId: request.id,
    });
  } catch (error) {
    console.error("Verification request error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to submit verification request" },
      { status: 500 }
    );
  }
} 