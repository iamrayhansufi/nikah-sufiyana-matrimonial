"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Trash2, RefreshCw, Database, Clock, Settings, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCache } from "@/hooks/cache-provider"

export default function CacheManagementPage() {
  const { toast } = useToast()
  const { clearAllStorage, clearUserCache, forceRefresh, startAutoClear, stopAutoClear } = useCache()
  const [loading, setLoading] = useState(false)
  const [autoClearEnabled, setAutoClearEnabled] = useState(true)
  const [cacheStats, setCacheStats] = useState({
    localStorage: 0,
    sessionStorage: 0,
    caches: 0,
    totalSize: '0 KB'
  })

  // Calculate cache statistics
  const calculateCacheStats = () => {
    if (typeof window === 'undefined') return // SSR guard
    
    let localStorageCount = 0
    let sessionStorageCount = 0
    let totalSize = 0

    localStorageCount = Object.keys(localStorage).length
    sessionStorageCount = Object.keys(sessionStorage).length

    // Estimate storage size
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length
      }
    }

    for (let key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        totalSize += sessionStorage[key].length + key.length
      }
    }

    setCacheStats({
      localStorage: localStorageCount,
      sessionStorage: sessionStorageCount,
      caches: 0, // Will be updated asynchronously
      totalSize: `${Math.round(totalSize / 1024)} KB`
    })

    // Get cache storage count
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        setCacheStats(prev => ({
          ...prev,
          caches: cacheNames.length
        }))
      })
    }
  }

  const handleClearAllCache = async () => {
    try {
      setLoading(true)
      await clearAllStorage()
      calculateCacheStats()
      toast({
        title: "Cache Cleared",
        description: "All browser storage and caches have been cleared successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cache. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClearUserCache = () => {
    try {
      setLoading(true)
      clearUserCache()
      calculateCacheStats()
      toast({
        title: "User Cache Cleared",
        description: "User-specific cached data has been cleared.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear user cache. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleForceRefresh = async () => {
    try {
      setLoading(true)
      await forceRefresh()
      // Page will reload, so this won't execute
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to force refresh. Please try again.",
        variant: "destructive"
      })
      setLoading(false)
    }
  }

  const handleAutoClearToggle = (enabled: boolean) => {
    setAutoClearEnabled(enabled)
    if (enabled) {
      startAutoClear()
      toast({
        title: "Auto-Clear Enabled",
        description: "Cache will be automatically cleared every 30 minutes.",
      })
    } else {
      stopAutoClear()
      toast({
        title: "Auto-Clear Disabled",
        description: "Automatic cache clearing has been disabled.",
      })
    }
  }

  // Calculate stats when component mounts
  useEffect(() => {
    calculateCacheStats()
    const interval = setInterval(calculateCacheStats, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-royal-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-royal-primary mb-2">Cache Management</h1>
            <p className="text-muted-foreground">
              Manage your browser storage and cache settings for optimal performance
            </p>
          </div>

          {/* Cache Statistics */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Storage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-royal-primary">{cacheStats.localStorage}</div>
                  <div className="text-sm text-muted-foreground">Local Storage Items</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-royal-primary">{cacheStats.sessionStorage}</div>
                  <div className="text-sm text-muted-foreground">Session Storage Items</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-royal-primary">{cacheStats.caches}</div>
                  <div className="text-sm text-muted-foreground">Cache Storages</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-royal-primary">{cacheStats.totalSize}</div>
                  <div className="text-sm text-muted-foreground">Estimated Size</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auto-Clear Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Automatic Cache Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-clear" className="text-base font-medium">
                    Auto-Clear Expired Cache
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically clear expired cached data every 30 minutes
                  </p>
                </div>
                <Switch
                  id="auto-clear"
                  checked={autoClearEnabled}
                  onCheckedChange={handleAutoClearToggle}
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Automatic Features Enabled:</p>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Clear expired profile data (after 1 hour)</li>
                    <li>• Clear expired session data (after 30 minutes)</li>
                    <li>• Clear user cache when switching accounts</li>
                    <li>• Clear all cache when logging out</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual Cache Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Manual Cache Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Clear User Cache */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Clear User Cache</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear cached profile, dashboard, and user-specific data
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleClearUserCache}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear User Cache
                </Button>
              </div>

              {/* Clear All Cache */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Clear All Cache</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear all browser storage, caches, and cookies
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={loading}
                      className="flex items-center gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear All Cache
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear All Cache?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will clear all stored data including login sessions, preferences, and cached content. 
                        You may need to log in again and reconfigure your settings.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearAllCache} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Clear All Cache
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Force Refresh */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Force Refresh</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear all cache and reload the page completely
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={loading}
                      className="flex items-center gap-2 text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Force Refresh
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Force Refresh Page?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will clear all cache and reload the page. Any unsaved changes will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleForceRefresh} className="bg-orange-600 text-white hover:bg-orange-700">
                        Force Refresh
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Performance Tips</p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Cache is automatically managed for optimal performance</li>
                    <li>• Clear cache if you experience loading issues</li>
                    <li>• Force refresh if content appears outdated</li>
                    <li>• Auto-clear helps maintain privacy and performance</li>
                  </ul>
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
