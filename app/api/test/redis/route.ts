import { NextResponse } from "next/server";
import { redis } from "@/lib/redis-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options-redis";

export async function GET() {
  try {
    // Test basic Redis connection
    await redis.ping();
    
    // Test Redis operations
    const testKey = `test:${Date.now()}`;
    await redis.set(testKey, "connection test");
    const testResult = await redis.get(testKey);
    await redis.del(testKey);
    
    // Get session if available
    const session = await getServerSession(authOptions);
    
    let userTest = null;
    if (session?.user?.id) {
      try {
        userTest = await redis.hgetall(session.user.id);
      } catch (e) {
        userTest = { error: "Failed to get user data" };
      }
    }
    
    return NextResponse.json({
      status: "success",
      redis: {
        ping: "✅ Success",
        setGet: testResult === "connection test" ? "✅ Success" : "❌ Failed",
        timestamp: new Date().toISOString()
      },
      session: session ? {
        userId: session.user?.id,
        userFound: userTest && Object.keys(userTest).length > 0,
        userFields: userTest ? Object.keys(userTest).length : 0
      } : null
    });
    
  } catch (error) {
    console.error("Redis test failed:", error);
    return NextResponse.json({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
