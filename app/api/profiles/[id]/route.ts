import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options-redis"
import { database } from "@/lib/database-service"

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
) {  
  try {
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
    let profileId;
    try {
      profileId = (await params).id;
      if (!profileId) {
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
      // Add 'user:' prefix if it doesn't exist and clean any double prefixes
    if (!profileId.startsWith('user:')) {
      profileId = `user:${profileId}`;
    }
    
    console.log(`Fetching profile for ID: ${profileId}`);
    
    // Get user from Redis
    const profile = await database.users.getById(profileId);
    
    if (!profile) {
      console.log(`Profile not found for ID: ${profileId}`);
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }
    
    console.log(`Profile found with ${Object.keys(profile).length} fields`);
    
    // Ensure the profile has the correct ID field
    if (!profile.id) {
      profile.id = profileId;
    }
    
    // Determine if the current user has shortlisted this profile
    let isShortlisted = false;
    if (session?.user?.id) {
      isShortlisted = await database.shortlists.isShortlisted(session.user.id, profileId);
    }
    
    // Check if there's an interest between the users
    let sentInterest = false;
    let receivedInterest = false;
    let interestStatus = "none";
    
    if (session?.user?.id) {
      const userSentInterests = await database.interests.getSentInterests(session.user.id);
      const userReceivedInterests = await database.interests.getReceivedInterests(session.user.id);
      
      // Check if current user has sent an interest to this profile
      sentInterest = userSentInterests.some(interest => interest.toUserId === profileId);
      
      // Check if current user has received an interest from this profile
      receivedInterest = userReceivedInterests.some(interest => interest.fromUserId === profileId);
      
      if (sentInterest && receivedInterest) {
        interestStatus = "mutual";
      } else if (sentInterest) {
        interestStatus = "sent";
      } else if (receivedInterest) {
        interestStatus = "received";
      }
    }    // Reshape the profile data to match the expected format
    const formattedProfile = {
      id: (profile.id && typeof profile.id === 'string') 
        ? profile.id.replace('user:', '') 
        : profileId.replace('user:', ''), // Remove user: prefix for cleaner URLs
      name: profile.fullName || profile.name || 'Unknown', // Map fullName to name for frontend compatibility
      fullName: profile.fullName || profile.name || 'Unknown',
      age: profile.age,
      gender: profile.gender,
      email: profile.email,
      countryCode: profile.countryCode,
      whatsappNumber: profile.whatsappNumber,
      country: profile.country,
      city: profile.city,
      address: profile.address,
      location: profile.location,
      education: profile.education,
      educationDetails: profile.educationDetails,
      profession: profile.profession,
      jobTitle: profile.jobTitle,
      income: profile.income,
      sect: profile.sect,
      height: profile.height,      complexion: profile.complexion,
      maritalStatus: profile.maritalStatus,
      maritalStatusOther: profile.maritalStatusOther,
      marriageTimeline: profile.marriageTimeline,// Handle profile photo - check multiple possible field names and provide fallback
      profilePhoto: (() => {
        // Priority: profilePhoto -> first photo from photos array -> image -> fallback
        if (profile.profilePhoto) return profile.profilePhoto;
        if (profile.photos) {
          // Handle both cases: JSON string or already parsed array
          let photosArray;
          if (typeof profile.photos === 'string') {
            try {
              photosArray = JSON.parse(profile.photos);
            } catch (e) {
              console.warn('Error parsing photos field:', e);
              return profile.image || '/placeholder-user.jpg';
            }
          } else if (Array.isArray(profile.photos)) {
            photosArray = profile.photos;
          }
          
          if (Array.isArray(photosArray) && photosArray.length > 0) {
            return photosArray[0]; // Use first photo as profile photo
          }
        }
        return profile.image || '/placeholder-user.jpg';
      })(),      image: (() => {
        // Same logic as profilePhoto for compatibility
        if (profile.profilePhoto) return profile.profilePhoto;
        if (profile.photos) {
          // Handle both cases: JSON string or already parsed array
          let photosArray;
          if (typeof profile.photos === 'string') {
            try {
              photosArray = JSON.parse(profile.photos);
            } catch (e) {
              console.warn('Error parsing photos field:', e);
              return profile.image || '/placeholder-user.jpg';
            }
          } else if (Array.isArray(profile.photos)) {
            photosArray = profile.photos;
          }
          
          if (Array.isArray(photosArray) && photosArray.length > 0) {
            return photosArray[0];
          }
        }
        return profile.image || '/placeholder-user.jpg';
      })(),profilePhotos: (() => {
        // Return all photos from the photos field or profilePhotos field
        if (profile.photos) {
          // Handle both cases: JSON string or already parsed array
          if (typeof profile.photos === 'string') {
            try {
              const photosArray = JSON.parse(profile.photos);
              if (Array.isArray(photosArray)) {
                return photosArray;
              }
            } catch (e) {
              console.warn('Error parsing photos field:', e);
            }
          } else if (Array.isArray(profile.photos)) {
            return profile.photos;
          }
        }
        if (profile.profilePhotos) {
          // Handle both cases: JSON string or already parsed array
          if (typeof profile.profilePhotos === 'string') {
            try {
              return JSON.parse(profile.profilePhotos);
            } catch (e) {
              console.warn('Error parsing profilePhotos field:', e);
            }
          } else if (Array.isArray(profile.profilePhotos)) {
            return profile.profilePhotos;
          }
        }
        return [];
      })(),
      aboutMe: profile.aboutMe,
      familyDetails: profile.familyDetails,
      fatherName: profile.fatherName,
      fatherOccupation: profile.fatherOccupation,
      fatherMobile: profile.fatherMobile,
      motherName: profile.motherName,
      motherOccupation: profile.motherOccupation,
      motherMobile: profile.motherMobile,
      housingStatus: profile.housingStatus,
      siblings: profile.siblings,
      brotherInLaws: profile.brotherInLaws,
      maternalPaternal: profile.maternalPaternal,
      religiousInclination: profile.religiousInclination,
      preferredAgeMin: profile.preferredAgeMin,
      preferredAgeMax: profile.preferredAgeMax,
      preferredEducation: profile.preferredEducation,
      preferredLocation: profile.preferredLocation,
      preferredOccupation: profile.preferredOccupation,
      preferredHeight: profile.preferredHeight,
      preferredComplexion: profile.preferredComplexion,
      preferredMaslak: profile.preferredMaslak,
      expectations: profile.expectations,
      motherTongue: profile.motherTongue,
      premium: profile.premium === "true" || profile.premium === true,
      verified: profile.verified === "true" || profile.verified === true,
      lastActive: profile.lastActive,
      bio: profile.bio || profile.aboutMe,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      
      // Privacy settings
      showContactInfo: profile.showContactInfo !== undefined ? 
        (profile.showContactInfo === 'true' || profile.showContactInfo === true) : true,
      showPhotos: profile.showPhotos !== undefined ? 
        (profile.showPhotos === 'true' || profile.showPhotos === true) : true,
      hideProfile: profile.hideProfile !== undefined ? 
        (profile.hideProfile === 'true' || profile.hideProfile === true) : false,
      showOnlineStatus: profile.showOnlineStatus !== undefined ? 
        (profile.showOnlineStatus === 'true' || profile.showOnlineStatus === true) : true,
      showFatherNumber: profile.showFatherNumber !== undefined ? 
        (profile.showFatherNumber === 'true' || profile.showFatherNumber === true) : false,
      showMotherNumber: profile.showMotherNumber !== undefined ? 
        (profile.showMotherNumber === 'true' || profile.showMotherNumber === true) : false,
      mobileNumber: profile.mobileNumber,
      
      // Interaction details
      isShortlisted,
      interestStatus,
    };
    
    return NextResponse.json(formattedProfile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    )
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
    }
    
    const { id: paramId } = await params
    
    // Add 'user:' prefix if it doesn't exist
    let userId = paramId;
    if (!userId.startsWith('user:')) {
      userId = `user:${userId}`;
    }
    
    console.log(`🔍 PATCH request details:`);
    console.log(`  - Parameter ID: ${paramId}`);
    console.log(`  - Processed User ID: ${userId}`);
    console.log(`  - Session User ID: ${session?.user?.id}`);
    
    console.log(`🔍 Attempting to fetch profile ID: ${userId}`);
    
    // Check if user exists in Redis
    const existingUser = await database.users.getById(userId);
    
    if (!existingUser) {
      console.log(`❌ Invalid profile ID: ${userId}`);
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }
    
    console.log(`✅ User found: ${Object.keys(existingUser).length} fields`);
    console.log(`🔍 User ${session?.user?.id || 'anonymous'} is updating profile ${userId}`);
      
    // Only allow users to update their own profile
    if (session && session.user && session.user.id !== userId) {
      console.error(`❌ Unauthorized update attempt: ${session.user.id} trying to update ${userId}`);
      return NextResponse.json(
        { error: "You can only update your own profile" },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    console.log("📨 Request body received:", JSON.stringify(body, null, 2));
    
    // Validate the request body
    if (!body || typeof body !== 'object') {
      console.error("❌ Invalid request body:", body);
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    
    // Log incoming height and complexion values for debugging
    if (body.height !== undefined) {
      console.log(`📏 Received height: '${body.height}' (type: ${typeof body.height})`);
    }
    if (body.complexion !== undefined) {
      console.log(`🎨 Received complexion: '${body.complexion}' (type: ${typeof body.complexion})`);
    }
    if (body.preferredHeight !== undefined) {
      console.log(`📏 Received preferredHeight: '${body.preferredHeight}' (type: ${typeof body.preferredHeight})`);
    }
    if (body.preferredComplexion !== undefined) {
      console.log(`🎨 Received preferredComplexion: '${body.preferredComplexion}' (type: ${typeof body.preferredComplexion})`);
    }
    if (body.fatherOccupation !== undefined) {
      console.log(`👨‍💼 Received fatherOccupation: '${body.fatherOccupation}' (type: ${typeof body.fatherOccupation})`);
    }
    
    // Prepare update data
    const updateData = {
      // Basic Info
      fullName: body.fullName || existingUser.fullName,
      age: body.age !== undefined ? body.age : existingUser.age,
      gender: body.gender || existingUser.gender,
      email: body.email || existingUser.email,
      countryCode: body.countryCode || existingUser.countryCode,
      whatsappNumber: body.whatsappNumber || existingUser.whatsappNumber,
      location: body.location || existingUser.location,
      education: body.education || existingUser.education,
      profession: body.profession || existingUser.profession,      maritalStatus: body.maritalStatus || existingUser.maritalStatus,
      maritalStatusOther: body.maritalStatusOther || existingUser.maritalStatusOther,
      marriageTimeline: body.marriageTimeline || existingUser.marriageTimeline,
      sect: body.sect || existingUser.sect,
      height: body.height !== undefined ? (body.height === '' ? null : body.height) : existingUser.height,
      complexion: body.complexion !== undefined ? (body.complexion === '' ? null : body.complexion) : existingUser.complexion,
      aboutMe: body.aboutMe || existingUser.aboutMe,
      city: body.city || existingUser.city,
      country: body.country || existingUser.country,
      address: body.address || existingUser.address,
      
      // Religious info
      religiousInclination: body.religiousInclination || existingUser.religiousInclination,
      
      // Family info
      familyDetails: body.familyDetails || existingUser.familyDetails,
      fatherName: body.fatherName || existingUser.fatherName,
      fatherOccupation: body.fatherOccupation !== undefined ? body.fatherOccupation : existingUser.fatherOccupation,
      motherName: body.motherName || existingUser.motherName,
      motherOccupation: body.motherOccupation !== undefined ? body.motherOccupation : existingUser.motherOccupation,
      siblings: body.siblings ? (Array.isArray(body.siblings) ? JSON.stringify(body.siblings) : body.siblings) : existingUser.siblings,
      brotherInLaws: body.brotherInLaws ? (Array.isArray(body.brotherInLaws) ? JSON.stringify(body.brotherInLaws) : body.brotherInLaws) : existingUser.brotherInLaws,
      maternalPaternal: body.maternalPaternal ? (Array.isArray(body.maternalPaternal) ? JSON.stringify(body.maternalPaternal) : body.maternalPaternal) : existingUser.maternalPaternal,
      housingStatus: body.housingStatus || existingUser.housingStatus,
      
      // Education & Career
      educationDetails: body.educationDetails || existingUser.educationDetails,
      income: body.income || existingUser.income,
      jobTitle: body.jobTitle || existingUser.jobTitle,
      
      // Partner preferences
      preferredAgeMin: body.preferredAgeMin !== undefined ? body.preferredAgeMin : existingUser.preferredAgeMin,
      preferredAgeMax: body.preferredAgeMax !== undefined ? body.preferredAgeMax : existingUser.preferredAgeMax,
      preferredEducation: body.preferredEducation || existingUser.preferredEducation,
      preferredLocation: body.preferredLocation || existingUser.preferredLocation,
      preferredOccupation: body.preferredOccupation || existingUser.preferredOccupation,
      preferredHeight: body.preferredHeight !== undefined ? (body.preferredHeight === '' ? null : body.preferredHeight) : existingUser.preferredHeight,
      preferredComplexion: body.preferredComplexion !== undefined ? (body.preferredComplexion === '' ? null : body.preferredComplexion) : existingUser.preferredComplexion,
      preferredMaslak: body.preferredMaslak || existingUser.preferredMaslak,
      expectations: body.expectations || existingUser.expectations,
      
      // Privacy settings
      showContactInfo: body.showContactInfo !== undefined ? body.showContactInfo : existingUser.showContactInfo,
      showPhotos: body.showPhotos !== undefined ? body.showPhotos : existingUser.showPhotos,
      hideProfile: body.hideProfile !== undefined ? body.hideProfile : existingUser.hideProfile,
      showOnlineStatus: body.showOnlineStatus !== undefined ? body.showOnlineStatus : existingUser.showOnlineStatus,
      showFatherNumber: body.showFatherNumber !== undefined ? body.showFatherNumber : existingUser.showFatherNumber,
      showMotherNumber: body.showMotherNumber !== undefined ? body.showMotherNumber : existingUser.showMotherNumber,
      fatherMobile: body.fatherMobile || existingUser.fatherMobile,
      motherMobile: body.motherMobile || existingUser.motherMobile,
      mobileNumber: body.mobileNumber || existingUser.mobileNumber,
        // Update timestamp
      updatedAt: new Date().toISOString(),
    };
    
    console.log("🔍 Update data prepared:", JSON.stringify(updateData, null, 2));
    
    // Validate updateData before sending to Redis
    const dataKeys = Object.keys(updateData);
    const dataValues = Object.values(updateData);
    
    console.log(`📊 Update data stats: ${dataKeys.length} fields`);
    console.log(`📊 Data types:`, dataValues.map(v => typeof v));
    
    // Check for any problematic values
    const problematicFields = [];
    for (const [key, value] of Object.entries(updateData)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        problematicFields.push({ key, type: typeof value, value });
      }
    }
    
    if (problematicFields.length > 0) {
      console.warn("⚠️ Potentially problematic fields:", problematicFields);
    }

    // Update user profile in Redis
    console.log("🔄 Attempting to update user in database with data:", JSON.stringify(updateData, null, 2));
    
    const success = await database.users.update(userId, updateData);
    
    console.log("✅ Database update result:", success);
    
    if (!success) {
      console.error("❌ Database update returned false");
      return NextResponse.json(
        { error: "Profile could not be updated" },
        { status: 500 }
      );
    }
    
    // Fetch the updated user data
    console.log("🔄 Fetching updated user data...");
    const updatedUser = await database.users.getById(userId);
    
    console.log("✅ Updated user data fetched:", updatedUser ? "Success" : "Failed");
    
    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    console.error("❌ Update profile error details:", error);
    console.error("❌ Error stack:", error instanceof Error ? error.stack : "No stack available");
    
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