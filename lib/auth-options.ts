import type { NextAuthOptions, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/src/db"
import { users } from "@/src/db/schema"
import { eq } from "drizzle-orm"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string | null
    phone?: string
  }
    interface Session {
    user: {
      id: string
      name: string
      email: string | null
      phone?: string
      role?: string
    }
  }

  interface JWT {
    id: string
    phone?: string
    role?: string
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.password || (!credentials?.email && !credentials?.phone)) {
            return null
          }
          
          let userArr;
          if (credentials.email) {
            userArr = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1)
          } else {
            userArr = await db.select().from(users).where(eq(users.phone, credentials.phone)).limit(1)
          }
          
          const user = userArr?.[0]
          if (!user) return null
          
          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) return null
          
          return {
            id: user.id.toString(),
            name: user.fullName,
            email: user.email,
            phone: user.phone
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {    async jwt({ token, user }: { token: JWT, user: User | null }) {
      if (user) {
        token.id = user.id
        token.phone = user.phone
        // Assuming the role is part of the user object from authorize callback
        token.role = (user as any).role
      }
      return token
    },    async session({ session, token }: { session: any, token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.phone = token.phone as string | undefined
        session.user.role = token.role
      }
      return session
    }
  }
}
