"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { 
  basicInfoSchema,
  religiousInfoSchema,
  educationCareerSchema,
  familyInfoSchema,
  partnerPreferencesSchema,
  privacySettingsSchema,
  type ValidationError
} from "@/lib/validations/profile"
import { validateImage, resizeImage } from "@/lib/utils/image-utils"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  User, 
  Heart, 
  Save, 
  Camera, 
  Book, 
  GraduationCap, 
  Briefcase, 
  Home, 
  Users, 
  UserCircle, 
  MapPin,
  Image as ImageIcon,
  Settings,
  Lock,
  Eye,
  EyeOff,
  Trash2
} from "lucide-react"

type ProfileVisibility = "all-members" | "premium-only" | "match-criteria";

interface Profile {
  id: string;
  fullName: string;
  age?: number;
  email: string;
  phone?: string;
  gender?: string;
  height?: string;
  weight?: string;
  complexion?: string;
  maritalStatus?: string;
  languages?: string[];
  city?: string;
  state?: string;
  country?: string;
  aboutMe?: string;
  profilePhoto?: string;
  joinedDate?: string;
  lastUpdated?: string;
  sect?: string;
  prayerHabit?: string;
  hijab?: string;
  quranReading?: string;
  islamicEducation?: string;
  religiousValues?: string;
  attendsMosque?: string;
  education?: string;
  university?: string;
  profession?: string;
  company?: string;
  experience?: string;
  income?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  siblings?: string;
  familyType?: string;
  familyValues?: string;
  livingWithParents?: string;
  preferredAgeMin?: number;
  preferredAgeMax?: number;
  preferredHeight?: string;
  preferredEducation?: string;
  preferredProfession?: string;
  preferredLocation?: string;
  preferredSect?: string;
  preferredReligiosity?: string;
  expectations?: string;
  showContactInfo?: boolean;
  showPhotoToAll?: boolean;
  profileVisibility?: ProfileVisibility;
  allowMessages?: boolean;
  gallery?: string[];
}

const sectOptions = [
  { value: "Sunni", label: "Sunni" },
  { value: "Shia", label: "Shia" },
  { value: "Other", label: "Other" },
  { value: "No Preference", label: "No Preference" },
];

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'success';
type PendingAction = null | 'save' | 'navigate';

export default function EditProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  
  // Add missing state variables
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  // Form section states
  const [basicInfo, setBasicInfo] = useState({
    fullName: "",
    age: "",
    email: "",
    phone: "",
    gender: "",
    height: "",
    weight: "",
    complexion: "",
    maritalStatus: "",
    languages: [] as string[],
    city: "",
    state: "",
    country: "",
    bio: "",
    id: "",
    profilePhoto: "",
    joinedDate: "",
    lastUpdated: ""
  })
  
  const [religiousInfo, setReligiousInfo] = useState({
    sect: "",
    prayerHabit: "",
    hijab: "",
    quranReading: "",
    islamicEducation: "",
    religiousValues: "",
    attendsMosque: ""
  })
  
  const [educationCareer, setEducationCareer] = useState({
    education: "",
    university: "",
    profession: "",
    company: "",
    experience: "",
    income: ""
  })
  
  const [familyInfo, setFamilyInfo] = useState({
    fatherOccupation: "",
    motherOccupation: "",
    siblings: "",
    familyType: "",
    familyValues: "",
    livingWithParents: ""
  })
  
  const [partnerPreferences, setPartnerPreferences] = useState({
    ageRange: "",
    heightRange: "",
    education: "",
    profession: "",
    location: "",
    sect: "",
    religiosity: "",
    expectations: ""
  })
  
  type ProfileVisibility = "all-members" | "premium-only" | "match-criteria";

const [privacySettings, setPrivacySettings] = useState({
    showContactInfo: false,
    showPhotoToAll: false,
    profileVisibility: "all-members" as ProfileVisibility,
    allowMessages: true
  })
    const [galleryPhotos, setGalleryPhotos] = useState<string[]>([])
  const maxGalleryPhotos = 6
  
  useEffect(() => {
    const fetchProfile = async (retryCount = 0) => {
      if (status === "loading") return;
      
      if (status === "unauthenticated") {
        setError("Please log in to access your profile.");
        setLoading(false);
        router.push('/login?callbackUrl=/edit-profile');
        return;
      }

      if (!session?.user?.id) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      setLoading(true)
      setError(null)
      
      try {
        const res = await fetch(`/api/profiles/${session.user.id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
          credentials: 'include'
        })
        
        if (!res.ok) {
          // Retry on 5xx errors
          if (res.status >= 500 && retryCount < 3) {
            console.log(`Retrying profile fetch (attempt ${retryCount + 1})...`)
            setTimeout(() => fetchProfile(retryCount + 1), 1000 * (retryCount + 1))
            return
          }
          
          if (res.status === 401) {
            setError("Your session has expired. Please log in again.");
            router.push('/login?callbackUrl=/edit-profile');
            return;
          }
          
          throw new Error(await res.text())
        }
        
        const profile: Profile = await res.json()
        
        if (!profile || !profile.id) {
          throw new Error('Invalid profile data received')
        }
        
        // Update basic info
        setBasicInfo(prev => ({
          ...prev,
          fullName: profile.fullName || prev.fullName,
          age: profile.age ? String(profile.age) : prev.age,
          email: profile.email || prev.email,
          phone: profile.phone || prev.phone,
          gender: profile.gender || prev.gender,
          height: profile.height || prev.height,
          weight: profile.weight || prev.weight,
          complexion: profile.complexion || prev.complexion,
          maritalStatus: profile.maritalStatus || prev.maritalStatus,
          languages: profile.languages || prev.languages,
          city: profile.city || prev.city,
          state: profile.state || prev.state,
          country: profile.country || prev.country,
          bio: profile.aboutMe || prev.bio,
          id: profile.id || prev.id,
          profilePhoto: profile.profilePhoto || prev.profilePhoto
        }))

        // Update religious info
        setReligiousInfo(prev => ({
          ...prev,
          sect: profile.sect || prev.sect,
          prayerHabit: profile.prayerHabit || prev.prayerHabit,
          hijab: profile.hijab || prev.hijab,
          quranReading: profile.quranReading || prev.quranReading,
          islamicEducation: profile.islamicEducation || prev.islamicEducation,
          religiousValues: profile.religiousValues || prev.religiousValues,
          attendsMosque: profile.attendsMosque || prev.attendsMosque
        }))

        // Update other sections...
        setEducationCareer(prev => ({
          ...prev,
          education: profile.education || prev.education,
          university: profile.university || prev.university,
          profession: profile.profession || prev.profession,
          company: profile.company || prev.company,
          experience: profile.experience || prev.experience,
          income: profile.income || prev.income
        }))

        setFamilyInfo(prev => ({
          ...prev,
          fatherOccupation: profile.fatherOccupation || prev.fatherOccupation,
          motherOccupation: profile.motherOccupation || prev.motherOccupation,
          siblings: profile.siblings || prev.siblings,
          familyType: profile.familyType || prev.familyType,
          familyValues: profile.familyValues || prev.familyValues,
          livingWithParents: profile.livingWithParents || prev.livingWithParents
        }))

        setPartnerPreferences(prev => ({
          ...prev,
          ageRange: profile.preferredAgeMin && profile.preferredAgeMax 
            ? `${profile.preferredAgeMin}-${profile.preferredAgeMax}` 
            : prev.ageRange,
          heightRange: profile.preferredHeight || prev.heightRange,
          education: profile.preferredEducation || prev.education,
          profession: profile.preferredProfession || prev.profession,
          location: profile.preferredLocation || prev.location,
          sect: profile.preferredSect || prev.sect,
          religiosity: profile.preferredReligiosity || prev.religiosity,
          expectations: profile.expectations || prev.expectations
        }))

        const validateVisibility = (value: any): value is ProfileVisibility =>
          value === "all-members" || value === "premium-only" || value === "match-criteria"

        setPrivacySettings(prev => ({
          ...prev,
          showContactInfo: profile.showContactInfo ?? prev.showContactInfo,
          showPhotoToAll: profile.showPhotoToAll ?? prev.showPhotoToAll,
          profileVisibility: validateVisibility(profile.profileVisibility) 
            ? profile.profileVisibility 
            : prev.profileVisibility,
          allowMessages: profile.allowMessages ?? prev.allowMessages
        }))

        setGalleryPhotos(profile.gallery || [])
        
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError(err instanceof Error ? err.message : "Failed to load profile")
      } finally {        setLoading(false)
      }
    }

    fetchProfile()
  }, [session, status, router])

  // Show loading state
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

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="text-destructive mb-4">
                <XCircle className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Validation functions
  const validateBasicInfo = async () => {
    try {
      const result = basicInfoSchema.safeParse(basicInfo)
      if (!result.success) {
        const errors: { [key: string]: string } = {}
        result.error.errors.forEach(err => {
          errors[err.path.join('.')] = err.message
        })
        setValidationErrors(prev => ({ ...prev, ...errors }))
        return false
      }
      return true
    } catch (error) {
      console.error('Validation error:', error)
      return false
    }
  }

  const validateSectionData = async (
    data: any,
    schema: typeof basicInfoSchema | typeof religiousInfoSchema | typeof educationCareerSchema | typeof familyInfoSchema | typeof partnerPreferencesSchema | typeof privacySettingsSchema,
    section: string
  ): Promise<boolean> => {
    try {
      const result = schema.safeParse(data)
      if (!result.success) {
        const errors: { [key: string]: string } = {}
        result.error.errors.forEach((err: { path: (string | number)[]; message: string }) => {
          errors[`${section}.${err.path.join('.')}`] = err.message
        })
        setValidationErrors(prev => ({ ...prev, ...errors }))
        return false
      }
      return true
    } catch (error) {
      console.error(`Validation error in ${section}:`, error)
      return false
    }
  }

  const validateAllSections = async () => {
    const validations = [
      validateSectionData(basicInfo, basicInfoSchema, 'basicInfo'),
      validateSectionData(religiousInfo, religiousInfoSchema, 'religiousInfo'),
      validateSectionData(educationCareer, educationCareerSchema, 'educationCareer'),
      validateSectionData(familyInfo, familyInfoSchema, 'familyInfo'),
      validateSectionData(partnerPreferences, partnerPreferencesSchema, 'partnerPreferences'),
      validateSectionData(privacySettings, privacySettingsSchema, 'privacySettings')
    ]

    const results = await Promise.all(validations)
    return results.every(Boolean)
  }

  // Image handling with validation
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'gallery') => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const validationResult = await validateImage(file)
      if (!validationResult.valid) {
        toast({
          title: "Image Validation Error",
          description: validationResult.error,
          variant: "destructive"
        })
        return
      }

      // Resize image if needed
      const resizedImage = await resizeImage(file)
      const formData = new FormData()
      formData.append('image', resizedImage)
      formData.append('type', type)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()

      if (type === 'profile') {
        setBasicInfo(prev => ({ ...prev, profilePhoto: data.url }))
      } else {
        setGalleryPhotos(prev => [...prev, data.url])
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      console.error('Image upload error:', error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Handle form submission with validation
  const handleFormSubmit = async () => {
    setIsSubmitting(true)
    setValidationErrors({})

    try {
      const isValid = await validateAllSections()
      if (!isValid) {
        toast({
          title: "Validation Error",
          description: "Please check the form for errors",
          variant: "destructive"
        })
        setIsSubmitting(false)
        return
      }

      // Prepare data for submission
      const formData = {
        basicInfo,
        religiousInfo,
        educationCareer,
        familyInfo,
        partnerPreferences,
        privacySettings
      }

      const response = await fetch(`/api/profiles/${session?.user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to update profile')
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error('Form submission error:', error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveChanges = async (section: string) => {
    if (!session) {
      router.push('/login?callbackUrl=/edit-profile')
      return
    }

    setSaveStatus("saving")
    
    // Prepare payload based on section
    let payload: any = {}
    switch(section) {
      case "basic":
        payload = { basicInfo }
        break
      case "religious":
        payload = { religiousInfo }
        break
      case "education":
        payload = { educationCareer }
        break
      case "family":
        payload = { familyInfo }
        break
      case "preferences":
        payload = { partnerPreferences }
        break
      case "privacy":
        payload = { privacySettings }
        break
      case "all":
        payload = {
          basicInfo,
          religiousInfo,
          educationCareer,
          familyInfo,
          partnerPreferences,
          privacySettings
        }
        break
    }

    try {
      // Validate required fields based on section
      const validateSection = async (section: string, data: any) => {
        switch(section) {
          case "basic":
            return validateSectionData(data, basicInfoSchema, 'basicInfo')
          case "religious":
            return validateSectionData(data, religiousInfoSchema, 'religiousInfo')
          case "education":
            return validateSectionData(data, educationCareerSchema, 'educationCareer')
          case "family":
            return validateSectionData(data, familyInfoSchema, 'familyInfo')
          case "preferences":
            return validateSectionData(data, partnerPreferencesSchema, 'partnerPreferences')
          case "privacy":
            return validateSectionData(data, privacySettingsSchema, 'privacySettings')
          default:
            return true
        }
      }

      if (section !== 'all') {
        const isValid = await validateSection(section, payload[Object.keys(payload)[0]])
        if (!isValid) {
          setSaveStatus("error")
          return
        }
      } else {
        const isValid = await validateAllSections()
        if (!isValid) {
          setSaveStatus("error")
          return
        }
      }

      const res = await fetch('/api/profiles/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const responseData = await res.json()

      if (!res.ok) {
        setSaveStatus("error")
        toast({
          title: "Update Failed",
          description: responseData.message || "Failed to update profile",
          variant: "destructive"
        })
        return
      }

      setSaveStatus("saved")
      setHasUnsavedChanges(false)
      toast({
        title: "Success",
        description: "Profile updated successfully"
      })
    } catch (err) {
      setSaveStatus("error")
      toast({
        title: "Update Failed",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive"
      })
    }
  }

  const handleSave = async (section: string) => {
    await handleSaveChanges(section)
    setHasUnsavedChanges(false)
  }

  // Handle unsaved changes when navigating away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleConfirmDialogAction = (confirmed: boolean) => {
    setShowConfirmDialog(false)
    if (confirmed && pendingAction) {
      if (pendingAction === 'save') {
        handleFormSubmit()
      } else if (pendingAction === 'navigate') {
        setHasUnsavedChanges(false)
        router.push('/dashboard')
      }
      setPendingAction(null)
    }
  }

  // Add handlers for form changes
  const handleFormChange = () => {
    setHasUnsavedChanges(true)
    setSaveStatus('idle')
  }

  // Update each form section's onChange to trigger handleFormChange
  useEffect(() => {
    if (saveStatus === 'saved') {
      setHasUnsavedChanges(false)
    }
  }, [saveStatus])

  // Add confirmation dialog component
  const ConfirmDialog = () => (
    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unsaved Changes</DialogTitle>
        </DialogHeader>
        <p>You have unsaved changes. Are you sure you want to leave?</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive"            onClick={() => {
              setShowConfirmDialog(false)
              if (pendingAction === 'save') {
                handleFormSubmit()
              } else if (pendingAction === 'navigate') {
                setHasUnsavedChanges(false)
                router.push('/dashboard')
              }
              setPendingAction(null)
            }}
          >
            Discard Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const [locationTouched, setLocationTouched] = useState(false)
  
  // Profile photo handling
  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleImageUpload(e, 'profile')
    handleFormChange()
  }

  // Gallery photo handling
  const handleGalleryPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (galleryPhotos.length >= maxGalleryPhotos) {
      toast({
        title: "Gallery Full",
        description: `You can only upload up to ${maxGalleryPhotos} photos`,
        variant: "destructive"
      })
      return
    }
    await handleImageUpload(e, 'gallery')
    handleFormChange()
  }

  const handleDeleteGalleryPhoto = async (photoUrl: string) => {
    try {
      setSaveStatus("saving")
      const response = await fetch('/api/upload/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: photoUrl })
      })

      if (!response.ok) {
        throw new Error('Failed to delete photo')
      }

      setGalleryPhotos(prev => prev.filter(url => url !== photoUrl))
      handleFormChange()
      
      toast({
        title: "Success",
        description: "Photo deleted successfully"
      })
      setSaveStatus("idle")
    } catch (error) {
      console.error('Delete photo error:', error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete photo. Please try again.",
        variant: "destructive"
      })
      setSaveStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>

          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={basicInfo.profilePhoto || "/placeholder.svg?height=150&width=150"} alt={basicInfo.fullName || "Profile Photo"} />
                    <AvatarFallback className="text-2xl">
                      {basicInfo.fullName ? basicInfo.fullName.split(" ").map((n: string) => n[0]).join("") : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    accept="image/*"
                    id="profile-photo-input"
                    style={{ display: 'none' }}
                    onChange={handleProfilePhotoChange}
                  />
                  <Button size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full" onClick={() => document.getElementById('profile-photo-input')?.click()}>
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl font-bold mb-2">{basicInfo.fullName || "Your Name"}</h2>
                  <p className="text-muted-foreground mb-2">
                    ID: NS{basicInfo.id || "-"} • Joined: {basicInfo.joinedDate || "-"} • Last Updated: {basicInfo.lastUpdated || "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your profile is visible to other members. Last updated {basicInfo.lastUpdated || "recently"}.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    className="gradient-emerald text-white"
                    onClick={() => handleSave("all")}
                    disabled={saveStatus === "saving"}
                  >                    {saveStatus === "saving" ? (
                      <>Saving...</>
                    ) : saveStatus === "saved" ? (
                      <>Saved <Save className="h-4 w-4 ml-2" /></>
                    ) : (
                      <>Save All Changes</>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Tabs */}
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-7">
              <TabsTrigger value="basic">
                <User className="h-4 w-4 mr-2 md:mr-0 md:mb-1" />
                <span className="md:block">Basic</span>
              </TabsTrigger>
              <TabsTrigger value="religious">
                <Book className="h-4 w-4 mr-2 md:mr-0 md:mb-1" />
                <span className="md:block">Religious</span>
              </TabsTrigger>
              <TabsTrigger value="education">
                <GraduationCap className="h-4 w-4 mr-2 md:mr-0 md:mb-1" />
                <span className="md:block">Education</span>
              </TabsTrigger>
              <TabsTrigger value="family">
                <Users className="h-4 w-4 mr-2 md:mr-0 md:mb-1" />
                <span className="md:block">Family</span>
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Heart className="h-4 w-4 mr-2 md:mr-0 md:mb-1" />
                <span className="md:block">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="photos">
                <ImageIcon className="h-4 w-4 mr-2 md:mr-0 md:mb-1" />
                <span className="md:block">Photos</span>
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Lock className="h-4 w-4 mr-2 md:mr-0 md:mb-1" />
                <span className="md:block">Privacy</span>
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={basicInfo.fullName}
                        onChange={(e) => {
                          setBasicInfo({ ...basicInfo, fullName: e.target.value })
                          // Clear validation error when user starts typing
                          if (validationErrors['basicInfo.fullName']) {
                            setValidationErrors(prev => {
                              const { ['basicInfo.fullName']: _, ...rest } = prev
                              return rest
                            })
                          }
                        }}
                        onBlur={handleFormChange}
                        className={validationErrors['basicInfo.fullName'] ? 'border-red-500' : ''}
                        disabled={isSubmitting}
                      />
                      {validationErrors['basicInfo.fullName'] && (
                        <p className="text-sm text-red-500 mt-1">{validationErrors['basicInfo.fullName']}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={basicInfo.age}
                        onChange={(e) => setBasicInfo({ ...basicInfo, age: e.target.value })}
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={basicInfo.email}
                        onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">WhatsApp Phone Number *</Label>
                      <Input
                        id="phone"
                        value={basicInfo.phone}
                        onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        value={basicInfo.height}
                        onChange={(e) => setBasicInfo({ ...basicInfo, height: e.target.value })}
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="complexion">Complexion</Label>
                      <Select 
                        value={basicInfo.complexion}
                        onValueChange={(value) => setBasicInfo({ ...basicInfo, complexion: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select complexion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Very Fair">Very Fair</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Wheatish">Wheatish</SelectItem>
                          <SelectItem value="Wheatish Brown">Wheatish Brown</SelectItem>
                          <SelectItem value="Brown">Brown</SelectItem>
                          <SelectItem value="Dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select 
                        value={basicInfo.maritalStatus}
                        onValueChange={(value) => setBasicInfo({ ...basicInfo, maritalStatus: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select marital status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Never Married">Never Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                          <SelectItem value="Separated">Separated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={basicInfo.city}
                        onChange={(e) => setBasicInfo({ ...basicInfo, city: e.target.value })}
                        onBlur={handleFormChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">About Me</Label>
                    <Textarea
                      id="bio"
                      rows={5}
                      value={basicInfo.bio}
                      onChange={(e) => setBasicInfo({ ...basicInfo, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => router.push('/dashboard')}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleFormSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Religious Information Tab */}
            <TabsContent value="religious">
              <Card>
                <CardHeader>
                  <CardTitle>Religious Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sect">Islamic Sect</Label>
                      <Select 
                        value={religiousInfo.sect}
                        onValueChange={(value) => setReligiousInfo({ ...religiousInfo, sect: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sect" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectOptions.filter(opt => opt.value !== "No Preference").map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="prayerHabit">Prayer Habit</Label>
                      <Select 
                        value={religiousInfo.prayerHabit}
                        onValueChange={(value) => setReligiousInfo({ ...religiousInfo, prayerHabit: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select prayer habit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regular">5 times a day regularly</SelectItem>
                          <SelectItem value="Mostly">Most of the 5 prayers</SelectItem>
                          <SelectItem value="Sometimes">Sometimes</SelectItem>
                          <SelectItem value="Rarely">Rarely</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="hijab">Hijab/Beard</Label>
                      <Select 
                        value={religiousInfo.hijab}
                        onValueChange={(value) => setReligiousInfo({ ...religiousInfo, hijab: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes, always</SelectItem>
                          <SelectItem value="Sometimes">Sometimes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="Planning">Planning to start</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="quranReading">Quran Reading</Label>
                      <Select 
                        value={religiousInfo.quranReading}
                        onValueChange={(value) => setReligiousInfo({ ...religiousInfo, quranReading: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select quran reading level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced with Tajweed">Advanced with Tajweed</SelectItem>
                          <SelectItem value="Hafiz">Hafiz/Hafiza</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleSave("religious")} 
                      disabled={saveStatus === "saving"}
                      className="gradient-emerald text-white"
                    >
                      {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education & Career Tab */}
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Education & Career</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="education">Highest Education</Label>
                      <Input
                        id="education"
                        value={educationCareer.education}
                        onChange={(e) => setEducationCareer({ ...educationCareer, education: e.target.value })}
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="university">University/College</Label>
                      <Input
                        id="university"
                        value={educationCareer.university}
                        onChange={(e) => setEducationCareer({ ...educationCareer, university: e.target.value })}
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="profession">Profession</Label>
                      <Input
                        id="profession"
                        value={educationCareer.profession}
                        onChange={(e) => setEducationCareer({ ...educationCareer, profession: e.target.value })}
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={educationCareer.company}
                        onChange={(e) => setEducationCareer({ ...educationCareer, company: e.target.value })}
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="experience">Work Experience</Label>
                      <Input
                        id="experience"
                        value={educationCareer.experience}
                        onChange={(e) => setEducationCareer({ ...educationCareer, experience: e.target.value })}
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="income">Annual Income</Label>
                      <Select 
                        value={educationCareer.income}
                        onValueChange={(value) => setEducationCareer({ ...educationCareer, income: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select income range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="₹0-5 Lakhs per annum">₹0-5 Lakhs per annum</SelectItem>
                          <SelectItem value="₹5-10 Lakhs per annum">₹5-10 Lakhs per annum</SelectItem>
                          <SelectItem value="₹10-15 Lakhs per annum">₹10-15 Lakhs per annum</SelectItem>
                          <SelectItem value="₹15-25 Lakhs per annum">₹15-25 Lakhs per annum</SelectItem>
                          <SelectItem value="₹25-50 Lakhs per annum">₹25-50 Lakhs per annum</SelectItem>
                          <SelectItem value="₹50+ Lakhs per annum">₹50+ Lakhs per annum</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleSave("education")} 
                      disabled={saveStatus === "saving"}
                      className="gradient-emerald text-white"
                    >
                      {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Family Information Tab */}
            <TabsContent value="family">
              <Card>
                <CardHeader>
                  <CardTitle>Family Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fatherOccupation">Father's Occupation</Label>
                      <Input
                        id="fatherOccupation"
                        value={familyInfo.fatherOccupation}
                        onChange={(e) => setFamilyInfo({ ...familyInfo, fatherOccupation: e.target.value })}
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="motherOccupation">Mother's Occupation</Label>
                      <Input
                        id="motherOccupation"
                        value={familyInfo.motherOccupation}
                        onChange={(e) => setFamilyInfo({ ...familyInfo, motherOccupation: e.target.value })}
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="siblings">Siblings</Label>
                      <Input
                        id="siblings"
                        value={familyInfo.siblings}
                        onChange={(e) => setFamilyInfo({ ...familyInfo, siblings: e.target.value })}
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="familyType">Family Type</Label>
                      <Select 
                        value={familyInfo.familyType}
                        onValueChange={(value) => setFamilyInfo({ ...familyInfo, familyType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select family type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Joint Family">Joint Family</SelectItem>
                          <SelectItem value="Nuclear Family">Nuclear Family</SelectItem>
                          <SelectItem value="Living Alone">Living Alone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="familyValues">Family Values</Label>
                    <Textarea
                      id="familyValues"
                      rows={4}
                      value={familyInfo.familyValues}
                      onChange={(e) => setFamilyInfo({ ...familyInfo, familyValues: e.target.value })}
                      placeholder="Describe your family values..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleSave("family")} 
                      disabled={saveStatus === "saving"}
                      className="gradient-emerald text-white"
                    >
                      {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Partner Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Partner Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ageRange">Age Range</Label>
                      <Input
                        id="ageRange"
                        value={partnerPreferences.ageRange}
                        onChange={(e) => setPartnerPreferences({ ...partnerPreferences, ageRange: e.target.value })}
                        placeholder="e.g., 25-32"
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="heightRange">Height Range</Label>
                      <Input
                        id="heightRange"
                        value={partnerPreferences.heightRange}
                        onChange={(e) => setPartnerPreferences({ ...partnerPreferences, heightRange: e.target.value })}
                        placeholder="5.4 Ft"
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="prefEducation">Education</Label>
                      <Input
                        id="prefEducation"
                        value={partnerPreferences.education}
                        onChange={(e) => setPartnerPreferences({ ...partnerPreferences, education: e.target.value })}
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="prefProfession">Profession</Label>
                      <Input
                        id="prefProfession"
                        value={partnerPreferences.profession}
                        onChange={(e) => setPartnerPreferences({ ...partnerPreferences, profession: e.target.value })}
                        onBlur={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="prefLocation">Preferred Location *</Label>
                      <Input
                        id="prefLocation"
                        value={partnerPreferences.location}
                        onChange={(e) => setPartnerPreferences({ ...partnerPreferences, location: e.target.value })}
                        onBlur={() => {
                          setLocationTouched(true)
                          handleFormChange()
                        }}
                        required
                        className={partnerPreferences.location.trim() === "" && locationTouched ? "border-red-500" : ""}
                      />
                      {partnerPreferences.location.trim() === "" && locationTouched && (
                        <span className="text-xs text-red-500">Preferred location is required.</span>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="prefSect">Islamic Sect</Label>
                      <Select 
                        value={partnerPreferences.sect}
                        onValueChange={(value) => setPartnerPreferences({ ...partnerPreferences, sect: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sect preference" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="expectations">Expectations from Partner</Label>
                    <Textarea
                      id="expectations"
                      rows={4}
                      value={partnerPreferences.expectations}
                      onChange={(e) => setPartnerPreferences({ ...partnerPreferences, expectations: e.target.value })}
                      placeholder="Describe what you're looking for in a partner..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => {
                        if (!partnerPreferences.location.trim()) {
                          alert("Preferred location is required.");
                          return;
                        }
                        handleSave("preferences")
                      }} 
                      disabled={saveStatus === "saving"}
                      className="gradient-emerald text-white"
                    >
                      {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Photos Tab */}
            <TabsContent value="photos">
              <Card>
                <CardHeader>
                  <CardTitle>Photo Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4">Profile Photo</h3>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={basicInfo.profilePhoto || "/placeholder.svg?height=100&width=100"} alt="Profile Photo" />
                          <AvatarFallback className="text-2xl">
                            {basicInfo.fullName ? basicInfo.fullName.split(" ").map((n: string) => n[0]).join("") : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <input
                          type="file"
                          accept="image/*"
                          id="profile-photo-upload"
                          style={{ display: 'none' }}
                          onChange={handleProfilePhotoChange}
                        />
                        <Button size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full" onClick={() => document.getElementById('profile-photo-upload')?.click()}>
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Your profile photo is visible to all members. Upload a clear face photo for better responses.
                        </p>
                        <Button variant="outline" size="sm" onClick={() => document.getElementById('profile-photo-upload')?.click()}>Change Photo</Button>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="font-semibold mb-4">Photo Gallery</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add up to 6 photos to your gallery. These photos will be visible based on your privacy settings.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      {galleryPhotos.map((url, i) => (
                        <div key={url} className="border rounded-lg p-2 relative group">
                          <div className="relative aspect-square bg-muted rounded-md overflow-hidden">
                            <img 
                              src={url}
                              alt={`Gallery photo ${i+1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button size="icon" variant="outline" className="h-8 w-8 bg-white text-red-500" onClick={() => handleDeleteGalleryPhoto(url)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {galleryPhotos.length < maxGalleryPhotos && (
                        <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            id="gallery-photo-upload"
                            style={{ display: 'none' }}
                            onChange={handleGalleryPhotoUpload}
                          />
                          <Button variant="ghost" onClick={() => document.getElementById('gallery-photo-upload')?.click()}>
                            <Camera className="h-8 w-8 text-muted-foreground" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => handleSave("photos")} 
                        disabled={saveStatus === "saving"}
                        className="gradient-emerald text-white"
                      >
                        {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings Tab */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Show Contact Information</h3>
                        <p className="text-sm text-muted-foreground">
                          Allow other members to see your phone and email
                        </p>
                      </div>
                      <Switch
                        checked={privacySettings.showContactInfo}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({ ...privacySettings, showContactInfo: checked })
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Photo Privacy</h3>
                        <p className="text-sm text-muted-foreground">
                          Show photos to all members or only to those you've connected with
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {privacySettings.showPhotoToAll ? (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Switch
                          checked={privacySettings.showPhotoToAll}
                          onCheckedChange={(checked) => 
                            setPrivacySettings({ ...privacySettings, showPhotoToAll: checked })
                          }
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold mb-2">Profile Visibility</h3>
                      <Select 
                        value={privacySettings.profileVisibility}
                        onValueChange={(value: string) => {
                          const validValue = value as ProfileVisibility;
                          if (validValue === "all-members" || validValue === "premium-only" || validValue === "match-criteria") {
                            setPrivacySettings({ ...privacySettings, profileVisibility: validValue });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-members">All Members</SelectItem>
                          <SelectItem value="premium-only">Premium Members Only</SelectItem>
                          <SelectItem value="match-criteria">Only Those Who Match My Criteria</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Allow Messages</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive messages from other members
                        </p>
                      </div>
                      <Switch
                        checked={privacySettings.allowMessages}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({ ...privacySettings, allowMessages: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleSave("privacy")} 
                      disabled={saveStatus === "saving"}
                      className="gradient-emerald text-white"
                    >
                      {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />

      <ConfirmDialog />
    </div>
  )
}