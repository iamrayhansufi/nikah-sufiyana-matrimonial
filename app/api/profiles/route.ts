import { type NextRequest, NextResponse } from "next/server"
import { dbMonitor } from "@/lib/db-monitor";
import { database } from "@/lib/database-service";

type ProfileFilters = {
  profileStatus?: "approved" | "pending" | "rejected"
  gender?: "male" | "female"
  ageMin?: string
  ageMax?: string
  location?: string
  education?: string
  sect?: string
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
    const education = searchParams.get("education")
    const sect = searchParams.get("sect")

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
    if (education) filters.education = education;
    if (sect) filters.sect = sect;

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
        education: filters.education,
        sect: filters.sect
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










