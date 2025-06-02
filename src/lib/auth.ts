import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function verifyAuth(req: Request): Promise<number | null> {
  try {
    // Check for token in Authorization header
    const authHeader = req.headers.get("authorization");
    let token = authHeader?.split(" ")[1];

    // If no token in header, check cookies
    if (!token) {
      const cookieStore = await cookies();
      const authCookie = cookieStore.get("auth-token");
      token = authCookie?.value;
    }

    if (!token) {
      return null;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  });
} 