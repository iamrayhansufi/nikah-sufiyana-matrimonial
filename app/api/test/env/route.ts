import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'NOT_SET',
    apiKey: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT_SET',
    apiSecret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT_SET',
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('CLOUDINARY')),
  });
}
