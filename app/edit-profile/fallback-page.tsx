"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { User, AlertCircle, Check, Loader2 } from "lucide-react"

export default function EditProfileFallback() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)

  // Check auth and get debug info
  useEffect(() => {
    async function checkAuth() {
      if (status === "loading") return

      if (status === "unauthenticated") {
        setError("You must be logged in to access this page")
        return
      }

      // If authenticated, fetch debug info
      try {
        const res = await fetch('/api/auth/debug')
        const data = await res.json()
        setDebugInfo(data)
      } catch (err) {
        console.error("Error fetching auth debug info:", err)
        setError("Failed to get authentication information")
      }
    }

    checkAuth()
  }, [status])

  // Simple function to fetch minimal profile data
  async function fetchBasicProfile() {
    if (!session?.user?.id) {
      setError("User ID not found")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/profiles/${session.user.id}`)
      
      if (!res.ok) {
        throw new Error(`Failed to fetch profile: ${res.status} ${res.statusText}`)
      }
      
      const data = await res.json()
      setProfileData(data)
    } catch (err) {
      console.error("Error fetching profile:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch profile data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2" /> Edit Profile (Simplified Page)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Auth Status */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h2 className="text-lg font-medium">Authentication Status</h2>
              <p><strong>Status:</strong> {status}</p>
              {session && (
                <div>
                  <p><strong>User:</strong> {session.user?.name || "Unknown"}</p>
                  <p><strong>Email:</strong> {session.user?.email || "Not provided"}</p>
                  <p><strong>User ID:</strong> {session.user?.id || "Missing"}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  onClick={fetchBasicProfile}
                  disabled={loading || status !== "authenticated"}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Fetch Basic Profile Data
                </Button>
                
                <Link href="/dashboard">
                  <Button variant="outline">Return to Dashboard</Button>
                </Link>
              </div>

              <Link href="/api/auth/debug" target="_blank">
                <Button variant="outline" className="w-full">
                  View Auth Debug Information
                </Button>
              </Link>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Profile Data Display */}
            {profileData && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <h2 className="text-lg font-medium">Basic Profile Data</h2>
                <pre className="text-xs overflow-auto p-4 bg-background rounded border">
                  {JSON.stringify(profileData, null, 2)}
                </pre>
              </div>
            )}

            {/* Connection Status */}
            <Separator />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {debugInfo ? (
                  <span className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-1" /> Debug info loaded
                  </span>
                ) : "Debug info not loaded"}
              </span>
              <span>Environment: {process.env.NODE_ENV}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
