import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { NextRequest } from "next/server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth-options"

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function getAuthSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getAuthSession()
  return session?.user?.id || null
}

export async function generateOTP(): Promise<string> {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function verifyAdminAuth(request: NextRequest){
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return false
  }
  // Assuming you store the role in the session
  return (session as any).user.role === "admin"
}