import { type NextRequest, NextResponse } from "next/server"
import { getUsers, getUserStats } from "@/lib/database"

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
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
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
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json({ error: "Invalid limit parameter" }, { status: 400 })
    }

    // Build filter object
    const filters: ProfileFilters = {
      profileStatus: "approved",
    }


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
      console.log("API: Fetching profiles with filters:", JSON.stringify(filters));
      const profiles = await getUsers(filters, page, limit, useDummy)
      console.log(`API: Found ${profiles.length} profiles`);
      const stats = await getUserStats()

















      return NextResponse.json({
        profiles: profiles.map((profile) => ({
          id: profile.id,
          name: profile.fullName,
          age: profile.age,
          location: profile.location,
          education: profile.education,
          profession: profile.profession,
          sect: profile.sect,
          profilePhoto: profile.profilePhoto,
          verified: profile.verified,
          subscription: profile.subscription,
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










