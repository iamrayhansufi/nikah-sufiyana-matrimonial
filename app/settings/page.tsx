"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Bell, Lock, Eye, Globe, Moon, Sun, Smartphone, User, Shield, Trash2, Save, RotateCcw } from "lucide-react"
import { playfair } from "../lib/fonts"
import { useToast } from "@/hooks/use-toast"

interface UserSettings {
  email: string
  phone: string
  whatsappNumber?: string
  language: string
  profileVisibility: string
  photoPrivacy: string
  showContactInfo: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  whatsappNotifications: boolean
  theme: string
  twoFactorEnabled: boolean
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    email: '',
    phone: '',
    whatsappNumber: '',
    language: 'english',
    profileVisibility: 'all',
    photoPrivacy: 'all',
    showContactInfo: true,
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: true,
    theme: 'system',
    twoFactorEnabled: false
  })
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [activeTab, setActiveTab] = useState('account')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Load user settings
  useEffect(() => {
    if (session?.user) {
      loadUserSettings()
    }
  }, [session])

  const loadUserSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings/user')
      if (response.ok) {
        const userData = await response.json()
        setSettings(prev => ({
          ...prev,
          ...userData
        }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      toast({
        title: "Error",
        description: "Failed to load user settings.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAccountUpdate = async (field: keyof UserSettings, value: any) => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      })

      if (response.ok) {
        setSettings(prev => ({ ...prev, [field]: value }))
        toast({
          title: "Success",
          description: "Account settings updated successfully.",
        })
      } else {
        throw new Error('Failed to update settings')
      }
    } catch (error) {
      console.error('Error updating account:', error)
      toast({
        title: "Error",
        description: "Failed to update account settings.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive"
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData)
      })

      if (response.ok) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        toast({
          title: "Success",
          description: "Password changed successfully.",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to change password')
      }
    } catch (error: any) {
      console.error('Error changing password:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to change password.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationUpdate = async (type: keyof UserSettings, enabled: boolean) => {
    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [type]: enabled })
      })

      if (response.ok) {
        setSettings(prev => ({ ...prev, [type]: enabled }))
        toast({
          title: "Success",
          description: "Notification settings updated.",
        })
      }
    } catch (error) {
      console.error('Error updating notifications:', error)
      toast({
        title: "Error",
        description: "Failed to update notification settings.",
        variant: "destructive"
      })
    }
  }

  const handlePrivacyUpdate = async (field: keyof UserSettings, value: any) => {
    try {
      const response = await fetch('/api/settings/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      })

      if (response.ok) {
        setSettings(prev => ({ ...prev, [field]: value }))
        toast({
          title: "Success",
          description: "Privacy settings updated.",
        })
      }
    } catch (error) {
      console.error('Error updating privacy:', error)
      toast({
        title: "Error",
        description: "Failed to update privacy settings.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings/delete-account', {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted.",
        })
        router.push('/')
      } else {
        throw new Error('Failed to delete account')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-cream-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }
  return (
    <div className="min-h-screen bg-cream-bg">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className={`${playfair.className} text-3xl font-semibold text-center mb-8`}>Account Settings</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="danger" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Danger Zone
              </TabsTrigger>
            </TabsList>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={settings.email}
                      onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                      onBlur={() => handleAccountUpdate('email', settings.email)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={settings.phone}
                      onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                      onBlur={() => handleAccountUpdate('phone', settings.phone)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp Number (Optional)</Label>
                    <Input 
                      id="whatsapp" 
                      value={settings.whatsappNumber || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                      onBlur={() => handleAccountUpdate('whatsappNumber', settings.whatsappNumber)}
                      placeholder="Enter WhatsApp number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={settings.language} 
                      onValueChange={(value) => handleAccountUpdate('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="urdu">Urdu</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="arabic">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Theme</Label>
                      <div className="text-sm text-muted-foreground">
                        Choose your preferred theme
                      </div>
                    </div>
                    <Select 
                      value={settings.theme} 
                      onValueChange={(value) => handleAccountUpdate('theme', value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handlePasswordChange} disabled={loading}>
                    {loading ? "Updating..." : "Change Password"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <div className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {settings.twoFactorEnabled && <Badge variant="secondary">Enabled</Badge>}
                      <Switch 
                        checked={settings.twoFactorEnabled}
                        onCheckedChange={(checked) => handleAccountUpdate('twoFactorEnabled', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <div className="text-sm text-muted-foreground">
                        Receive updates via email
                      </div>
                    </div>
                    <Switch 
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationUpdate('emailNotifications', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <div className="text-sm text-muted-foreground">
                        Receive updates via SMS
                      </div>
                    </div>
                    <Switch 
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => handleNotificationUpdate('smsNotifications', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>WhatsApp Notifications</Label>
                      <div className="text-sm text-muted-foreground">
                        Receive updates via WhatsApp
                      </div>
                    </div>
                    <Switch 
                      checked={settings.whatsappNotifications}
                      onCheckedChange={(checked) => handleNotificationUpdate('whatsappNotifications', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Profile Visibility</Label>
                      <div className="text-sm text-muted-foreground">
                        Control who can see your profile
                      </div>
                    </div>
                    <Select 
                      value={settings.profileVisibility} 
                      onValueChange={(value) => handlePrivacyUpdate('profileVisibility', value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Members</SelectItem>
                        <SelectItem value="premium">Premium Members Only</SelectItem>
                        <SelectItem value="matches">Matched Profiles Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Photo Privacy</Label>
                      <div className="text-sm text-muted-foreground">
                        Control who can see your photos
                      </div>
                    </div>
                    <Select 
                      value={settings.photoPrivacy} 
                      onValueChange={(value) => handlePrivacyUpdate('photoPrivacy', value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Members</SelectItem>
                        <SelectItem value="premium">Premium Members Only</SelectItem>
                        <SelectItem value="matches">Matched Profiles Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Contact Information</Label>
                      <div className="text-sm text-muted-foreground">
                        Show contact details to matched profiles
                      </div>
                    </div>
                    <Switch 
                      checked={settings.showContactInfo}
                      onCheckedChange={(checked) => handlePrivacyUpdate('showContactInfo', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Danger Zone Tab */}
            <TabsContent value="danger" className="space-y-6">
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                    <h3 className="font-semibold text-destructive">Delete Account</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Once you delete your account, there is no going back. This action cannot be undone.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="mt-3">
                          Delete My Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, delete my account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  )
}