import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options-redis";
import { verifyAdminAuth } from "@/lib/auth";
import { redis } from "@/lib/redis-client";
import { z } from "zod";

// Schema for premium assignment
const premiumAssignmentSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  action: z.enum(["grant", "revoke"]),
  duration: z.number().min(1).max(365).optional(), // Days
  reason: z.string().min(1, "Reason is required"),
  planType: z.enum(["premium", "premium_plus", "elite"]).optional(),
});

interface RedisUser {
  id: string;
  email: string;
  fullName: string;
  premium?: string | boolean;
  premiumExpiry?: string;
  premiumPlan?: string;
  premiumGrantedBy?: string;
  premiumGrantedAt?: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    const session = await getServerSession(authOptions);
    const adminId = session?.user?.id || "system";

    const body = await request.json();
    const { userId, action, duration = 30, reason, planType = "premium" } = premiumAssignmentSchema.parse(body);

    // Ensure userId has proper format
    const userKey = userId.startsWith('user:') ? userId : `user:${userId}`;
    
    // Get user data
    const user = await redis.hgetall(userKey) as RedisUser;
    if (!user || !user.id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let updateData: Record<string, any> = {};
    let logMessage = "";

    if (action === "grant") {
      // Calculate expiry date
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + duration);

      updateData = {
        premium: "true",
        premiumPlan: planType,
        premiumExpiry: expiryDate.toISOString(),
        premiumGrantedBy: adminId,
        premiumGrantedAt: new Date().toISOString(),
        premiumReason: reason,
        updatedAt: new Date().toISOString(),
      };

      logMessage = `Premium access granted to ${user.fullName} (${user.email}) for ${duration} days. Plan: ${planType}. Reason: ${reason}`;
    } else {
      // Revoke premium
      updateData = {
        premium: "false",
        premiumPlan: "",
        premiumExpiry: "",
        premiumRevokedBy: adminId,
        premiumRevokedAt: new Date().toISOString(),
        premiumRevocationReason: reason,
        updatedAt: new Date().toISOString(),
      };

      logMessage = `Premium access revoked for ${user.fullName} (${user.email}). Reason: ${reason}`;
    }

    // Update user in Redis
    await redis.hmset(userKey, updateData);

    // Log the action
    console.log(`🎯 Premium Management: ${logMessage}`);

    // Create audit log entry
    const auditLogId = `audit:premium:${Date.now()}:${Math.random().toString(36).substring(2, 15)}`;
    await redis.hmset(auditLogId, {
      type: "premium_management",
      adminId,
      userId: user.id,
      action,
      reason,
      planType: planType || "",
      duration: duration.toString(),
      timestamp: new Date().toISOString(),
      userEmail: user.email,
      userName: user.fullName,
    });

    // Add to audit log list
    await redis.lpush("audit_logs:premium", auditLogId);

    // Create notification for the user
    const notificationId = `notification:${Date.now()}:${Math.random().toString(36).substring(2, 15)}`;
    const notificationData = {
      userId: user.id,
      type: "premium_update",
      title: action === "grant" ? "Premium Access Granted!" : "Premium Access Updated",
      message: action === "grant" 
        ? `Congratulations! You now have ${planType} access for ${duration} days.`
        : `Your premium access has been updated. Please contact support if you have questions.`,
      read: "false",
      createdAt: new Date().toISOString(),
      metadata: JSON.stringify({ action, planType, duration, reason }),
    };

    await redis.hmset(notificationId, notificationData);
    await redis.lpush(`notifications:${user.id}`, notificationId);

    return NextResponse.json({
      success: true,
      message: `Premium ${action === "grant" ? "granted" : "revoked"} successfully`,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        premium: updateData.premium === "true",
        premiumPlan: updateData.premiumPlan || null,
        premiumExpiry: updateData.premiumExpiry || null,
      },
      auditLog: auditLogId,
    });

  } catch (error) {
    console.error("Premium management error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to manage premium access" },
      { status: 500 }
    );
  }
}

// Get premium users and audit logs
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'list';

    if (action === 'audit') {
      // Get audit logs
      const auditLogIds = await redis.lrange("audit_logs:premium", 0, 49); // Last 50 entries
      const auditLogs = [];

      for (const logId of auditLogIds) {
        const log = await redis.hgetall(logId);
        if (log && log.timestamp) {
          auditLogs.push(log);
        }
      }

      return NextResponse.json({
        auditLogs: auditLogs.sort((a, b) => {
          const timeA = typeof a.timestamp === 'string' ? a.timestamp : '';
          const timeB = typeof b.timestamp === 'string' ? b.timestamp : '';
          return new Date(timeB).getTime() - new Date(timeA).getTime();
        }),
      });
    }

    // List premium users
    const userKeys = await redis.keys("user:*");
    const premiumUsers = [];

    for (const userKey of userKeys) {
      const user = await redis.hgetall(userKey) as RedisUser;
      if (user && user.id && (user.premium === "true" || user.premium === true)) {
        premiumUsers.push({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          premium: true,
          premiumPlan: user.premiumPlan || "premium",
          premiumExpiry: user.premiumExpiry || null,
          premiumGrantedBy: user.premiumGrantedBy || null,
          premiumGrantedAt: user.premiumGrantedAt || null,
        });
      }
    }

    return NextResponse.json({
      premiumUsers: premiumUsers.sort((a, b) => 
        new Date(b.premiumGrantedAt || 0).getTime() - new Date(a.premiumGrantedAt || 0).getTime()
      ),
      total: premiumUsers.length,
    });

  } catch (error) {
    console.error("Error fetching premium data:", error);
    return NextResponse.json(
      { error: "Failed to fetch premium data" },
      { status: 500 }
    );
  }
}
