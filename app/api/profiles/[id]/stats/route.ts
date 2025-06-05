import { NextRequest, NextResponse } from "next/server";
import { getUserStatsById } from "@/lib/database";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    // Fetch stats for the user (implement getUserStatsById in lib/database.ts)
    const stats = await getUserStatsById(id);
    if (!stats) {
      return NextResponse.json({ error: "Stats not found" }, { status: 404 });
    }
    return NextResponse.json(stats);
  } catch (error) {
    console.error("User stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
