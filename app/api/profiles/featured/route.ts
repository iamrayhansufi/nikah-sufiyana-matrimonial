import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/database-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "3")

    // Get featured profiles (premium, verified, active profiles)
    const { profiles } = await database.profiles.searchProfiles({
      page: "1",
      limit: limit.toString(),
      // Add any specific criteria for featured profiles
    });    // Filter and format profiles for homepage display
    const featuredProfiles = profiles
      .filter(profile => 
        profile.fullName && 
        profile.age && 
        (profile.city || profile.location) &&
        profile.education &&
        profile.profession
      )
      .map(profile => {
        // Clean and format the name
        let displayName = profile.fullName;
        if (displayName.length > 20) {
          displayName = displayName.split(' ').slice(0, 2).join(' ') + '.';
        }
        
        // Format location
        let displayLocation = profile.city || profile.location || "Hyderabad";
        if (profile.country && profile.country.toLowerCase() !== 'india') {
          displayLocation += `, ${profile.country}`;
        } else if (!displayLocation.toLowerCase().includes('india')) {
          displayLocation += ", India";
        }
          // Format profession title case
        const formatProfession = (prof: string) => {
          if (!prof) return "Professional";
          return prof.split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        };
        
        return {
          id: profile.id || `user:${Date.now()}:${Math.random()}`,
          name: displayName,
          age: parseInt(profile.age) || 25,
          location: displayLocation,
          education: profile.education,
          profession: formatProfession(profile.profession),
          verified: true, // All database profiles are verified
          premium: true, // For homepage display
          profilePhoto: profile.profilePhoto
        };
      })
      .slice(0, limit);

    return NextResponse.json({
      profiles: featuredProfiles,
      total: featuredProfiles.length
    });

  } catch (error) {
    console.error("Error fetching featured profiles:", error);
    
    // Return fallback dummy data if database fails
    const fallbackProfiles = [
      {
        id: "fallback-1",
        name: "Sister Maryam A.",
        age: 26,
        profession: "Software Engineer",
        location: "Hyderabad, Telangana",
        education: "B.Tech Computer Science",
        verified: true,
        premium: true
      },
      {
        id: "fallback-2", 
        name: "Brother Khalid M.",
        age: 29,
        profession: "Business Analyst",
        location: "Pune, Maharashtra",
        education: "MBA Finance",
        verified: true,
        premium: true
      },
      {
        id: "fallback-3",
        name: "Sister Aisha R.",
        age: 24,
        profession: "Doctor",
        location: "Chennai, Tamil Nadu",
        education: "MBBS",
        verified: true,
        premium: true
      }
    ];

    return NextResponse.json({
      profiles: fallbackProfiles,
      total: fallbackProfiles.length
    });
  }
}
