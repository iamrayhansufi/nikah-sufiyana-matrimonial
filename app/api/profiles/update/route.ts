import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { redis } from "@/lib/redis-client";
import { authOptions } from "@/lib/auth-options-redis";

interface UpdateData {
  [key: string]: string | number | boolean | string[] | undefined;
}

interface RedisUser {
  [key: string]: string;
}

const updateProfileSchema = z.object({
  // Basic Info
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  age: z.number().min(18).optional(),
  gender: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),  complexion: z.string().optional(),
  maritalStatus: z.string().optional(),
  marriageTimeline: z.string().optional(),
  languages: z.array(z.string()).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
  
  // Religious Info
  sect: z.string().optional(),
  prayerHabit: z.string().optional(),
  hijab: z.string().optional(),
  quranReading: z.string().optional(),
  islamicEducation: z.string().optional(),
  religiousValues: z.string().optional(),
  attendsMosque: z.string().optional(),
  
  // Education & Career
  education: z.string().optional(),
  university: z.string().optional(),
  profession: z.string().optional(),
  company: z.string().optional(),
  experience: z.string().optional(),
  income: z.string().optional(),
  
  // Family Info
  fatherOccupation: z.string().optional(),
  motherOccupation: z.string().optional(),
  siblings: z.string().optional(),
  familyType: z.string().optional(),
  familyValues: z.string().optional(),
  livingWithParents: z.string().optional(),
  
  // Partner Preferences
  partnerAge: z.string().optional(),
  partnerHeight: z.string().optional(),
  partnerMaritalStatus: z.string().optional(),
  partnerCity: z.string().optional(),
  partnerState: z.string().optional(),
  partnerCountry: z.string().optional(),
  partnerEducation: z.string().optional(),
  partnerProfession: z.string().optional(),
  partnerIncome: z.string().optional(),
  partnerExpectations: z.string().optional(),
  
  // Photos
  photos: z.array(z.string()).optional(),
  mainPhotoUrl: z.string().optional(),

  // Additional Info
  birthDate: z.string().optional(),
  birthPlace: z.string().optional(),
  motherTongue: z.string().optional(),
  hobbies: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  dietaryPreferences: z.string().optional(),
  drinkingHabits: z.string().optional(),
  smokingHabits: z.string().optional(),

  // Contact Info
  fatherMobile: z.string().optional(),
  fatherName: z.string().optional(),
  motherMobile: z.string().optional(),
  motherName: z.string().optional(),
  
  // Profile State
  isVerified: z.boolean().optional(),
  isComplete: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  
  // Subscription
  subscriptionPlan: z.string().optional(),
  subscriptionStartDate: z.string().optional(),
  subscriptionEndDate: z.string().optional(),
  
  // Privacy Settings
  showContactInfo: z.boolean().optional(),
  showPhotos: z.boolean().optional(),
  hideProfile: z.boolean().optional(),
  showOnlineStatus: z.boolean().optional(),
  showFatherNumber: z.boolean().optional(),
  showMotherNumber: z.boolean().optional(),
  mobileNumber: z.string().optional(),
  
  // Profile Photos
  profilePhotos: z.array(z.string()).optional(),
});

function parseArrayField(field: string | undefined, defaultValue: string[] = []): string[] {
  if (!field) return defaultValue;
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch {
    return defaultValue;
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    // Get current user data
    const userKey = `user:${userId}`;
    const currentUser = (await redis.hgetall(userKey)) as RedisUser;
    
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update only the fields that are provided
    const updateData: UpdateData = { ...validatedData };
    const redisData: Record<string, string> = {};
    
    // Convert data for Redis storage
    Object.entries(updateData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        redisData[key] = JSON.stringify(value);
      } else if (value !== undefined) {
        redisData[key] = String(value);
      }
    });

    // Update the user data in Redis
    await redis.hmset(userKey, redisData);

    // Prepare response data
    const responseData = {
      ...currentUser,
      ...updateData,
      // Parse arrays from Redis strings
      languages: updateData.languages || parseArrayField(currentUser.languages),
      hobbies: updateData.hobbies || parseArrayField(currentUser.hobbies),
      interests: updateData.interests || parseArrayField(currentUser.interests),
      photos: updateData.photos || parseArrayField(currentUser.photos),
    };

    return NextResponse.json({ 
      message: "Profile updated successfully",
      data: responseData
    });
  } catch (error) {
    console.error("Profile update error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}