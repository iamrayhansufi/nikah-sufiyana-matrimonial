import { type NextRequest, NextResponse } from "next/server"
import { dbMonitor } from "@/lib/db-monitor";
import { database } from "@/lib/database-service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";
import { redis } from "@/lib/redis-client";

type ProfileFilters = {
  profileStatus?: "approved" | "pending" | "rejected"
  gender?: "male" | "female"
  ageMin?: string
  ageMax?: string
  location?: string
  city?: string
  country?: string
  education?: string
  profession?: string
  sect?: string
  maritalStatus?: string
  housing?: string
  heightMin?: string
  heightMax?: string
  useDummy?: string
}

export async function GET(request: NextRequest) {
  try {
    // Check database usage before proceeding
    const dbStatus = dbMonitor.recordQuery();
    if (dbStatus.hasExceededLimit) {
      console.warn("Database data transfer limit exceeded, returning cached or limited data");
      return NextResponse.json({ 
        error: "Data transfer limit exceeded, please try again later",
        profiles: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      }, { 
        status: 429,
        headers: { 'Retry-After': '3600' }
      });
    }
    
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20") // Reduced default limit
    const gender = searchParams.get("gender")
    const ageMin = searchParams.get("ageMin")
    const ageMax = searchParams.get("ageMax")
    const location = searchParams.get("location")
    const city = searchParams.get("city")
    const country = searchParams.get("country")
    const education = searchParams.get("education")
    const profession = searchParams.get("profession")
    const sect = searchParams.get("sect")
    const maritalStatus = searchParams.get("maritalStatus")
    const housing = searchParams.get("housing")
    const heightMin = searchParams.get("heightMin")
    const heightMax = searchParams.get("heightMax")
    const sortBy = searchParams.get("sortBy") || "match"

    // Validate pagination parameters
    if (isNaN(page) || page < 1) {
      return NextResponse.json({ error: "Invalid page parameter" }, { status: 400 })
    }
    if (isNaN(limit) || limit < 1 || limit > 50) { // Reduced max limit from 100 to 50
      return NextResponse.json({ error: "Invalid limit parameter" }, { status: 400 })
    }

    // Build filter object
    const filters: ProfileFilters = {
      profileStatus: "approved" // Default all profiles to "approved"
    }
    
    console.log("Initial filters:", filters);

    if (gender) {
      if (gender !== "male" && gender !== "female") {
        return NextResponse.json({ error: "Invalid gender parameter" }, { status: 400 })
      }
      filters.gender = gender as "male" | "female"
    }
    
    if (ageMin && ageMax) {
      const minAge = Number.parseInt(ageMin)
      const maxAge = Number.parseInt(ageMax)
      
      if (isNaN(minAge) || isNaN(maxAge) || minAge < 18 || maxAge > 100 || minAge > maxAge) {
        return NextResponse.json({ error: "Invalid age range parameters" }, { status: 400 })
      }
      
      filters.ageMin = minAge.toString();
      filters.ageMax = maxAge.toString();
    }
    
    if (location) filters.location = location;
    if (city) filters.city = city;
    if (country) filters.country = country;
    if (education) filters.education = education;
    if (profession) filters.profession = profession;
    if (sect) filters.sect = sect;
    if (maritalStatus) filters.maritalStatus = maritalStatus;
    if (housing) filters.housing = housing;
    if (heightMin) filters.heightMin = heightMin;
    if (heightMax) filters.heightMax = heightMax;

    // Get profiles from database using Redis
    try {
      console.log("API: Fetching profiles with filters:", JSON.stringify(filters, null, 2).slice(0, 200));
      
      const searchParams = {
        page: page.toString(),
        limit: limit.toString(),
        gender: filters.gender,
        ageMin: filters.ageMin,
        ageMax: filters.ageMax,
        location: filters.location,
        city: city,
        country: country,
        education: filters.education,
        profession: profession,
        sect: filters.sect,
        maritalStatus: maritalStatus,
        housing: housing,
        heightMin: heightMin,
        heightMax: heightMax,
        sortBy: sortBy
      };
      
      const { profiles, total } = await database.profiles.searchProfiles(searchParams);
      
      // Calculate pagination
      const totalPages = Math.ceil(total / limit);
      
      // Format response
      return NextResponse.json({
        profiles,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages
        }
      });
    } catch (error) {
      console.error("Error fetching profiles:", error);
      
      // Return an appropriate error response
      return NextResponse.json(
        { error: "Failed to fetch profiles" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in profiles route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const userKey = `user:${userId}`;
    const body = await request.json();
    // Only allow updating specific privacy fields
    const allowedFields = [
      "showContactInfo", "showPhotos", "hideProfile", "showOnlineStatus",
      "showFatherNumber", "fatherMobile", "showMotherNumber", "motherMobile"
    ];
    const updateData: { [key: string]: any } = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }
    await redis.hset(userKey, updateData);
    return NextResponse.json({ success: true, updated: updateData });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}










