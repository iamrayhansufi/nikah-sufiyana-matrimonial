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
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          console.log("Missing password")
          throw new Error("Missing password")
        }

        const emailOrPhone = credentials.email || credentials.phone;
        if (!emailOrPhone) {
          console.log("Missing email or phone")
          throw new Error("Missing email or phone")
        }

        try {
          let user;
          
          // Determine if the input is an email or phone number
          const isEmail = emailOrPhone.includes('@');
          
          if (isEmail) {
            user = await redisTables.users.findByEmail(emailOrPhone);
          } else {
            // Find user by phone number
            user = await redisTables.users.findByPhone(emailOrPhone);
          }
          
          if (!user) {
            console.log(`User not found: ${emailOrPhone}`)
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
  callbacks: {    async jwt({ token, user, trigger }) {
      if (user) {
        // Initial login - set user data in token
        token.id = user.id
        token.phone = user.phone
        token.role = user.role
        token.verified = user.verified
      }
      
      // If updateSession() was called, refresh user data from database
      if (trigger === "update" && token.id) {
        try {
          console.log(`🔄 JWT: Refreshing user data for ${token.id} due to updateSession call`);
          const freshUser = await redisTables.users.get(token.id as string);
          if (freshUser) {
            token.verified = freshUser.verified === true || freshUser.verified === 'true';
            console.log(`🔄 JWT: Updated verified status to ${token.verified}`);
          }
        } catch (error) {
          console.error("Error refreshing user data in JWT callback:", error);
        }
      }
      
      return token
    },async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.phone = token.phone as string | undefined
        session.user.role = token.role as string | undefined
        session.user.verified = token.verified as boolean | undefined
        
        // Always check for fresh verification status from the database
        // This ensures that when updateSession() is called, we get the latest data
        if (token.id) {
          try {
            const freshUser = await redisTables.users.get(token.id as string);
            if (freshUser) {
              const freshVerified = freshUser.verified === true || freshUser.verified === 'true';
              
              // Update session with fresh verification status
              if (freshVerified !== token.verified) {
                console.log(`🔄 Session: Updated verification status for user ${token.id} from ${token.verified} to ${freshVerified}`);
                session.user.verified = freshVerified;
                
                // Update the token as well for future session calls
                token.verified = freshVerified;
              } else {
                session.user.verified = freshVerified;
              }
            }
          } catch (error) {
            console.error("Error fetching fresh user data in session callback:", error);
          }
        }
      }
      return session
    },
  },
}

// Export a version that doesn't include the adapter for now
// until the TypeScript issues are resolved
export const authOptionsWithoutAdapter = authOptions
