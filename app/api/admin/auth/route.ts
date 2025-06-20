import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis-client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

interface RedisAdminUser {
  [key: string]: string;
  id: string;
  email: string;
  password: string;
  role: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    // Find admin by email
    const adminKeys = await redis.keys("admin:*")
    let admin: RedisAdminUser | null = null

    for (const key of adminKeys) {
      const adminUser = await redis.hgetall(key) as RedisAdminUser
      if (adminUser && adminUser.email === email) {
        admin = adminUser
        break
      }
    }

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Compare password
    const isValid = await bcrypt.compare(password, admin.password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create JWT
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        email: admin.email, 
        role: admin.role 
      }, 
      JWT_SECRET, 
      { expiresIn: "24h" }
    )

    return new NextResponse(
      JSON.stringify({ 
        token, 
        admin: { 
          id: admin.id, 
          email: admin.email, 
          role: admin.role 
        } 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    )
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
