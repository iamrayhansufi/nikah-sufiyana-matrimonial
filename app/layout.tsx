import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "@/components/auth/session-provider"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Nikah Sufiyana - Muslim Matrimonial Service",
  description: "Find your perfect Muslim life partner with Nikah Sufiyana matrimonial service.",
  keywords:
    "Muslim matrimony, Islamic marriage, halal relationships, Muslim bride, Muslim groom, nikah, Islamic wedding",
  icons: {
    icon: "/Nikah Sufiyana Favicon.svg",
    shortcut: "/Nikah Sufiyana Favicon.svg",
    apple: "/Nikah Sufiyana Favicon.svg",
  },
  openGraph: {
    title: "Nikah Sufiyana - Find Your Perfect Islamic Match",
    description: "Premium Muslim matrimonial platform for finding halal relationships.",
    type: "website",
    images: ["/Nikah Sufiyana Logo.svg"],
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`} suppressHydrationWarning>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
