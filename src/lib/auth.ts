import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options-redis"

export async function verifyAuth(req: Request): Promise<number | null> {
  const session = await getServerSession(authOptions)
  return session?.user?.id ? parseInt(session.user.id) : null
}

// NextAuth handles token generation and cookie management automatically