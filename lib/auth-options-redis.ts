import type { NextAuthOptions } from "next-auth"
import type { Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { redis, redisTables } from "./redis-client"
import { RedisAdapter } from "./redis-adapter"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string | null
    phone?: string
    role?: string
    verified?: boolean
  }
  
  interface Session {
    user: {
      id: string
      name: string
      email: string | null
      phone?: string
      role?: string
      verified?: boolean
    }
  }

  interface JWT {
    id: string
    phone?: string
    role?: string
    verified?: boolean
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: RedisAdapter() as any, // Cast to any to bypass TypeScript errors until proper type definitions are added
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
    newUser: "/register",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.log("Missing email or password")
          throw new Error("Missing email or password")
        }

        try {
          const user = await redisTables.users.findByEmail(credentials.email)
          
          if (!user) {
            console.log(`User not found: ${credentials.email}`)
            throw new Error("User not found")
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          
          if (!isPasswordValid) {
            console.log(`Invalid password for user: ${credentials.email}`)
            throw new Error("Invalid password")
          }
          
          // Update last active timestamp
          await redisTables.users.update(user.id, {
            lastActive: new Date().toISOString(),
          })
          
          // Return the user object with expected fields for NextAuth
          return {
            id: user.id,
            name: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role || 'user',
            verified: user.verified === 'true' || user.verified === true,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw new Error("Authentication failed")
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.phone = user.phone
        token.role = user.role
        token.verified = user.verified
      }
      return token
    },    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.phone = token.phone as string | undefined
        session.user.role = token.role as string | undefined
        session.user.verified = token.verified as boolean | undefined
      }
      return session
    },
  },
}

// Export a version that doesn't include the adapter for now
// until the TypeScript issues are resolved
export const authOptionsWithoutAdapter = authOptions
