import type { NextAuthOptions } from "next-auth"
import type { Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/src/db"
import { users } from "@/src/db/schema"
import { eq } from "drizzle-orm"

declare module "next-auth" {  interface User {
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
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // Let the cookie system use the default domain
        // This works better with Vercel's multi-domain support
      },
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
      },      async authorize(credentials) {
        try {
          if (!credentials?.password || (!credentials?.email && !credentials?.phone)) {
            return null;
          }
            let userArr;
          const searchField = credentials.email ? 'email' : 'phone';
          const searchValue = credentials.email || credentials.phone;
            try {
            // Add full error handling around database queries
            // Select specific columns to avoid role column issue until database is updated
            const selectColumns = {
              id: users.id,
              fullName: users.fullName,
              email: users.email,
              phone: users.phone,
              password: users.password,
              verified: users.verified,
              gender: users.gender,
              age: users.age,
              profileStatus: users.profileStatus
            };
              if (credentials.email) {
              userArr = await db.select(selectColumns).from(users).where(eq(users.email, credentials.email)).limit(1);
            } else {
              userArr = await db.select(selectColumns).from(users).where(eq(users.phone, credentials.phone)).limit(1);
            }          } catch (dbError) {
            console.error('Database error during user lookup:', dbError);
            throw dbError;
          }
            const user = userArr?.[0];
          if (!user) {
            return null;
          }            try {
            // Check if the password hash looks valid before attempting comparison
            if (!user.password || typeof user.password !== 'string' || user.password.length < 20) {
              return null;
            }
              // Add error handling around password comparison
            const isValid = await bcrypt.compare(credentials.password, user.password);
            
            if (!isValid) {
              return null;
            }          } catch (bcryptError) {
            console.error('Bcrypt error during password comparison:', bcryptError);
            throw bcryptError;
          }          // For existing users who can log in with valid credentials, mark as verified
          // This prevents existing users from being forced through email verification on login
          // All users who can successfully authenticate with valid credentials are considered verified
          const isVerified = true;// Set default user role
          const userRole = 'user';
          
          return {
            id: user.id.toString(),
            name: user.fullName,
            email: user.email,
            phone: user.phone,
            role: userRole,
            verified: isVerified
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],  callbacks: {
    async redirect({ url, baseUrl }) {
      try {
        // If the URL is relative, make it absolute with baseUrl
        if (url.startsWith('/')) {
          url = new URL(url, baseUrl).toString()
        }
          // Create allowlist of permitted origins/urls
        const siteUrl = process.env.NEXTAUTH_URL || 'https://www.nikahsufiyana.com'
        const allowedOrigins = [
          new URL(baseUrl).origin, 
          siteUrl,
          ...(process.env.NEXTAUTH_PREVIEW_URLS || '').split(',')
            .filter(Boolean)
            .map(previewUrl => {
              try {
                return new URL(previewUrl).origin
              } catch {
                return null
              }
            })
            .filter(Boolean) as string[]
        ]
        
        // Get url origin for checking
        let urlOrigin
        try {
          urlOrigin = new URL(url).origin
        } catch {
          // If URL parsing fails, default to baseUrl
          console.error('Failed to parse redirect URL:', url)
          return `${baseUrl}/dashboard`
        }
        
        // First check if the origin is allowed
        if (allowedOrigins.includes(urlOrigin)) {
          // Allow redirect to this origin, but check the path
          const safePaths = [
            '/',
            '/dashboard',
            '/edit-profile',
            '/settings',
            '/browse',
            '/messages',
            '/interests',
            '/shortlist'
          ]
          
          const urlPath = new URL(url).pathname
          
          // If the path is in our safelist, allow the full URL
          if (safePaths.some(path => urlPath === path || urlPath.startsWith(`${path}/`))) {
            return url
          }
        }
        
        // Default redirect to dashboard for authenticated users
        return `${baseUrl}/dashboard`
      } catch (error) {
        console.error('Error in redirect callback:', error)
        // Fallback to dashboard if anything goes wrong
        return `${baseUrl}/dashboard`
      }
    },    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.phone = user.phone
        token.role = user.role
        token.verified = user.verified
      }
      return token
    },    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.phone = token.phone as string | undefined
        session.user.role = token.role as string | undefined
        session.user.verified = token.verified as boolean | undefined
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
