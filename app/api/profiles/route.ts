import { type NextRequest, NextResponse } from "next/server"
import { getUsers, getUserStats } from "@/lib/database"
import { dbMonitor } from "@/lib/db-monitor";

type ProfileFilters = {
  profileStatus: "approved" | "pending" | "rejected"
  gender?: "male" | "female"
  age?: {
    $gte: number
    $lte: number
  }
  location?: {
    $regex: string
    $options: string
  } | string
  education?: {
    $regex: string
    $options: string
  } | string
  sect?: string
  ageMin?: string
  ageMax?: string
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
      
      filters.age = { $gte: minAge, $lte: maxAge }
    }
    
    if (location) filters.location = { $regex: location, $options: "i" }
    if (education) filters.education = { $regex: education, $options: "i" }
    if (sect) filters.sect = sect

    // Get profiles from database
    
    // Check if useDummy parameter is set
    const useDummy = searchParams.get("useDummy") === "true";
    if (useDummy) {
      filters.useDummy = "true"; // Add to filters to pass through
    }

    try {
      console.log("API: Fetching profiles with filters:", JSON.stringify(filters, null, 2).slice(0, 200));
      const profiles = await getUsers(filters, page, limit, useDummy)
      console.log(`API: Found ${profiles.length} profiles`);
      const stats = await getUserStats()

















      return NextResponse.json({
        profiles: profiles.map((profile) => ({
          id: profile.id,
          name: profile.fullName,
          age: profile.age,
          location: profile.location,
          country: profile.country,
          city: profile.city,
          education: profile.education,
          profession: profile.profession,
          sect: profile.sect,
          height: profile.height,
          maritalStatus: profile.maritalStatus,
          profilePhoto: profile.profilePhoto,
          verified: profile.verified,
          premium: profile.premium,
          subscription: profile.subscription,
          showPhotos: profile.showPhotos,
          gender: profile.gender,
          lastActive: profile.lastActive,
        })),
        pagination: {
          page,
          limit,
          total: stats.total,
          pages: Math.ceil(stats.total / limit),
        },
      })
    } catch (dbError) {
      console.error("Database error:", dbError)
      
      // Import in this scope to avoid server/client module mismatch
      const { isNeonLimitError } = require('@/lib/database-limits');
      
      if (isNeonLimitError(dbError)) {
        console.warn("Neon database transfer limit hit!");
        return NextResponse.json({ 
          error: "Database transfer limit reached", 
          neonLimitHit: true,
          message: "You have used all your data transfer allowance, upgrade your account to increase your data transfer limit."
        }, { status: 429 }) // 429 Too Many Requests
      }
      
      return NextResponse.json({ error: "Database operation failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Get profiles error:", error)

    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 })
  }
}










