"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Heart, Eye, EyeOff, Mail, Phone } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { signIn } from "next-auth/react"

// Component to handle search params logic
function LoginFormWithParams() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    rememberMe: false,
  })

  // Get callback URL, message, and verified status from search params
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const message = searchParams.get('message')
  const verified = searchParams.get('verified') === 'true'
  const emailParam = searchParams.get('email')

  // Set email from URL parameter if provided
  useEffect(() => {
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [emailParam]);

  // Show success message if coming from registration
  useEffect(() => {
    if (message === 'registration-success') {
      toast({
        title: "Registration Successful!",
        description: "Please sign in to access your dashboard.",
      });
    } else if (verified) {
      toast({
        title: "Email Successfully Verified!",
        description: "Your email has been verified. Please sign in to access your dashboard.",
        variant: "default"
      });
    }
  }, [message, verified, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Use NextAuth credentials provider for login with proper redirect
      // Create a full URL for the callbackUrl to ensure absolute path redirect works correctly
      const absoluteCallbackUrl = callbackUrl.startsWith('http') 
        ? callbackUrl 
        : new URL(callbackUrl, window.location.origin).toString();
        
      const res = await signIn("credentials", {
        email: loginMethod === "email" ? formData.email : undefined,
        phone: loginMethod === "phone" ? formData.phone : undefined,
        password: formData.password,
        callbackUrl: absoluteCallbackUrl,
        redirect: true, // Let NextAuth handle the redirect
      })
      
      // This code will only run if redirect: false and there's an error
      if (res?.error) {
        toast({
          title: "Login Failed",
          description: res.error || "Invalid credentials. Please try again.",
          variant: "destructive",
        })
        return
      }
      
      // Success toast - this may not show due to redirect
      toast({
        title: "Login Successful",
        description: "Welcome back to Nikah Sufiyana!",
      })
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex flex-col items-center justify-center mb-4">
                <Image
                  src="/Nikah-Sufiyana-Logo.svg"
                  alt="Nikah Sufiyana"
                  width={180}
                  height={45}
                  className="mb-4"
                />
                <h1 className="text-2xl font-bold">Welcome Back</h1>
              </div>
              <p className="text-muted-foreground">Sign in to your Nikah Sufiyana account</p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Login Method Toggle */}
                <div className="flex rounded-lg border p-1">
                  <Button
                    type="button"
                    variant={loginMethod === "email" ? "default" : "ghost"}
                    className="flex-1"
                    onClick={() => setLoginMethod("email")}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={loginMethod === "phone" ? "default" : "ghost"}
                    className="flex-1"
                    onClick={() => setLoginMethod("phone")}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </Button>
                </div>

                {/* Email/Phone Input */}
                {loginMethod === "email" ? (
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                )}

                {/* Password Input */}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <Button type="submit" className="w-full gradient-emerald text-white" size="lg">
                  Sign In
                </Button>

                {/* OTP Login - Commented out for now 
                <div className="relative mt-4">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">
                    Or
                  </span>
                </div>

                <Button variant="outline" className="w-full" type="button">
                  Login with OTP
                </Button>
                */}
              </form>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-primary hover:underline font-medium">
                    Create your profile
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Need help? Contact us at{" "}
              <a href="mailto:support@nikahsufiyana.com" className="text-primary hover:underline">
                support@nikahsufiyana.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

// Loading component for Suspense fallback
function LoginPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-primary mr-2" />
                <h1 className="text-2xl font-bold">Welcome Back</h1>
              </div>
              <p className="text-muted-foreground">Loading...</p>
            </CardHeader>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}

// Main component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageLoading />}>
      <LoginFormWithParams />
    </Suspense>
  )
}
