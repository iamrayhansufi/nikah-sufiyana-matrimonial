"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"
import Link from "next/link"
import { playfair } from "../lib/fonts"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                <h1 className={`${playfair.className} text-2xl font-semibold mb-2`}>Verify Your Email</h1>
                <p className="text-muted-foreground mb-6">
                  We've sent a verification code to your email address. Please enter it below to verify your account.
                </p>
              </div>
              
              <form className="space-y-4">
                <div>
                  <Label htmlFor="code">Verification Code</Label>
                  <Input id="code" placeholder="Enter 6-digit code" />
                </div>
                
                <Button type="submit" className="w-full">
                  Verify Email
                </Button>
              </form>
              
              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?{" "}
                  <Button variant="link" className="p-0 h-auto">
                    Resend
                  </Button>
                </p>
                <p className="text-sm text-muted-foreground">
                  Wrong email?{" "}
                  <Link href="/register" className="text-primary hover:underline">
                    Change email
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
} 