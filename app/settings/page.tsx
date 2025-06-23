"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Lock, Eye, Globe, Moon, Sun, Smartphone } from "lucide-react"
import { playfair } from "../lib/fonts"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function SettingsPage() {
  const { toast } = useToast()

  const handleSaveChanges = () => {
    toast({
      title: "Settings Saved",
      description: "Your account settings have been updated successfully.",
    })
  }

  const handleResetDefaults = () => {
    toast({
      title: "Reset to Defaults",
      description: "All settings have been reset to default values.",
    })
  }

  const handleDeactivateAccount = () => {
    toast({
      title: "Account Deactivation",
      description: "Please contact support to deactivate your account.",
      variant: "destructive"
    })  }
  return (
    <div className="min-h-screen bg-cream-bg">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className={`${playfair.className} text-2xl font-semibold text-center mb-8`}>Account Settings</h1>
          
          <div className="space-y-6">
            {/* Account Settings */}
            <Card>
              <CardContent className="p-6">
                <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>Account</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="fatima@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+91 98765 43210" />
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="english">
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
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardContent className="p-6">
                <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>Privacy</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Profile Visibility</Label>
                      <div className="text-lg text-muted-foreground">
                        Control who can see your profile
                      </div>
                    </div>
                    <Select defaultValue="all">
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
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Photo Privacy</Label>
                      <div className="text-lg text-muted-foreground">
                        Control who can see your photos
                      </div>
                    </div>
                    <Select defaultValue="all">
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
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Contact Information</Label>
                      <div className="text-lg text-muted-foreground">
                        Show contact details to matched profiles
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardContent className="p-6">
                <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <div className="text-lg text-muted-foreground">
                        Receive updates via email
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <div className="text-lg text-muted-foreground">
                        Receive updates via SMS
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>WhatsApp Notifications</Label>
                      <div className="text-lg text-muted-foreground">
                        Receive updates via WhatsApp
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card>
              <CardContent className="p-6">
                <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>Appearance</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Theme</Label>
                      <div className="text-lg text-muted-foreground">
                        Choose your preferred theme
                      </div>
                    </div>
                    <Select defaultValue="system">
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
                </div>
              </CardContent>
            </Card>            {/* Security Settings */}
            <Card>
              <CardContent className="p-6">
                <h2 className={`${playfair.className} text-xl font-semibold mb-4`}>Security</h2>
                <div className="space-y-4">
                  <div>
                    <Link href="/reset-password">
                      <Button variant="outline" className="w-full">
                        Change Password
                      </Button>
                    </Link>
                  </div>
                  <div>
                    <Button variant="outline" className="w-full" onClick={() => {
                      toast({
                        title: "Two-Factor Authentication",
                        description: "This feature will be available in the next update.",
                      })
                    }}>
                      Enable Two-Factor Authentication
                    </Button>
                  </div>
                  <div>
                    <Button variant="outline" className="w-full text-destructive" onClick={handleDeactivateAccount}>
                      Deactivate Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button className="flex-1" onClick={handleSaveChanges}>Save Changes</Button>
              <Button variant="outline" className="flex-1" onClick={handleResetDefaults}>Reset to Default</Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 