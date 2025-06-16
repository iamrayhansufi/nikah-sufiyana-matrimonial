import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/src/db"
import { eq } from "drizzle-orm"
import { users } from "@/src/db/schema"
import { createNotification } from "@/lib/notifications"

export async function POST(request: NextRequest) {
  try {
    // Get user session to verify authentication
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ 
          error: "You must be logged in to send interest" 
        }), 
        { status: 401 }
      )
    }
    
    // Get the request body
    const body = await request.json()
    const { profileId, message } = body
    
    if (!profileId) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Profile ID is required" 
        }), 
        { status: 400 }
      )
    }
    
    // Get the current user (sender)
    const senderUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email)
    })
    
    if (!senderUser) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Sender user not found" 
        }), 
        { status: 404 }
      )
    }
    
    // Get the target user (receiver)
    const targetUser = await db.query.users.findFirst({
      where: eq(users.id, profileId)
    })
    
    if (!targetUser) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Target profile not found" 
        }), 
        { status: 404 }
      )
    }
    
    // Check if interest was already sent
    // In a real app, you might want to store interests in a separate table
    // For now, we'll just send a notification
    
    // Create notification for the target user
    const notificationText = message || `${senderUser.fullName || 'Someone'} has shown interest in your profile`
      await createNotification({
      userId: String(targetUser.id),
      type: "interest",
      message: notificationText,
      link: `/profile/${senderUser.id}`,
      metadata: {
        senderName: senderUser.fullName,
        senderId: String(senderUser.id),
      }
    })
    
    return new NextResponse(
      JSON.stringify({ 
        success: true,
        message: "Interest sent successfully" 
      }), 
      { status: 200 }
    )
    
  } catch (error) {
    console.error("Error sending interest:", error)
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to send interest" 
      }), 
      { status: 500 }
    )
  }
}
