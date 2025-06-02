import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, and, between, like, sql } from "drizzle-orm";
import { db } from "../../../../src/db";
import { users } from "../../../../src/db/schema";

const searchParamsSchema = z.object({
  ageMin: z.string().optional(),
  ageMax: z.string().optional(),
  location: z.string().optional(),
  education: z.string().optional(),
  profession: z.string().optional(),
  sect: z.string().optional(),
  maritalStatus: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    const {
      ageMin,
      ageMax,
      location,
      education,
      profession,
      sect,
      maritalStatus,
      page = "1",
      limit = "10",
    } = searchParamsSchema.parse(params);

    const conditions = [];

    if (ageMin && ageMax) {
      conditions.push(between(users.age, parseInt(ageMin), parseInt(ageMax)));
    }

    if (location) {
      conditions.push(like(users.location, `%${location}%`));
    }

    if (education) {
      conditions.push(eq(users.education, education));
    }

    if (profession) {
      conditions.push(eq(users.profession, profession));
    }

    if (sect) {
      conditions.push(eq(users.sect, sect));
    }

    if (maritalStatus) {
      conditions.push(eq(users.maritalStatus, maritalStatus));
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const profiles = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        age: users.age,
        location: users.location,
        education: users.education,
        profession: users.profession,
        sect: users.sect,
        profilePhoto: users.profilePhoto,
        premium: users.premium,
        lastActive: users.lastActive,
      })
      .from(users)
      .where(and(...conditions))
      .limit(parseInt(limit))
      .offset(offset);

    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(and(...conditions));

    return NextResponse.json({
      profiles,
      pagination: {
        total: total[0].count,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Profile search error:", error);
    return NextResponse.json(
      { error: "Failed to search profiles" },
      { status: 500 }
    );
  }
} 