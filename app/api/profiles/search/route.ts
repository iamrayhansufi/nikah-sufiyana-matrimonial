import { NextResponse } from "next/server";
import { and, eq, gte, lte, ilike, inArray, not, or, sql } from "drizzle-orm";
import { db } from "../../../../src/db";
import { users, blockedUsers } from "../../../../src/db/schema";
import { verifyAuth } from "../../../../src/lib/auth";
import { z } from "zod";

const searchSchema = z.object({
  ageRange: z.object({
    min: z.number().min(18).max(100).optional(),
    max: z.number().min(18).max(100).optional(),
  }).optional(),
  location: z.string().optional(),
  education: z.array(z.string()).optional(),
  profession: z.array(z.string()).optional(),
  maritalStatus: z.array(z.string()).optional(),
  sect: z.array(z.string()).optional(),
  verifiedOnly: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
  sortBy: z.enum(["age", "lastActive", "createdAt"]).default("lastActive"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export async function GET(req: Request) {
  try {
    // Verify authentication
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams);

    // Parse and validate query parameters
    const {
      ageRange,
      location,
      education,
      profession,
      maritalStatus,
      sect,
      verifiedOnly,
      page,
      limit,
      sortBy,
      sortOrder,
    } = searchSchema.parse({
      ...params,
      education: params.education?.split(","),
      profession: params.profession?.split(","),
      maritalStatus: params.maritalStatus?.split(","),
      sect: params.sect?.split(","),
      ageRange: params.ageRange ? JSON.parse(params.ageRange) : undefined,
      verifiedOnly: params.verifiedOnly === "true",
      page: parseInt(params.page || "1"),
      limit: parseInt(params.limit || "20"),
    });

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [
      not(eq(users.id, userId)), // Exclude current user
      eq(users.profileStatus, "approved"), // Only approved profiles
    ];

    // Get blocked users (both ways)
    const blockedUserIds = await db
      .select({ id: blockedUsers.blockedUserId })
      .from(blockedUsers)
      .where(eq(blockedUsers.userId, userId));

    const blockedByUserIds = await db
      .select({ id: blockedUsers.userId })
      .from(blockedUsers)
      .where(eq(blockedUsers.blockedUserId, userId));

    const allBlockedIds = [
      ...blockedUserIds.map(u => u.id),
      ...blockedByUserIds.map(u => u.id),
    ];

    if (allBlockedIds.length > 0) {
      conditions.push(not(inArray(users.id, allBlockedIds)));
    }

    // Add filters
    if (ageRange?.min) conditions.push(gte(users.age, ageRange.min));
    if (ageRange?.max) conditions.push(lte(users.age, ageRange.max));
    if (location) conditions.push(ilike(users.location, `%${location}%`));
    if (education?.length) conditions.push(inArray(users.education, education));
    if (profession?.length) conditions.push(inArray(users.profession, profession));
    if (maritalStatus?.length) conditions.push(inArray(users.maritalStatus, maritalStatus));
    if (sect?.length) conditions.push(inArray(users.sect, sect));
    if (verifiedOnly) conditions.push(eq(users.verified, true));

    // Get total count
    const [{ count }] = await db
      .select({ count: users.id })
      .from(users)
      .where(and(...conditions));

    // Get profiles with dynamic sorting
    const profiles = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        age: users.age,
        location: users.location,
        education: users.education,
        profession: users.profession,
        sect: users.sect,
        maritalStatus: users.maritalStatus,
        profilePhoto: users.profilePhoto,
        verified: users.verified,
        lastActive: users.lastActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(...conditions))
      .orderBy(sql`${
        sortBy === "age" ? users.age :
        sortBy === "lastActive" ? users.lastActive :
        users.createdAt
      } ${sql.raw(sortOrder)}`)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      profiles,
      pagination: {
        total: Number(count),
        page,
        limit,
        totalPages: Math.ceil(Number(count) / limit),
      },
    });
  } catch (error) {
    console.error("Profile search error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid parameters", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to search profiles" },
      { status: 500 }
    );
  }
} 