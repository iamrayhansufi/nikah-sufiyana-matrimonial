import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/src/db"
import { users } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import { Session } from "next-auth"

declare module "next-auth" {
  interface User {
    id?: string | number;
  }
  interface Session {
    user?: User;
  }
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET must be set in environment variables')
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",      credentials: {
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
        if (!user) throw new Error("Invalid credentials")
        
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) throw new Error("Invalid credentials")
        
        return { 
          id: user.id, 
          name: user.fullName, 
          email: user.email,
          phone: user.phone
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Optionally persist user info to DB here
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
