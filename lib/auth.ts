import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth-options"
import { db } from "@/src/db"
import { users } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import { Session } from "next-auth"

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  // Validate session
  const userId = session?.user?.id;
  if (!userId) return null;

  // Check if user still exists and is active
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(userId)))
    .limit(1);

  if (!user || user.length === 0) return null;

  return session;
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getAuthSession();
  if (!session?.user?.id) return null;

  // Update last active timestamp
  await db
    .update(users)
    .set({ lastActive: new Date() })
    .where(eq(users.id, parseInt(session.user.id)))
    .execute()
    .catch(() => {}); // Ignore errors updating last active

  return session.user.id;
}

export async function generateOTP(): Promise<string> {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return false
  }
  
  return session.user.role === "admin"
}