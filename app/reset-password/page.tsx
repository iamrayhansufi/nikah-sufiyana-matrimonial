"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { playfair } from "../lib/fonts"

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6">
              <h1 className={`${playfair.className} text-2xl font-semibold text-center mb-6`}>Create New Password</h1>
              
              <form className="space-y-4">
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input id="password" type="password" placeholder="Enter new password" />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                </div>
                
                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-lg text-muted-foreground">
                  Remember your password?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Sign in
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