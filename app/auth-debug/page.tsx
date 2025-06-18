"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/**
 * Special debugging page to inspect authentication status
 * Access at /auth-debug to see current session details
 */
export default function AuthDebugPage() {
  const { data: session, status, update: updateSession } = useSession()
  const [dbUser, setDbUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch user details directly from the database
  const fetchUserFromDb = async () => {
    if (!session?.user?.id) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/debug/user/${session.user.id}`)
      const data = await res.json()
      setDbUser(data)
    } catch (error) {
      console.error('Failed to fetch user from DB:', error)
    } finally {
      setLoading(false)
    }
  }

  // Force session refresh
  const refreshSession = async () => {
    await updateSession()
  }
  
  // Reset session in client
  const resetClientSession = () => {
    sessionStorage.clear()
    localStorage.clear()
    window.location.href = '/login'
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Status: {status}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Session Data:</h3>
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
              
              <Button onClick={refreshSession}>
                Force Refresh Session
              </Button>
              
              <Button variant="destructive" onClick={resetClientSession}>
                Reset Client Session
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Database User Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={fetchUserFromDb} disabled={!session?.user?.id || loading}>
                {loading ? "Loading..." : "Fetch User from Database"}
              </Button>
              
              {dbUser && (
                <div>
                  <h3 className="font-semibold">Database User:</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96">
                    {JSON.stringify(dbUser, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
