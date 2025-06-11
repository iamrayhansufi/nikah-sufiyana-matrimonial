import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/src/db"
import { users } from "@/src/db/schema"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication using NextAuth session
    const session = await getAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const formData = await request.formData()
    const file = formData.get("image") as File
    const type = formData.get("type") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create upload directory based on type
    const uploadSubDir = type === 'profile' ? 'profiles' : 'gallery'
    const uploadDir = join(process.cwd(), "public", "uploads", uploadSubDir)
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `${userId}_${timestamp}.${extension}`
    const filepath = join(uploadDir, filename)

    // Save file
    await writeFile(filepath, buffer)

    // Generate URL
    const photoUrl = `/uploads/${uploadSubDir}/${filename}`

    // If it's a profile photo, update the user's profile photo field
    if (type === 'profile') {
      await db
        .update(users)
        .set({ profilePhoto: photoUrl })
        .where(eq(users.id, parseInt(userId)))
    }

    return NextResponse.json({
      message: "Image uploaded successfully",
      url: photoUrl,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}
