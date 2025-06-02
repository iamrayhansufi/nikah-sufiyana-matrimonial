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
  }
  education?: {
    $regex: string
    $options: string
  }
  sect?: string
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

    // Build filter object
    const filters: ProfileFilters = {
      profileStatus: "approved",
    }

    if (gender) filters.gender = gender as "male" | "female"
    if (ageMin && ageMax) {
      filters.age = { $gte: Number.parseInt(ageMin), $lte: Number.parseInt(ageMax) }
    }
    if (location) filters.location = { $regex: location, $options: "i" }
    if (education) filters.education = { $regex: education, $options: "i" }
    if (sect) filters.sect = sect

    // Get profiles from database
    const profiles = await getUsers(filters, page, limit)
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
  } catch (error) {
    console.error("Get profiles error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper functions
async function getProfilesFromDatabase(filters: any, page: number, limit: number) {
  // Query database with filters, pagination
  return [] // Placeholder
}

async function getProfilesCount(filters: any) {
  // Get total count for pagination
  return 0 // Placeholder
}
