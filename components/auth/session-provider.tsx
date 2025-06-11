'use client'

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

export function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NextAuthSessionProvider 
      // Refresh session every 4 hours
      refetchInterval={4 * 60 * 60}
      // Only refetch when window is focused and it's been 5 minutes since last fetch
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      {children}
    </NextAuthSessionProvider>
  )
}
