import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { eq } from "drizzle-orm"
import { db } from "@/src/db"
import { users } from "@/src/db/schema"
import { authOptions } from "@/lib/auth-options"

// Add error handling for database connection
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

type Props = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: Props
) {  try {
    const session = await getServerSession(authOptions)
    // Check if we're in development mode where we might want to bypass auth
    const isDev = process.env.NODE_ENV === 'development'
    const bypassAuth = request.nextUrl.searchParams.get('public') === 'true' && isDev
    
    if (!session?.user?.id && !bypassAuth) {
      console.log("Unauthorized profile access attempt")
      return NextResponse.json(
        { error: "Unauthorized - Please log in to view profiles" },
        { status: 401 }
      )
    }

    // Safely extract and validate the ID parameter
    let paramId;
    try {
      paramId = (await params).id;
      if (!paramId) {
        return NextResponse.json(
          { error: "Missing profile ID" }, 
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Error extracting profile ID from params:", error);
      return NextResponse.json(
        { error: "Invalid profile ID parameter" }, 
        { status: 400 }
      );
    }
    
    const id = parseInt(paramId)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid profile ID" },
        { status: 400 }
      )
    }    const profile = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        age: users.age,
        gender: users.gender,
        country: users.country,
        city: users.city,
        address: users.address,
        location: users.location,
        education: users.education,
        educationDetails: users.educationDetails,
        profession: users.profession,
        jobTitle: users.jobTitle,
        income: users.income,
        sect: users.sect,
        height: users.height,
        complexion: users.complexion,
        maritalStatus: users.maritalStatus,
        maritalStatusOther: users.maritalStatusOther,
        profilePhoto: users.profilePhoto,
        aboutMe: users.aboutMe,
        familyDetails: users.familyDetails,
        fatherName: users.fatherName,
        fatherMobile: users.fatherMobile,
        motherName: users.motherName,
        motherMobile: users.motherMobile,
        housingStatus: users.housingStatus,
        siblings: users.siblings,
        brotherInLaws: users.brotherInLaws,
        maternalPaternal: users.maternalPaternal,
        religiousInclination: users.religiousInclination,
        preferredAgeMin: users.preferredAgeMin,
        preferredAgeMax: users.preferredAgeMax,
        preferredEducation: users.preferredEducation,
        preferredLocation: users.preferredLocation,
        preferredOccupation: users.preferredOccupation,
        preferredHeight: users.preferredHeight,
        preferredComplexion: users.preferredComplexion,
        preferredMaslak: users.preferredMaslak,
        expectations: users.expectations,
        showContactInfo: users.showContactInfo,
        showPhotos: users.showPhotos,
        hideProfile: users.hideProfile,
        showOnlineStatus: users.showOnlineStatus,
        showFatherNumber: users.showFatherNumber,
        showMotherNumber: users.showMotherNumber,
        mobileNumber: users.mobileNumber,
        profileStatus: users.profileStatus,
        subscription: users.subscription,
        lastActive: users.lastActive,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);    if (!profile || profile.length === 0) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }    
    // Add formatted profile info for consistent display
    const profileData = {
      ...profile[0],
      name: profile[0].fullName, // Add name field from fullName for consistency
      joinedDate: profile[0].lastActive ? new Date(profile[0].lastActive).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Unknown',
      matchPercentage: 85, // Default match percentage
      lastSeen: profile[0].lastActive ? new Date(profile[0].lastActive).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Unknown',
      // Default fields for display
      showContactInfo: false,
      showFullPhotos: false,
      gallery: [],
      prayerHabit: 'Not specified',
      hijab: 'Not specified',
      quranReading: 'Not specified',
      islamicEducation: 'Not specified',
      diet: 'Not specified',
      smoking: 'Not specified',
      drinking: 'Not specified',
      languages: ['Not specified'],
      hobbies: ['Not specified'],
      fatherOccupation: 'Not specified',
      motherOccupation: 'Not specified',
      siblings: 'Not specified',
      familyType: 'Not specified',
      height: 'Not specified',
      weight: 'Not specified',
      complexion: 'Not specified',
      bodyType: 'Not specified',
      motherTongue: 'Not specified',
      preferredHeight: 'Not specified',
      preferredAge: profile[0].preferredAgeMin && profile[0].preferredAgeMax ? 
        `${profile[0].preferredAgeMin} - ${profile[0].preferredAgeMax} years` : 'Not specified',
    };
    
    // Allow all profiles to be viewed regardless of status
    // Debug information
    console.log(`Serving profile ${id}`);
    
    return NextResponse.json(profileData);  } catch (error: unknown) {
    console.error("Get profile error:", error);
    
    // Return more detailed error information in development
    const isDev = process.env.NODE_ENV === 'development';
    const errorMessage = isDev ? 
      `Failed to get profile: ${error instanceof Error ? error.message : "Unknown error"}` : 
      "Failed to get profile";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: Props
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }    const { id: paramId } = await params
    const id = parseInt(paramId)
    
    console.log(`Attempting to fetch profile ID: ${id}`);
    
    if (isNaN(id)) {
      console.log(`Invalid profile ID: ${paramId}`);
      return NextResponse.json(
        { error: "Invalid profile ID" },
        { status: 400 }
      )
    }
    
    console.log(`User ${session?.user?.id || 'anonymous'} is fetching profile ${id}`);
      // Only allow users to update their own profile
    if (session && session.user && parseInt(session.user.id) !== id) {
      return NextResponse.json(
        { error: "You can only update your own profile" },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    // Update user profile in database
    const updatedProfile = await db
      .update(users)
      .set({
        // Basic Info
        fullName: body.fullName || undefined,
        age: body.age !== undefined ? parseInt(body.age) : undefined,
        gender: body.gender || undefined,
        location: body.location || undefined,
        education: body.education || undefined,
        profession: body.profession || undefined,
        maritalStatus: body.maritalStatus || undefined,
        maritalStatusOther: body.maritalStatusOther || undefined,        sect: body.sect || undefined,
        height: body.height !== undefined ? body.height : undefined, // Allow empty string to clear value
        complexion: body.complexion !== undefined ? body.complexion : undefined, // Allow empty string to clear value
        aboutMe: body.aboutMe || undefined,
        city: body.city || undefined,
        country: body.country || undefined,
        address: body.address || undefined,
        
        // Religious info
        religiousInclination: body.religiousInclination || undefined,
        
        // Family info
        familyDetails: body.familyDetails || undefined,
        fatherName: body.fatherName || undefined,
        fatherMobile: body.fatherMobile || undefined,
        motherName: body.motherName || undefined,
        motherMobile: body.motherMobile || undefined,
        siblings: body.siblings ? JSON.stringify(body.siblings) : undefined,
        brotherInLaws: body.brotherInLaws ? JSON.stringify(body.brotherInLaws) : undefined,
        maternalPaternal: body.maternalPaternal ? JSON.stringify(body.maternalPaternal) : undefined,
        housingStatus: body.housingStatus || undefined,
        
        // Education & Career
        educationDetails: body.educationDetails || undefined,
        income: body.income || undefined,
        jobTitle: body.jobTitle || undefined,
        
        // Partner preferences
        preferredAgeMin: body.preferredAgeMin !== undefined ? parseInt(body.preferredAgeMin) : undefined,
        preferredAgeMax: body.preferredAgeMax !== undefined ? parseInt(body.preferredAgeMax) : undefined,
        preferredEducation: body.preferredEducation || undefined,        preferredLocation: body.preferredLocation || undefined,
        preferredOccupation: body.preferredOccupation || undefined,
        preferredHeight: body.preferredHeight !== undefined ? body.preferredHeight : undefined, // Allow empty string to clear value
        preferredComplexion: body.preferredComplexion !== undefined ? body.preferredComplexion : undefined, // Allow empty string to clear value
        preferredMaslak: body.preferredMaslak || undefined,
        expectations: body.expectations || undefined,
        
        // Privacy settings
        showContactInfo: body.showContactInfo !== undefined ? body.showContactInfo : undefined,
        showPhotos: body.showPhotos !== undefined ? body.showPhotos : undefined,
        hideProfile: body.hideProfile !== undefined ? body.hideProfile : undefined,
        showOnlineStatus: body.showOnlineStatus !== undefined ? body.showOnlineStatus : undefined,
        showFatherNumber: body.showFatherNumber !== undefined ? body.showFatherNumber : undefined,
        showMotherNumber: body.showMotherNumber !== undefined ? body.showMotherNumber : undefined,
        mobileNumber: body.mobileNumber || undefined,
        
        // Update timestamp
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
      
    if (!updatedProfile || updatedProfile.length === 0) {
      return NextResponse.json(
        { error: "Profile could not be updated" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedProfile[0]);  } catch (error: unknown) {
    console.error("Update profile error:", error);
    
    // Return more detailed error information in development
    const isDev = process.env.NODE_ENV === 'development';
    const errorMessage = isDev ? 
      `Failed to update profile: ${error instanceof Error ? error.message : "Unknown error"}` : 
      "Failed to update profile";
      
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}