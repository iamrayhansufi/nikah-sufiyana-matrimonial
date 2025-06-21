import { NextResponse } from 'next/server';
import { database } from '@/lib/database-service';

export async function GET() {
  try {
    // Simple test to verify database connection
    const userIds = await database.users.getAllUserIds();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      userCount: userIds.length 
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
