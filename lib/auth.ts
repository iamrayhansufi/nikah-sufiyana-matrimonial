import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateJWT(userId: string, role = "user"): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyJWT(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
  } catch (error) {
    return null
  }
}

export async function generateOTP(): Promise<string> {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function verifyAdminAuth(request: NextRequest){
  const token = request.headers.get("Authorization")?.split(" ")[1]
  if (!token) {
    return false
  }
  const decoded = verifyJWT(token)
  return decoded?.role === "admin"
}