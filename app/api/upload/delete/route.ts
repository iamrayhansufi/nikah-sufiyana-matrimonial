import { type NextRequest, NextResponse } from "next/server"
import { unlink } from "fs/promises"
import { join } from "path"
import { getAuthSession } from "@/lib/auth"

export async function DELETE(request: NextRequest) {
  try {
    // Verify user authentication using NextAuth session
    const session = await getAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    // Extract the file path from the URL
    // URL format: /uploads/gallery/filename or /uploads/profiles/filename
    const urlPath = url.startsWith('/') ? url.substring(1) : url
    const filePath = join(process.cwd(), "public", urlPath)

    try {
      // Delete the file
      await unlink(filePath)
    } catch (fileError) {
      // File might not exist, but that's okay for the API response
      console.warn("File not found for deletion:", filePath)
    }

    return NextResponse.json({
      message: "Image deleted successfully",
    })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    )
  }
}
