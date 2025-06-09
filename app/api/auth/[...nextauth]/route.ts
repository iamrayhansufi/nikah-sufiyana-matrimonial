import NextAuth, { AuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/src/db"
import { users } from "@/src/db/schema"
import { eq } from "drizzle-orm"

declare module "next-auth" {
  interface User {
    id: number;
    name: string;
    email: string | null;
    phone?: string;
  }
  interface Session {
    user: {
      id: number;
      name: string;
      email: string | null;
      phone?: string;
    };
  }
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET must be set in environment variables')
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.phone = token.phone as string;
      }
      return session;
    }
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.password || (!credentials?.email && !credentials?.phone)) {
          throw new Error("Missing credentials")
        }
        
        let userArr;
        if (credentials.email) {
          userArr = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1)
        } else {
          userArr = await db.select().from(users).where(eq(users.phone, credentials.phone)).limit(1)
        }
        
        const user = userArr?.[0]
        if (!user) return null;
        
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null;
        
        return { 
          id: user.id, 
          name: user.fullName, 
          email: user.email,
          phone: user.phone
        }
      }
    })
  ]
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
