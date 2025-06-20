import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options-redis";
import { database } from "@/lib/database-service";
import { redis } from "@/lib/redis-client";

const interestSchema = z.object({
  toUserId: z.string(),
  message: z.string().optional(),
});

async function verifyAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const profileId = searchParams.get("profileId");

    // If a specific type is provided, return only that type
    if (type === "received" || type === "sent") {
      let interests = [];
      
      if (type === "received") {
        // Get received interests
        interests = await database.interests.getReceivedInterests(userId);
        
        // For each interest, fetch the sender's info
        for (const interest of interests) {
          const fromUser = await database.users.getById(interest.fromUserId);
          if (fromUser) {
            interest.fromUser = {
              id: fromUser.id,
              fullName: fromUser.fullName,
              age: fromUser.age,
              location: fromUser.location,
              profession: fromUser.profession,
              profilePhoto: fromUser.profilePhoto,
            };
          }
        }
      } else {
        // Get sent interests
        interests = await database.interests.getSentInterests(userId);
        
        // For each interest, fetch the recipient's info
        for (const interest of interests) {
          const toUser = await database.users.getById(interest.toUserId);
          if (toUser) {
            interest.toUser = {
              id: toUser.id,
              fullName: toUser.fullName,
              age: toUser.age,
              location: toUser.location,
              profession: toUser.profession,
              profilePhoto: toUser.profilePhoto,
            };
          }
        }
      }
      
      // Sort by createdAt date
      interests.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      return NextResponse.json(interests);
    }
    
    // If a profile ID is provided, check for interests between the current user and that profile
    else if (profileId) {
      // Add 'user:' prefix if it doesn't exist
      let targetProfileId = profileId;
      if (!targetProfileId.startsWith('user:')) {
        targetProfileId = `user:${targetProfileId}`;
      }
      
      // Get interests sent by current user to the profile
      const sentInterests = await database.interests.getSentInterests(userId);
      const filteredSentInterests = sentInterests.filter(interest => 
        interest.toUserId === targetProfileId
      );
      
      // Get interests received by current user from the profile
      const receivedInterests = await database.interests.getReceivedInterests(userId);
      const filteredReceivedInterests = receivedInterests.filter(interest => 
        interest.fromUserId === targetProfileId
      );
      
      return NextResponse.json({
        sentInterests: filteredSentInterests,
        receivedInterests: filteredReceivedInterests
      });
    }
    
    // If no specific type or profile ID provided, return all interests for the user
    else {
      // Get all sent and received interests
      const sentInterests = await database.interests.getSentInterests(userId);
      const receivedInterests = await database.interests.getReceivedInterests(userId);
      
      // Combine all interests
      const allInterests = [...sentInterests, ...receivedInterests];
      
      // Sort by createdAt date
      allInterests.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      return NextResponse.json(allInterests);
    }
  } catch (error) {
    console.error("Get interests error:", error);
    return NextResponse.json(
      { error: "Failed to get interests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { toUserId, message } = interestSchema.parse(body);

    // Add 'user:' prefix to toUserId if not present
    let targetUserId = toUserId;
    if (!targetUserId.startsWith('user:')) {
      targetUserId = `user:${toUserId}`;
    }

    // Check if target user exists
    const targetUser = await database.users.getById(targetUserId);
    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    // Check if interest already exists
    const sentInterests = await database.interests.getSentInterests(userId);
    const existingInterest = sentInterests.find(interest => interest.toUserId === targetUserId);

    if (existingInterest) {
      return NextResponse.json(
        { error: "Interest already sent" },
        { status: 400 }
      );
    }

    // Create new interest
    const interestData = {
      fromUserId: userId,
      toUserId: targetUserId,
      message: message || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    
    const interestId = await database.interests.create(interestData);

    return NextResponse.json({
      message: "Interest sent successfully",
      interest: { id: interestId, ...interestData },
    });
  } catch (error) {
    console.error("Send interest error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to send interest" },
      { status: 500 }
    );
  }
}
