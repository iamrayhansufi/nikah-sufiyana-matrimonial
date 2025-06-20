import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { database } from "../../../../lib/database-service";

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

    // Use our new database service for profile search
    const { profiles, total } = await database.profiles.searchProfiles({
      ageMin,
      ageMax,
      location,
      education,
      profession,
      sect,
      maritalStatus,
      page,
      limit,
    });

    return NextResponse.json({
      profiles,
      pagination: {
        total,
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