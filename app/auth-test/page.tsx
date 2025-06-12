"use client"

import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useToast } from "@/components/ui/use-toast"

export default function AuthTestPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [testEmail, setTestEmail] = useState("test@example.com")
  const [testPassword, setTestPassword] = useState("password123")
  const [isLoading, setIsLoading] = useState(false)

  // Fetch debug info on load
  useEffect(() => {
    const fetchDebugInfo = async () => {
      try {
        const res = await fetch('/api/auth/debug')
        const data = await res.json()
        setDebugInfo(data)
      } catch (error) {
        console.error("Failed to fetch debug info:", error)
      }
    }

    fetchDebugInfo()
  }, [status]) // Refresh when auth status changes

  const handleTestSignIn = async (redirect: boolean) => {
    setIsLoading(true)
    try {
      toast({
        title: "Test Login",
        description: `Attempting login with redirect=${redirect}...`,
      })
      
      const result = await signIn("credentials", {
        email: testEmail,
        password: testPassword,
        callbackUrl: "/dashboard",
        redirect: redirect,
      })

      if (!redirect && result) {
        toast({
          title: result.ok ? "Login Successful" : "Login Failed",
          description: result.ok ? "You are now signed in" : result.error,
          variant: result.ok ? "default" : "destructive"
        })
      }
    } catch (error) {
      console.error("Test sign in error:", error)
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <CardTitle className="text-center text-3xl font-bold mb-8">Auth Testing Tool</CardTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Auth Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">Current Status: <span className={
                  status === "authenticated" ? "text-green-600" : 
                  status === "loading" ? "text-yellow-600" : "text-red-600"
                }>{status}</span></p>
                
                {session ? (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="font-medium">Logged in as:</p>
                    <p>Name: {session.user?.name}</p>
                    <p>Email: {session.user?.email}</p>
                    <p>ID: {session.user?.id}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-2">Not currently signed in</p>
                )}
              </div>
              
              <div className="flex gap-3">
                {status === "authenticated" ? (
                  <Button 
                    variant="destructive" 
                    onClick={() => signOut({ callbackUrl: '/auth-test' })}
                  >
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="default"
                      onClick={() => window.location.href = '/login?callbackUrl=/auth-test'}
                    >
                      Go to Login Page
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/register'}
                    >
                      Go to Register Page
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Test Auth Card */}
          <Card>
            <CardHeader>
              <CardTitle>Test Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Test Email:</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Test Password:</label>
                <input
                  type="password"
                  className="w-full p-2 border rounded"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="default"
                  disabled={isLoading}
                  onClick={() => handleTestSignIn(true)}
                >
                  Test Sign In (with redirect)
                </Button>
                <Button
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => handleTestSignIn(false)}
                >
                  Test Without Redirect
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Debug Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg overflow-auto max-h-[400px]">
              <pre className="whitespace-pre-wrap break-all">
                {debugInfo ? JSON.stringify(debugInfo, null, 2) : 'Loading debug info...'}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}
