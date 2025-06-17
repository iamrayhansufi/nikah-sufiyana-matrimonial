"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { playfair } from "@/lib/fonts"
import { Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [email, setEmail] = useState<string>("")
  const [code, setCode] = useState<string>("")
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [isResending, setIsResending] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [timerActive, setTimerActive] = useState<boolean>(false)

  useEffect(() => {
    // Get email from URL query params
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  useEffect(() => {
    // Handle countdown timer for resend code
    if (!timerActive || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setTimerActive(false)
          clearInterval(interval)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerActive, timeLeft])

  // Handle OTP code input
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits and max length of 6
    const value = e.target.value.replace(/[^\d]/g, "").slice(0, 6)
    setCode(value)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (code.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive"
      })
      return
    }

    try {
      setIsVerifying(true)

      const response = await fetch("/api/verify/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          code,
          purpose: "registration"
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Email verified successfully",
          variant: "default"
        })
        
        // Redirect to login page
        setTimeout(() => {
          router.push("/login")
        }, 1500)
      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "Invalid or expired verification code",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error verifying email:", error)
      toast({
        title: "Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsVerifying(false)
    }
  }

  // Handle resend code
  const handleResendCode = async () => {
    try {
      if (!email) {
        toast({
          title: "Error",
          description: "Email address is required",
          variant: "destructive"
        })
        return
      }

      setIsResending(true)

      const response = await fetch("/api/verify/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          purpose: "registration"
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Code Resent",
          description: "A new verification code has been sent to your email",
          variant: "default"
        })
        
        // Start cooldown timer (2 minutes)
        setTimeLeft(120)
        setTimerActive(true)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to resend verification code",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error resending code:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className={`${playfair.className} text-2xl font-bold`}>Email Verification</CardTitle>
              <CardDescription>Enter the 6-digit code sent to your email</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    We sent a verification code to:
                  </p>
                  <p className="font-medium">{email}</p>
                </div>

                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={handleCodeChange}
                    className="text-center text-xl tracking-widest"
                    disabled={isVerifying}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full gradient-primary"
                  disabled={isVerifying || code.length !== 6}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>

                <div className="text-center mt-4">
                  {timerActive ? (
                    <p className="text-sm text-muted-foreground">
                      Resend code in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                    </p>
                  ) : (
                    <Button 
                      type="button" 
                      variant="link" 
                      onClick={handleResendCode}
                      disabled={isResending || timerActive}
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Didn't receive the code? Resend"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
