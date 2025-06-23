"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { playfair } from "../lib/fonts"

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-cream-bg">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h1 className={`${playfair.className} text-2xl font-semibold mb-2`}>Registration Successful!</h1>
                <p className="text-muted-foreground mb-6">
                  Your profile has been created successfully. Start your journey to find your perfect match.
                </p>
                <div className="space-y-4">
                  <Link href="/browse">
                    <Button className="w-full">Browse Profiles</Button>
                  </Link>
                  <Link href="/edit-profile">
                    <Button variant="outline" className="w-full">Complete Your Profile</Button>
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