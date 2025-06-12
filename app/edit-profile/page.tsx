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
import { 
  User, 
  AlertCircle, 
  Check, 
  Loader2, 
  Save,
  UserCircle, 
  Book, 
  GraduationCap, 
  Heart, 
  Home,
  Settings,
  Upload,
  Image
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Form types
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

interface ReligiousInfoForm {
  religiousInclination: string;
  prayerLevel: string;
  religiousValues: string;
  hijabLevel: string;
  beardLevel: string;
}

interface EducationCareerForm {
  education: string;
  educationDetails: string;
  profession: string;
  workExperience: string;
  income: string;
  jobTitle: string;
}

interface FamilyInfoForm {
  familyType: string;
  familyDetails: string;
  siblings: string;
  livingWithParents: string;
  familyValues: string;
}

interface PartnerPreferencesForm {
  preferredAgeMin: string;
  preferredAgeMax: string;
  preferredLocation: string;
  preferredEducation: string;
  preferredOccupation: string;
  expectations: string;
}

interface PrivacySettingsForm {
  showContactInfo: boolean;
  showPhotos: boolean;
  hideProfile: boolean;
  showOnlineStatus: boolean;
}

export default function EditProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [savingTab, setSavingTab] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("basic")
  
  // Form states for each tab
  const [basicForm, setBasicForm] = useState<BasicProfileForm>({
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
  
  const [religiousForm, setReligiousForm] = useState<ReligiousInfoForm>({
    religiousInclination: "",
    prayerLevel: "",
    religiousValues: "",
    hijabLevel: "",
    beardLevel: ""
  })
  
  const [educationCareerForm, setEducationCareerForm] = useState<EducationCareerForm>({
    education: "",
    educationDetails: "",
    profession: "",
    workExperience: "",
    income: "",
    jobTitle: ""
  })
  
  const [familyForm, setFamilyForm] = useState<FamilyInfoForm>({
    familyType: "",
    familyDetails: "",
    siblings: "",
    livingWithParents: "",
    familyValues: ""
  })
  
  const [partnerForm, setPartnerForm] = useState<PartnerPreferencesForm>({
    preferredAgeMin: "",
    preferredAgeMax: "",
    preferredLocation: "",
    preferredEducation: "",
    preferredOccupation: "",
    expectations: ""
  })
  
  const [privacyForm, setPrivacyForm] = useState<PrivacySettingsForm>({
    showContactInfo: true,
    showPhotos: true,
    hideProfile: false,
    showOnlineStatus: true
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
          
          // Populate form data for each tab
          setBasicForm({
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
          
          setReligiousForm({
            religiousInclination: data.religiousInclination || "",
            prayerLevel: data.prayerLevel || "",
            religiousValues: data.religiousValues || "",
            hijabLevel: data.hijabLevel || "",
            beardLevel: data.beardLevel || ""
          })
          
          setEducationCareerForm({
            education: data.education || "",
            educationDetails: data.educationDetails || "",
            profession: data.profession || "",
            workExperience: data.workExperience || "",
            income: data.income || "",
            jobTitle: data.jobTitle || ""
          })
          
          setFamilyForm({
            familyType: data.familyType || "",
            familyDetails: data.familyDetails || "",
            siblings: data.siblings || "",
            livingWithParents: data.livingWithParents || "",
            familyValues: data.familyValues || ""
          })
          
          setPartnerForm({
            preferredAgeMin: data.preferredAgeMin ? String(data.preferredAgeMin) : "",
            preferredAgeMax: data.preferredAgeMax ? String(data.preferredAgeMax) : "",
            preferredLocation: data.preferredLocation || "",
            preferredEducation: data.preferredEducation || "",
            preferredOccupation: data.preferredOccupation || "",
            expectations: data.expectations || ""
          })
          
          setPrivacyForm({
            showContactInfo: data.showContactInfo !== undefined ? data.showContactInfo : true,
            showPhotos: data.showPhotos !== undefined ? data.showPhotos : true,
            hideProfile: data.hideProfile !== undefined ? data.hideProfile : false,
            showOnlineStatus: data.showOnlineStatus !== undefined ? data.showOnlineStatus : true
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
  
  // Handle form input changes for different tabs
  const handleBasicChange = (field: keyof BasicProfileForm, value: string) => {
    setBasicForm(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleReligiousChange = (field: keyof ReligiousInfoForm, value: string) => {
    setReligiousForm(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleEducationCareerChange = (field: keyof EducationCareerForm, value: string) => {
    setEducationCareerForm(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleFamilyChange = (field: keyof FamilyInfoForm, value: string) => {
    setFamilyForm(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handlePartnerChange = (field: keyof PartnerPreferencesForm, value: string) => {
    setPartnerForm(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handlePrivacyChange = (field: keyof PrivacySettingsForm, value: boolean) => {
    setPrivacyForm(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Generic update function for all tabs
  const updateProfile = async (tabData: object, tabName: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      })
      return
    }
    
    setSavingTab(tabName)
    
    try {
      const response = await fetch(`/api/profiles/${session.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tabData)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`)
      }
      
      const updatedProfile = await response.json()
      setProfileData({...profileData, ...updatedProfile})
      
      toast({
        title: "Profile Updated",
        description: `Your ${tabName} information has been successfully updated`,
        variant: "default"
      })
    } catch (error) {
      console.error(`Error updating ${tabName} information:`, error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : `Failed to update your ${tabName} information`,
        variant: "destructive"
      })
    } finally {
      setSavingTab(null)
    }
  }
  
  // Tab-specific form submission handlers
  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile(basicForm, "basic")
  }
  
  const handleReligiousSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile(religiousForm, "religious")
  }
  
  const handleEducationCareerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile(educationCareerForm, "education and career")
  }
  
  const handleFamilySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile(familyForm, "family")
  }
  
  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile(partnerForm, "partner preferences")
  }
  
  const handlePrivacySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile(privacyForm, "privacy settings")
  }
    // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const file = files[0]
    const formData = new FormData()
    formData.append('photo', file) // Using 'photo' as the key to match the API
    
    try {
      setSavingTab('photo')
      const response = await fetch('/api/profiles/upload-photo', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload profile photo')
      }
      
      const data = await response.json()
      setProfileData({...profileData, profilePhoto: data.url})
      
      toast({
        title: "Photo Updated",
        description: "Your profile photo has been successfully updated",
        variant: "default"
      })
    } catch (error) {
      console.error("Photo upload error:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload your photo",
        variant: "destructive"
      })
    } finally {
      setSavingTab(null)
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="flex items-center text-2xl">
                  <UserCircle className="mr-2" /> Edit Your Profile
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Update your information to make your profile more attractive to potential matches.
                </CardDescription>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center">
                {profileData?.profileStatus && (
                  <Badge 
                    className={`mr-2 ${
                      profileData.profileStatus === 'approved' 
                        ? 'bg-green-500' 
                        : profileData.profileStatus === 'pending' 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                    }`}
                  >
                    {profileData.profileStatus.toUpperCase()}
                  </Badge>
                )}
                
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-2 border-primary overflow-hidden bg-slate-200">
                    {profileData?.profilePhoto ? (
                      <img 
                        src={profileData.profilePhoto} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <User size={30} />
                      </div>
                    )}
                  </div>
                  <label 
                    htmlFor="profile-photo" 
                    className="absolute -right-1 -bottom-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    {savingTab === 'photo' ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <Upload className="h-4 w-4 text-white" />
                    )}
                    <input 
                      id="profile-photo" 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Tabs 
          defaultValue="basic" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="religious">Religious Info</TabsTrigger>
            <TabsTrigger value="education">Education & Career</TabsTrigger>
            <TabsTrigger value="family">Family Info</TabsTrigger>
            <TabsTrigger value="preferences">Partner Preferences</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Settings</TabsTrigger>
          </TabsList>
          
          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" /> Basic Information
                </CardTitle>
                <CardDescription>
                  Your main profile details that will be visible to others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBasicSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName"
                        value={basicForm.fullName}
                        onChange={(e) => handleBasicChange('fullName', e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input 
                        id="age"
                        type="number"
                        value={basicForm.age}
                        onChange={(e) => handleBasicChange('age', e.target.value)}
                        placeholder="Your age"
                        min="18"
                        max="80"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={basicForm.gender} 
                        onValueChange={(value) => handleBasicChange('gender', value)}
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
                        value={basicForm.location}
                        onChange={(e) => handleBasicChange('location', e.target.value)}
                        placeholder="City, Country"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <Input 
                        id="education"
                        value={basicForm.education}
                        onChange={(e) => handleBasicChange('education', e.target.value)}
                        placeholder="Your highest education"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession</Label>
                      <Input 
                        id="profession"
                        value={basicForm.profession}
                        onChange={(e) => handleBasicChange('profession', e.target.value)}
                        placeholder="Your current profession"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select 
                        value={basicForm.maritalStatus} 
                        onValueChange={(value) => handleBasicChange('maritalStatus', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never-married">Never Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                          <SelectItem value="separated">Separated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sect">Islamic Sect</Label>
                      <Select 
                        value={basicForm.sect} 
                        onValueChange={(value) => handleBasicChange('sect', value)}
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
                      value={basicForm.aboutMe}
                      onChange={(e) => handleBasicChange('aboutMe', e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Tell potential matches about yourself..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={savingTab === 'basic'}>
                    {savingTab === 'basic' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Basic Information
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Religious Info Tab */}
          <TabsContent value="religious" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="mr-2 h-5 w-5" /> Religious Information
                </CardTitle>
                <CardDescription>
                  Share your religious practices and values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReligiousSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prayerLevel">Prayer Practice</Label>
                      <Select 
                        value={religiousForm.prayerLevel} 
                        onValueChange={(value) => handleReligiousChange('prayerLevel', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="five-times">All five prayers</SelectItem>
                          <SelectItem value="sometimes">Sometimes</SelectItem>
                          <SelectItem value="occasionally">Occasionally</SelectItem>
                          <SelectItem value="learning">Learning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {basicForm.gender === 'female' && (
                      <div className="space-y-2">
                        <Label htmlFor="hijabLevel">Hijab Observance</Label>
                        <Select 
                          value={religiousForm.hijabLevel} 
                          onValueChange={(value) => handleReligiousChange('hijabLevel', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full">Full Hijab</SelectItem>
                            <SelectItem value="partial">Partial Hijab</SelectItem>
                            <SelectItem value="sometimes">Sometimes</SelectItem>
                            <SelectItem value="planning">Planning to Wear</SelectItem>
                            <SelectItem value="none">Don't Wear</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {basicForm.gender === 'male' && (
                      <div className="space-y-2">
                        <Label htmlFor="beardLevel">Beard</Label>
                        <Select 
                          value={religiousForm.beardLevel} 
                          onValueChange={(value) => handleReligiousChange('beardLevel', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full">Full Beard</SelectItem>
                            <SelectItem value="short">Short/Trimmed Beard</SelectItem>
                            <SelectItem value="planning">Planning to Grow</SelectItem>
                            <SelectItem value="none">No Beard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="religiousInclination">Religious Values and Practices</Label>
                    <Textarea 
                      id="religiousInclination"
                      value={religiousForm.religiousInclination}
                      onChange={(e) => handleReligiousChange('religiousInclination', e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Share your religious values, practices, and beliefs..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={savingTab === 'religious'}>
                    {savingTab === 'religious' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Religious Information
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Education & Career Tab */}
          <TabsContent value="education" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" /> Education & Career
                </CardTitle>
                <CardDescription>
                  Details about your education and professional life
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEducationCareerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="education">Highest Education</Label>
                      <Select 
                        value={educationCareerForm.education} 
                        onValueChange={(value) => handleEducationCareerChange('education', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select education" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">High School</SelectItem>
                          <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                          <SelectItem value="masters">Master's Degree</SelectItem>
                          <SelectItem value="phd">PhD / Doctorate</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="educationDetails">Educational Details</Label>
                      <Input 
                        id="educationDetails"
                        value={educationCareerForm.educationDetails}
                        onChange={(e) => handleEducationCareerChange('educationDetails', e.target.value)}
                        placeholder="University/institution, field of study"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession</Label>
                      <Input 
                        id="profession"
                        value={educationCareerForm.profession}
                        onChange={(e) => handleEducationCareerChange('profession', e.target.value)}
                        placeholder="Your profession"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input 
                        id="jobTitle"
                        value={educationCareerForm.jobTitle}
                        onChange={(e) => handleEducationCareerChange('jobTitle', e.target.value)}
                        placeholder="Your current position"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="income">Income Range (Optional)</Label>
                      <Select 
                        value={educationCareerForm.income} 
                        onValueChange={(value) => handleEducationCareerChange('income', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select range (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          <SelectItem value="under-30k">Under ₹30,000 monthly</SelectItem>
                          <SelectItem value="30k-50k">₹30,000 - ₹50,000 monthly</SelectItem>
                          <SelectItem value="50k-100k">₹50,000 - ₹1,00,000 monthly</SelectItem>
                          <SelectItem value="above-100k">Above ₹1,00,000 monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workExperience">Work Experience</Label>
                    <Textarea 
                      id="workExperience"
                      value={educationCareerForm.workExperience}
                      onChange={(e) => handleEducationCareerChange('workExperience', e.target.value)}
                      placeholder="Brief description of your work experience..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={savingTab === 'education'}>
                    {savingTab === 'education' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Education & Career Information
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Family Info Tab */}
          <TabsContent value="family" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="mr-2 h-5 w-5" /> Family Information
                </CardTitle>
                <CardDescription>
                  Details about your family background
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFamilySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="familyType">Family Type</Label>
                      <Select 
                        value={familyForm.familyType} 
                        onValueChange={(value) => handleFamilyChange('familyType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select family type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="joint">Joint Family</SelectItem>
                          <SelectItem value="nuclear">Nuclear Family</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="siblings">Siblings</Label>
                      <Input 
                        id="siblings"
                        value={familyForm.siblings}
                        onChange={(e) => handleFamilyChange('siblings', e.target.value)}
                        placeholder="Number and details of siblings"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="livingWithParents">Living With Parents</Label>
                      <Select 
                        value={familyForm.livingWithParents} 
                        onValueChange={(value) => handleFamilyChange('livingWithParents', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="occasionally">Occasionally</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="familyValues">Family Values</Label>
                      <Select 
                        value={familyForm.familyValues} 
                        onValueChange={(value) => handleFamilyChange('familyValues', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select values" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="traditional">Traditional</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="liberal">Liberal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="familyDetails">Family Details</Label>
                    <Textarea 
                      id="familyDetails"
                      value={familyForm.familyDetails}
                      onChange={(e) => handleFamilyChange('familyDetails', e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Share more about your family background..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={savingTab === 'family'}>
                    {savingTab === 'family' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Family Information
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Partner Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5" /> Partner Preferences
                </CardTitle>
                <CardDescription>
                  Details about what you're looking for in a partner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePartnerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferredAgeMin">Preferred Age Range (Min)</Label>
                      <Input 
                        id="preferredAgeMin"
                        type="number"
                        value={partnerForm.preferredAgeMin}
                        onChange={(e) => handlePartnerChange('preferredAgeMin', e.target.value)}
                        placeholder="Minimum age"
                        min="18"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preferredAgeMax">Preferred Age Range (Max)</Label>
                      <Input 
                        id="preferredAgeMax"
                        type="number"
                        value={partnerForm.preferredAgeMax}
                        onChange={(e) => handlePartnerChange('preferredAgeMax', e.target.value)}
                        placeholder="Maximum age"
                        min="18"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preferredEducation">Preferred Education Level</Label>
                      <Input 
                        id="preferredEducation"
                        value={partnerForm.preferredEducation}
                        onChange={(e) => handlePartnerChange('preferredEducation', e.target.value)}
                        placeholder="Education preference"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preferredLocation">Preferred Location</Label>
                      <Input 
                        id="preferredLocation"
                        value={partnerForm.preferredLocation}
                        onChange={(e) => handlePartnerChange('preferredLocation', e.target.value)}
                        placeholder="City, country or region"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preferredOccupation">Preferred Occupation</Label>
                      <Input 
                        id="preferredOccupation"
                        value={partnerForm.preferredOccupation}
                        onChange={(e) => handlePartnerChange('preferredOccupation', e.target.value)}
                        placeholder="Occupation preference"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expectations">Expectations & Requirements</Label>
                    <Textarea 
                      id="expectations"
                      value={partnerForm.expectations}
                      onChange={(e) => handlePartnerChange('expectations', e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Describe your expectations from a potential spouse..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={savingTab === 'preferences'}>
                    {savingTab === 'preferences' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Partner Preferences
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Privacy Settings Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" /> Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control who can see your profile and information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePrivacySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showContactInfo"
                        checked={privacyForm.showContactInfo}
                        onChange={(e) => handlePrivacyChange('showContactInfo', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                      />
                      <Label htmlFor="showContactInfo">Show Contact Information to Matches</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showPhotos"
                        checked={privacyForm.showPhotos}
                        onChange={(e) => handlePrivacyChange('showPhotos', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                      />
                      <Label htmlFor="showPhotos">Show Photos to All Members</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hideProfile"
                        checked={privacyForm.hideProfile}
                        onChange={(e) => handlePrivacyChange('hideProfile', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                      />
                      <Label htmlFor="hideProfile">Hide Profile from Search Results</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showOnlineStatus"
                        checked={privacyForm.showOnlineStatus}
                        onChange={(e) => handlePrivacyChange('showOnlineStatus', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                      />
                      <Label htmlFor="showOnlineStatus">Show Online Status</Label>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Alert>
                      <AlertDescription>
                        Privacy settings control what information is visible to other users. 
                        Premium members have additional privacy controls.
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={savingTab === 'privacy'}>
                    {savingTab === 'privacy' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Privacy Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Navigation */}
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
