import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Test a simple DB query
    const result = await db.execute(sql`SELECT 1 as test`);
    
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      result
    });  } catch (error: any) {
    console.error("Database test error:", error);
    
    return NextResponse.json({
      status: "error",
      message: "Database connection failed",
      error: error?.message || String(error)
    }, { status: 500 });
  }
}
