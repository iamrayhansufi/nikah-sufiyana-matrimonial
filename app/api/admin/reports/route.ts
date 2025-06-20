import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/auth"
// Temporarily disabled reports
// import { generateReport } from "@/lib/reports"

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Temporarily disabled - return mock data
    return NextResponse.json({ 
      message: "Reports temporarily disabled during migration",
      data: {
        totalUsers: 0,
        registrations: [],
        statusBreakdown: []
      }
    });
  } catch (error) {
    console.error("Reports error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

