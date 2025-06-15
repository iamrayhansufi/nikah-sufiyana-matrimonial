import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { sql } from "drizzle-orm";
import { users } from "@/src/db/schema";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("Starting database connection test");
    
    // Test 1: Basic SQL query
    console.log("Test 1: Basic SQL query");
    const basicResult = await db.execute(sql`SELECT 1 as test`);
    console.log("Basic query result:", basicResult);

    // Test 2: Check if users table exists and has records
    console.log("Test 2: Query users table");
    const usersResult = await db.select({ 
      count: sql`count(*)` 
    }).from(users);
    console.log("Users table query result:", usersResult);
    
    // Test 3: Check connection configuration
    console.log("Test 3: Connection config");
    const connectionInfo = {
      dbUrl: process.env.POSTGRES_URL ? "Available" : "Not Available",
      fallbackUrl: process.env.DATABASE_URL ? "Available" : "Not Available",
      nodeEnv: process.env.NODE_ENV || "Not Set"
    };
    
    return NextResponse.json({
      status: "success",
      message: "All database tests passed",
      tests: {
        basicQuery: {
          success: true,
          result: basicResult
        },
        usersTable: {
          success: true,
          count: usersResult[0]?.count || 0
        },
        connectionInfo
      }
    });
  } catch (error: any) {
    console.error("Database test error:", error);
    
    let errorInfo: any = {
      message: error?.message || String(error),
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    };
    
    if (error?.code) {
      errorInfo.code = error.code;
    }
    
    return NextResponse.json({
      status: "error",
      message: "Database connection failed",
      error: errorInfo,
      connectionInfo: {
        dbUrl: process.env.POSTGRES_URL ? "Available" : "Not Available",
        fallbackUrl: process.env.DATABASE_URL ? "Available" : "Not Available",
        nodeEnv: process.env.NODE_ENV || "Not Set"
      }
    }, { status: 500 });
  }
}
