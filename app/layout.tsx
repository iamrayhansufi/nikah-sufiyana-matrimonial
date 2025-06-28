import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, El_Messiri } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "@/components/auth/session-provider"
import { NotificationProvider } from "@/hooks/notification-provider"
import { LanguageProvider } from "@/lib/language-context"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
})

const elMessiri = El_Messiri({
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-el-messiri",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Nikah Sufiyana - Muslim Matrimonial Service",
  description: "Find your perfect Muslim life partner with Nikah Sufiyana matrimonial service.",
  keywords:
    "Muslim matrimony, Islamic marriage, halal relationships, Muslim bride, Muslim groom, nikah, Islamic wedding",
  icons: {    icon: "/Nikah-Sufiyana-Icon.svg",
    shortcut: "/Nikah-Sufiyana-Icon.svg",
    apple: "/Nikah-Sufiyana-Icon.svg",
  },  openGraph: {
    title: "Nikah Sufiyana - Find Your Perfect Islamic Match",
    description: "Premium Muslim matrimonial platform for finding halal relationships.",
    type: "website",
    url: "https://www.nikahsufiyana.com",
    siteName: "Nikah Sufiyana",
    images: [
      {
        url: "https://www.nikahsufiyana.com/Nikah-Sufiyana-Logo.svg",
        width: 1200,
        height: 630,
      }
    ],
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${elMessiri.variable} font-el-messiri antialiased bg-royal-gradient min-h-screen`} suppressHydrationWarning>
        <SessionProvider>
          <LanguageProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              <NotificationProvider>
                {children}
                <Toaster />
              </NotificationProvider>
            </ThemeProvider>
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
