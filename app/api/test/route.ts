import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "API is working" });
}

export async function POST(req: Request) {
  return NextResponse.json({ message: "POST request received" });
} 