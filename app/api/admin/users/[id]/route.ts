import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/auth"
import { getUserById, updateUserProfile, deleteUser } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminUser = await verifyAdminAuth(request)
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserById(params.id)
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminUser = await verifyAdminAuth(request)
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, ...updateData } = body

    let result
    switch (action) {
      case "approve":
        result = await updateUserProfile(params.id, {
          profileStatus: "approved",
          approvedAt: new Date(),
          approvedBy: adminUser.id,
        })
        break
      case "reject":
        result = await updateUserProfile(params.id, {
          profileStatus: "rejected",
          rejectedAt: new Date(),
          rejectedBy: adminUser.id,
          rejectionReason: updateData.reason,
        })
        break
      case "suspend":
        result = await updateUserProfile(params.id, {
          profileStatus: "suspended",
          suspendedAt: new Date(),
          suspendedBy: adminUser.id,
          suspensionReason: updateData.reason,
        })
        break
      case "update":
        result = await updateUserProfile(params.id, updateData)
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Update user API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminUser = await verifyAdminAuth(request)
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteUser(params.id)
    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
