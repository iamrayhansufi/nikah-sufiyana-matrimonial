import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth-options-redis"
import { database } from "./database-service"
import { Session } from "next-auth"

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function getAuthSession() {
  console.log('🔍 getAuthSession: Starting session validation');
  
  const session = await getServerSession(authOptions);
  if (!session) {
    console.log('❌ getAuthSession: No session found');
    return null;
  }

  // Validate session
  const userId = session?.user?.id;
  if (!userId) {
    console.log('❌ getAuthSession: No user ID in session');
    return null;
  }

  // Check if user still exists and is active
  console.log(`🔍 getAuthSession: Looking up user ${userId} in database`);
  const user = await database.users.getById(userId);

  if (!user) {
    console.log('❌ getAuthSession: User not found in database');
    return null;
  }
  
  // Update session with latest verified status from database
  if (session.user) {
    const dbVerified = user.verified === 'true' || user.verified === true || false;
    const sessionVerified = session.user.verified || false;
    
    // Log verification status discrepancies
    if (dbVerified !== sessionVerified) {
      console.log(`🔄 getAuthSession: Updating verified status from ${sessionVerified} to ${dbVerified}`);
      session.user.verified = dbVerified;
    } else {
      console.log(`✅ getAuthSession: User verified status: ${dbVerified}`);
    }
  }

  return session;
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getAuthSession();
  if (!session?.user?.id) return null;

  // Update last active timestamp
  await database.users.update(session.user.id, { 
    lastActive: new Date().toISOString() 
  }).catch(() => {}); // Ignore errors updating last active

  return session.user.id;
}

export async function generateOTP(): Promise<string> {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return false
    }

    const token = authHeader.substring(7)
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
    
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Check if it's an admin token
    return decoded.role === "admin" && decoded.adminId
  } catch (error) {
    console.error("Admin auth verification error:", error)
    return false
  }
}