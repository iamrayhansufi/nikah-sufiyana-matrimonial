"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import Link from "next/link"
import { playfair } from "./lib/fonts"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h1 className={`${playfair.className} text-2xl font-semibold mb-2`}>Page Not Found</h1>
                <p className="text-muted-foreground mb-6">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="space-y-4">
                  <Link href="/">
                    <Button className="w-full">Return Home</Button>
                  </Link>
                  <Link href="/browse">
                    <Button variant="outline" className="w-full">Browse Profiles</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
} 