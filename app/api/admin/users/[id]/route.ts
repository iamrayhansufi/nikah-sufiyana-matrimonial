import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/auth"
import { redis } from "@/lib/redis-client"

interface RedisUser {
  [key: string]: string;
  id: string;
  email: string;
  password: string;  // Redis will return empty string if not present
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdminAuth(request)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const userKey = `user:${id}`
    const user = await redis.hgetall(userKey) as RedisUser

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove sensitive information
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Get user API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdminAuth(request)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const userKey = `user:${id}`
    const user = await redis.hgetall(userKey) as RedisUser

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const updates = await request.json()
    await redis.hmset(userKey, updates)

    const updatedUser = await redis.hgetall(userKey) as RedisUser
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Update user API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdminAuth(request)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const userKey = `user:${id}`
    const user = await redis.hgetall(userKey) as RedisUser

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete user-related data
    await Promise.all([
      redis.del(userKey),
      redis.del(`notifications:${id}`),
      redis.del(`interests:${id}`),
      redis.del(`sent_interests:${id}`),
      redis.del(`received_interests:${id}`),
      redis.del(`subscription:${id}`)
    ])

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
