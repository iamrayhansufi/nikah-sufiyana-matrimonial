import type { NextAuthOptions } from "next-auth"
import type { Session, User } from "next-auth"
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
    role?: string
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
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NEXTAUTH_COOKIE_DOMAIN || undefined
      }
    },
    callbackUrl: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    },
    csrfToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Host-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  },
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
            phone: user.phone,
            role: 'user' // Default to 'user' until the migration is applied
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],  callbacks: {
    async redirect({ url, baseUrl }) {
      // If the URL is relative, make it absolute with baseUrl
      if (url.startsWith('/')) {
        url = new URL(url, baseUrl).toString()
      }
      
      // Allow redirects to dashboard and other internal pages
      const allowedUrls = [
        baseUrl,
        `${baseUrl}/dashboard`,
        `${baseUrl}/edit-profile`,
        `${baseUrl}/settings`,
        `${baseUrl}/browse`,
        ...(process.env.NEXTAUTH_PREVIEW_URLS || '').split(',').filter(Boolean)
      ]
      
      // Check if the URL is allowed
      if (allowedUrls.some(allowed => url.startsWith(allowed))) {
        return url
      }
      
      // Default redirect to dashboard for authenticated users
      return `${baseUrl}/dashboard`
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.phone = user.phone
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.phone = token.phone as string | undefined
        session.user.role = token.role as string | undefined
      }
      return session
    }
  },
  events: {
    async signIn({ user }) {
      if (user.id) {
        await db
          .update(users)
          .set({ lastActive: new Date() })
          .where(eq(users.id, parseInt(user.id)))
          .execute()
      }
    }
  }
}
