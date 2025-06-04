import { NextRequest, NextResponse } from "next/server"
import db from "../../../lib/database"
import { adminUsers } from "../../../src/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }
    // Find admin by email
    const admin = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1)
    if (!admin || admin.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
    // Compare password
    const isValid = await bcrypt.compare(password, admin[0].password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
    // Create JWT
    const token = jwt.sign({ adminId: admin[0].id, email: admin[0].email, role: admin[0].role }, JWT_SECRET, { expiresIn: "24h" })
    return new NextResponse(JSON.stringify({ token, admin: { id: admin[0].id, email: admin[0].email, role: admin[0].role } }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
