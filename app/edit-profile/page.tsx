"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, AlertCircle, Check, Loader2, Save, UserCircle, Book, GraduationCap, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Basic form types
interface BasicProfileForm {
  fullName: string;
  age: string;
  gender: string;
  location: string;
  education: string;
  profession: string;
  maritalStatus: string;
  sect: string;
  aboutMe: string;
}

export default function EditProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<any>(null)
  
  // Form state
  const [formData, setFormData] = useState<BasicProfileForm>({
    fullName: "",
    age: "",
    gender: "",
    location: "",
    education: "",
    profession: "",
    maritalStatus: "",
    sect: "",
    aboutMe: ""
  })

  // Fetch profile data on component mount
  useEffect(() => {
    let isMounted = true;
    
    async function fetchProfile() {
      if (status === "loading") return
      
      if (status === "unauthenticated") {
        if (isMounted) {
          setError("Please log in to access your profile")
        }
        router.push('/login?callbackUrl=/edit-profile')
        return
      }
      
      if (!session?.user?.id) {
        if (isMounted) {
          setError("User ID not found. Please log in again.")
        }
        return
      }
      
      if (isMounted) {
        setLoading(true)
      }

      try {
        const response = await fetch(`/api/profiles/${session.user.id}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (isMounted) {
          setProfileData(data)
          
          // Populate form data
          setFormData({
            fullName: data.fullName || "",
            age: data.age ? String(data.age) : "",
            gender: data.gender || "",
            location: data.location || "",
            education: data.education || "",
            profession: data.profession || "",
            maritalStatus: data.maritalStatus || "",
            sect: data.sect || "",
            aboutMe: data.aboutMe || ""
          })
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching profile:", error)
          setError("Failed to load your profile data")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchProfile()
    
    return () => {
      isMounted = false
    }
  }, [session, status, router])
  
  // Handle form input changes
  const handleChange = (field: keyof BasicProfileForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      })
      return
    }
    
    setSaving(true)
    
    try {
      const response = await fetch(`/api/profiles/${session.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`)
      }
      
      const updatedProfile = await response.json()
      setProfileData(updatedProfile)
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
        variant: "default"
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update your profile",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your profile...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCircle className="mr-2" /> Edit Your Profile
            </CardTitle>
            <CardDescription>
              Update your information to make your profile more attractive to potential matches.
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="religious">Religious Info</TabsTrigger>
            <TabsTrigger value="education">Education & Career</TabsTrigger>
            <TabsTrigger value="preferences">Partner Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" /> Basic Information
                </CardTitle>
                <CardDescription>
                  Your main profile details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input 
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleChange('age', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={formData.gender} 
                        onValueChange={(value) => handleChange('gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        placeholder="City, Country"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <Input 
                        id="education"
                        value={formData.education}
                        onChange={(e) => handleChange('education', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession</Label>
                      <Input 
                        id="profession"
                        value={formData.profession}
                        onChange={(e) => handleChange('profession', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select 
                        value={formData.maritalStatus} 
                        onValueChange={(value) => handleChange('maritalStatus', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never-married">Never Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sect">Islamic Sect</Label>
                      <Select 
                        value={formData.sect} 
                        onValueChange={(value) => handleChange('sect', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sect" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sunni">Sunni</SelectItem>
                          <SelectItem value="shia">Shia</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="aboutMe">About Me</Label>
                    <Textarea 
                      id="aboutMe"
                      value={formData.aboutMe}
                      onChange={(e) => handleChange('aboutMe', e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Tell potential matches about yourself..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Basic Information
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="religious" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="mr-2 h-5 w-5" /> Religious Information
                </CardTitle>
                <CardDescription>
                  Coming soon - This tab is under development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTitle>Feature Coming Soon</AlertTitle>
                  <AlertDescription>
                    Religious information editing will be available in the next update.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="education" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" /> Education & Career
                </CardTitle>
                <CardDescription>
                  Coming soon - This tab is under development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTitle>Feature Coming Soon</AlertTitle>
                  <AlertDescription>
                    Education and career information editing will be available in the next update.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5" /> Partner Preferences
                </CardTitle>
                <CardDescription>
                  Coming soon - This tab is under development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTitle>Feature Coming Soon</AlertTitle>
                  <AlertDescription>
                    Partner preference editing will be available in the next update.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Debug Information */}
        <Separator className="my-6" />
        <div className="flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
          
          <Link href="/api/auth/debug" target="_blank">
            <Button variant="ghost" size="sm">
              View Debug Info
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
