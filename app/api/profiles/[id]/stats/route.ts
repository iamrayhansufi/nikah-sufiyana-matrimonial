import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";

interface RedisUser {
  [key: string]: string;
  id: string;
  profileViews: string;
}

interface RedisInterest {
  [key: string]: string;
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Check if user exists
    const userData = await redis.hgetall(`user:${id}`);
    if (!userData || Object.keys(userData).length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const user = userData as RedisUser;

    // Get interests for user
    const interestKeys = await redis.keys("interest:*");
    const interestPromises = interestKeys.map(async key => {
      const interest = await redis.hgetall(key);
      return interest && Object.keys(interest).length > 0 ? interest as RedisInterest : null;
    });
    
    const interestResults = await Promise.all(interestPromises);
    const interests = interestResults.filter((i): i is RedisInterest => i !== null);

    // Calculate stats
    const stats = {
      totalInterestsReceived: interests.filter(i => i.receiverId === id).length,
      totalInterestsSent: interests.filter(i => i.senderId === id).length,
      acceptedInterests: interests.filter(i => 
        (i.senderId === id || i.receiverId === id) && 
        i.status === "accepted"
      ).length,
      rejectedInterests: interests.filter(i => 
        (i.senderId === id || i.receiverId === id) && 
        i.status === "rejected"
      ).length,
      pendingInterests: interests.filter(i => 
        (i.senderId === id || i.receiverId === id) && 
        i.status === "pending"
      ).length,
      profileViews: parseInt(user.profileViews || "0"),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error getting user stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
