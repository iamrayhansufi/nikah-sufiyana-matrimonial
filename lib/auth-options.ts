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
          console.log('🔐 Auth Debug - Authorization attempt with:', {
            hasEmail: !!credentials?.email,
            hasPhone: !!credentials?.phone,
            hasPassword: !!credentials?.password,
            email: credentials?.email, // Log the actual email for debugging
          });
          
          if (!credentials?.password || (!credentials?.email && !credentials?.phone)) {
            console.log('❌ Auth Debug - Missing credentials');
            return null;
          }
          
          let userArr;
          const searchField = credentials.email ? 'email' : 'phone';
          const searchValue = credentials.email || credentials.phone;
          
          console.log(`🔍 Auth Debug - Looking up user by ${searchField}: ${searchValue}`);
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
              console.log(`🔍 Auth Debug - Query result for email ${credentials.email}:`, {
                found: userArr?.length > 0,
                count: userArr?.length || 0
              });
            } else {
              userArr = await db.select(selectColumns).from(users).where(eq(users.phone, credentials.phone)).limit(1);
              console.log(`🔍 Auth Debug - Query result for phone ${credentials.phone}:`, {
                found: userArr?.length > 0,
                count: userArr?.length || 0
              });
            }
          } catch (dbError) {
            console.error('❌ Auth Debug - Database error during user lookup:', dbError);
            throw dbError; // Re-throw to be caught by the outer try/catch
          }
          
          const user = userArr?.[0];
          if (!user) {
            console.log(`❌ Auth Debug - No user found with ${searchField}: ${searchValue}`);
            return null;
          }
          
          console.log(`✅ Auth Debug - User found:`, {
            id: user.id, 
            email: user.email,
            hasPassword: !!user.password,
            passwordLength: user.password?.length,
            verified: user.verified
          });
            try {
            // Check if the password hash looks valid before attempting comparison
            if (!user.password || typeof user.password !== 'string' || user.password.length < 20) {
              console.error('❌ Auth Debug - Invalid password hash format:', {
                hasPassword: !!user.password,
                passwordType: typeof user.password,
                length: user.password?.length || 0
              });
              
              // Emergency fallback: If password is exactly "testpassword" for debugging only
              // IMPORTANT: REMOVE THIS IN PRODUCTION - FOR DEBUGGING ONLY
              if (credentials.password === 'testpassword' && process.env.NODE_ENV !== 'production') {
                console.warn('⚠️ Auth Debug - Using emergency fallback password! REMOVE IN PRODUCTION');
                console.log('✅ Auth Debug - Login allowed using emergency fallback');
                return {
                  id: user.id.toString(),
                  name: user.fullName,
                  email: user.email,
                  phone: user.phone,
                  role: 'user', // user.role || 'user', // Default to user until role column exists
                  verified: true // Force verified for the emergency login
                };
              }
              
              return null;
            }
            
            // Add error handling around password comparison
            const isValid = await bcrypt.compare(credentials.password, user.password);
            console.log(`🔑 Auth Debug - Password validation result: ${isValid ? 'VALID' : 'INVALID'}`);
            
            if (!isValid) {
              console.log('❌ Auth Debug - Invalid password');
              return null;
            }
          } catch (bcryptError) {
            console.error('❌ Auth Debug - Bcrypt error during password comparison:', bcryptError);
            
            // Log more details about the error
            console.error('Password details:', {
              inputLength: credentials.password?.length || 0,
              hashLength: user.password?.length || 0,
              hashStart: user.password?.substring(0, 10) || 'N/A'
            });
            
            throw bcryptError; // Re-throw to be caught by the outer try/catch
          }            console.log(`🔓 Auth Debug - Login successful for user ${user.id}, verified: ${user.verified}`);
          
          // For existing users who can log in with valid credentials, automatically mark as verified
          // This prevents existing users from being forced through email verification on login
          let isVerified = user.verified;
          
          // TEMPORARILY DISABLED AUTO-VERIFICATION FOR TESTING
          // If user is not marked as verified but has valid login credentials, 
          // automatically verify them (this handles legacy users)
          // if (!isVerified) {
          //   console.log(`🔄 Auth Debug - Auto-verifying existing user ${user.id} during login`);
          //   try {
          //     // Update the user's verified status in the database
          //     await db
          //       .update(users)
          //       .set({ verified: true })
          //       .where(eq(users.id, user.id));
          //     
          //     isVerified = true;
          //     console.log(`✅ Auth Debug - User ${user.id} automatically verified`);
          //   } catch (updateError) {
          //     console.error(`❌ Auth Debug - Failed to auto-verify user ${user.id}:`, updateError);
          //     // Continue with login even if verification update fails
          //     isVerified = true; // Set to true in session anyway
          //   }
          // }
          
          // TEMPORARY: Force verified to true for testing
          isVerified = true;
            // Since we're temporarily not selecting the role column, default to 'user'
          // This will be fixed once the database migration adds the role column
          const userRole = 'user'; // user.role || 'user'; // Commented out until role column exists in DB
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
        
        // Debug the token creation from user
        console.log('🔑 JWT Debug - User to Token:', { 
          userId: user.id,
          userVerified: user.verified,
          tokenVerified: token.verified 
        })
      } else {
        // Debug when reusing existing token
        console.log('🔑 JWT Debug - Existing Token:', { 
          tokenId: token.id,
          tokenVerified: token.verified 
        })
      }
      return token
    },    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.phone = token.phone as string | undefined
        session.user.role = token.role as string | undefined
        session.user.verified = token.verified as boolean | undefined
        
        // Debug session creation
        console.log('👤 Session Debug:', { 
          userId: session.user.id,
          verified: session.user.verified,
          tokenVerified: token.verified
        })
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
