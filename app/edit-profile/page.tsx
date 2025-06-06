"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
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

export default function EditProfilePage() {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
  
  const [basicInfo, setBasicInfo] = useState({
    fullName: "Fatima Ahmed",
    age: "26",
    email: "fatima.ahmed@email.com",
    phone: "+91 98765 43210",
    gender: "female",
    height: "5'4\"",
    weight: "55 kg",
    complexion: "Fair",
    maritalStatus: "Never Married",
    languages: ["Hindi", "English", "Urdu"],
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    bio: "Assalamu Alaikum! I am a practicing Muslim who believes in balancing deen and dunya. I work as a software engineer and love to learn new technologies. I'm looking for a life partner who shares similar values and is committed to growing together in faith and life. I enjoy cooking, reading Islamic books, and spending time with family.",
    id: "",
    profilePhoto: "",
    joinedDate: "",
    lastUpdated: ""
  })
  
  const [religiousInfo, setReligiousInfo] = useState({
    sect: "Sunni",
    prayerHabit: "Regular",
    hijab: "Yes",
    quranReading: "Intermediate",
    islamicEducation: "Basic Islamic studies",
    religiousValues: "Moderately practicing",
    attendsMosque: "Regularly"
  })
  
  const [educationCareer, setEducationCareer] = useState({
    education: "Master's in Computer Science",
    university: "Mumbai University",
    profession: "Software Engineer",
    company: "Tech Solutions Pvt Ltd",
    experience: "4 years",
    income: "₹10-15 Lakhs per annum"
  })
  
  const [familyInfo, setFamilyInfo] = useState({
    fatherOccupation: "Business Owner",
    motherOccupation: "Homemaker",
    siblings: "2 sisters, 1 brother",
    familyType: "Joint Family",
    familyValues: "Traditional with modern outlook",
    livingWithParents: "Yes"
  })
  
  const [partnerPreferences, setPartnerPreferences] = useState({
    ageRange: "25-32",
    heightRange: "5'6\" - 6'0\"",
    education: "Graduate or above",
    profession: "Any professional career",
    location: "Mumbai, Delhi, Bangalore",
    sect: "Sunni",
    religiosity: "Practicing",
    expectations: "Looking for someone who is kind, respectful, family-oriented and has a good understanding of Islam. Should have a stable career and be ready for marriage."
  })
  
  const [privacySettings, setPrivacySettings] = useState({
    showContactInfo: false,
    showPhotoToAll: false,
    profileVisibility: "all-members",
    allowMessages: true
  })
  
  // --- Gallery Photos State and Handlers ---
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([])
  const maxGalleryPhotos = 6

  useEffect(() => {
    // Load user data from localStorage if available
    const userStr = typeof window !== 'undefined' ? localStorage.getItem("currentUser") : null
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setBasicInfo((prev) => ({
          ...prev,
          fullName: user.fullName || prev.fullName,
          age: user.age ? String(user.age) : prev.age,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
          gender: user.gender || prev.gender,
          city: user.city || prev.city,
          country: user.country || prev.country,
          id: user.id || prev.id,
          profilePhoto: user.profilePhoto || prev.profilePhoto,
          joinedDate: user.joinedDate || prev.joinedDate,
          lastUpdated: user.lastUpdated || prev.lastUpdated,
        }))
      } catch {}
    }
  }, [])

  // Fetch user profile from backend and populate all state on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null
      const userStr = typeof window !== 'undefined' ? localStorage.getItem("currentUser") : null
      if (!token || !userStr) return
      let userId = null
      try { userId = JSON.parse(userStr).id } catch {}
      if (!userId) return
      try {
        const res = await fetch(`/api/profiles/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) return
        const profile = await res.json()
        setBasicInfo((prev) => ({
          ...prev,
          fullName: profile.fullName || prev.fullName,
          age: profile.age ? String(profile.age) : prev.age,
          email: profile.email || prev.email,
          phone: profile.phone || prev.phone,
          gender: profile.gender || prev.gender,
          city: profile.city || prev.city,
          country: profile.country || prev.country,
          height: profile.height || prev.height,
          complexion: profile.complexion || prev.complexion,
          maritalStatus: profile.maritalStatus || prev.maritalStatus,
          bio: profile.aboutMe || prev.bio,
          id: profile.id || prev.id,
          profilePhoto: profile.profilePhoto || prev.profilePhoto,
          joinedDate: profile.joinedDate || prev.joinedDate,
          lastUpdated: profile.lastUpdated || prev.lastUpdated,
        }))
        setReligiousInfo((prev) => ({
          ...prev,
          sect: profile.sect || prev.sect,
          // Add more fields as needed from backend
        }))
        setEducationCareer((prev) => ({
          ...prev,
          education: profile.education || prev.education,
          profession: profile.profession || prev.profession,
          // Add more fields as needed from backend
        }))
        setFamilyInfo((prev) => ({
          ...prev,
          familyValues: profile.familyDetails || prev.familyValues,
          // Add more fields as needed from backend
        }))
        setPartnerPreferences((prev) => ({
          ...prev,
          ageRange: profile.preferredAgeMin && profile.preferredAgeMax ? `${profile.preferredAgeMin}-${profile.preferredAgeMax}` : prev.ageRange,
          education: profile.preferredEducation || prev.education,
          location: profile.preferredLocation || prev.location,
          expectations: profile.expectations || prev.expectations,
          // Add more fields as needed from backend
        }))
        setGalleryPhotos(Array.isArray(profile.gallery) ? profile.gallery : [])
        // Optionally set privacySettings if backend supports
      } catch {}
    }
    fetchProfile()
  }, [])
  
  const handleSaveChanges = async (section: string) => {
    setSaveStatus("saving")
    let payload: any = {}
    if (section === "basic") payload = basicInfo
    else if (section === "religious") payload = religiousInfo
    else if (section === "education") payload = educationCareer
    else if (section === "family") payload = familyInfo
    else if (section === "preferences") payload = partnerPreferences
    else if (section === "privacy") payload = privacySettings
    else payload = {
      ...basicInfo,
      ...religiousInfo,
      ...educationCareer,
      ...familyInfo,
      ...partnerPreferences,
      ...privacySettings
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null
      if (!token) throw new Error("Not logged in.")
      const res = await fetch(`/api/profiles/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to save changes.")
      }
      const updated = await res.json()
      // Update localStorage for basic info changes
      if (section === "basic" || section === "all") {
        const userStr = typeof window !== 'undefined' ? localStorage.getItem("currentUser") : null
        const user = userStr ? JSON.parse(userStr) : null
        const newUser = { ...user, ...basicInfo, ...updated.user }
        localStorage.setItem("currentUser", JSON.stringify(newUser))
      }
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (err: any) {
      setSaveStatus("error")
      alert(err.message || "An error occurred while saving.")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  // Profile photo upload handler
  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('photo', file)
    setSaveStatus("saving")
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null
      if (!token) throw new Error("Not logged in.")
      const res = await fetch('/api/upload/profile-photo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData as any
      } as any)
      if (!res.ok) throw new Error("Failed to upload photo.")
      const data = await res.json()
      setBasicInfo((prev) => ({ ...prev, profilePhoto: data.url }))
      // Optionally update localStorage
      const userStr = typeof window !== 'undefined' ? localStorage.getItem("currentUser") : null
      if (userStr) {
        const user = JSON.parse(userStr)
        user.profilePhoto = data.url
        localStorage.setItem("currentUser", JSON.stringify(user))
      }
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (err: any) {
      setSaveStatus("error")
      alert(err.message || "Photo upload failed.")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  // --- Gallery Photos State and Handlers ---
  // (Already declared at top, so do not redeclare)

  // Fetch gallery photos from profile (if available)
  useEffect(() => {
    const fetchGallery = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null
      const userStr = typeof window !== 'undefined' ? localStorage.getItem("currentUser") : null
      if (!token || !userStr) return
      let userId = null
      try { userId = JSON.parse(userStr).id } catch {}
      if (!userId) return
      try {
        const res = await fetch(`/api/profiles/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) return
        const profile = await res.json()
        setGalleryPhotos(Array.isArray(profile.gallery) ? profile.gallery : [])
      } catch {}
    }
    fetchGallery()
  }, [])

  // Upload new gallery photo
  const handleGalleryPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (galleryPhotos.length >= maxGalleryPhotos) {
      alert("You can upload up to 6 gallery photos only.")
      return
    }
    const formData = new FormData()
    formData.append('photo', file)
    setSaveStatus("saving")
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null
      if (!token) throw new Error("Not logged in.")
      const res = await fetch('/api/profiles/upload-photo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData as any
      } as any)
      if (!res.ok) throw new Error("Failed to upload photo.")
      const data = await res.json()
      setGalleryPhotos((prev) => [...prev, data.photoUrl])
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (err: any) {
      setSaveStatus("error")
      alert(err.message || "Photo upload failed.")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  // Delete gallery photo
  const handleDeleteGalleryPhoto = async (photoUrl: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return
    setSaveStatus("saving")
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null
      if (!token) throw new Error("Not logged in.")
      const res = await fetch('/api/profiles/delete-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ photoUrl })
      })
      if (!res.ok) throw new Error("Failed to delete photo.")
      setGalleryPhotos((prev) => prev.filter((url) => url !== photoUrl))
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (err: any) {
      setSaveStatus("error")
      alert(err.message || "Photo delete failed.")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  const [locationTouched, setLocationTouched] = useState(false)

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
                    onClick={() => handleSaveChanges("all")}
                    disabled={saveStatus === "saving"}
                  >
                    {saveStatus === "saving" ? (
                      <>Saving...</>
                    ) : saveStatus === "success" ? (
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
                        onChange={(e) => setBasicInfo({ ...basicInfo, fullName: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={basicInfo.age}
                        onChange={(e) => setBasicInfo({ ...basicInfo, age: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={basicInfo.email}
                        onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">WhatsApp Phone Number *</Label>
                      <Input
                        id="phone"
                        value={basicInfo.phone}
                        onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        value={basicInfo.height}
                        onChange={(e) => setBasicInfo({ ...basicInfo, height: e.target.value })}
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

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleSaveChanges("basic")} 
                      disabled={saveStatus === "saving"}
                      className="gradient-emerald text-white"
                    >
                      {saveStatus === "saving" ? "Saving..." : "Save Changes"}
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
                          <SelectItem value="Sunni">Sunni</SelectItem>
                          <SelectItem value="Shia">Shia</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
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
                      onClick={() => handleSaveChanges("religious")} 
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
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="university">University/College</Label>
                      <Input
                        id="university"
                        value={educationCareer.university}
                        onChange={(e) => setEducationCareer({ ...educationCareer, university: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="profession">Profession</Label>
                      <Input
                        id="profession"
                        value={educationCareer.profession}
                        onChange={(e) => setEducationCareer({ ...educationCareer, profession: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={educationCareer.company}
                        onChange={(e) => setEducationCareer({ ...educationCareer, company: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="experience">Work Experience</Label>
                      <Input
                        id="experience"
                        value={educationCareer.experience}
                        onChange={(e) => setEducationCareer({ ...educationCareer, experience: e.target.value })}
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
                      onClick={() => handleSaveChanges("education")} 
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
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="motherOccupation">Mother's Occupation</Label>
                      <Input
                        id="motherOccupation"
                        value={familyInfo.motherOccupation}
                        onChange={(e) => setFamilyInfo({ ...familyInfo, motherOccupation: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="siblings">Siblings</Label>
                      <Input
                        id="siblings"
                        value={familyInfo.siblings}
                        onChange={(e) => setFamilyInfo({ ...familyInfo, siblings: e.target.value })}
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
                      onClick={() => handleSaveChanges("family")} 
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
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="heightRange">Height Range</Label>
                      <Input
                        id="heightRange"
                        value={partnerPreferences.heightRange}
                        onChange={(e) => setPartnerPreferences({ ...partnerPreferences, heightRange: e.target.value })}
                        placeholder="5.4 Ft"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="prefEducation">Education</Label>
                      <Input
                        id="prefEducation"
                        value={partnerPreferences.education}
                        onChange={(e) => setPartnerPreferences({ ...partnerPreferences, education: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="prefProfession">Profession</Label>
                      <Input
                        id="prefProfession"
                        value={partnerPreferences.profession}
                        onChange={(e) => setPartnerPreferences({ ...partnerPreferences, profession: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="prefLocation">Preferred Location *</Label>
                      <Input
                        id="prefLocation"
                        value={partnerPreferences.location}
                        onChange={(e) => setPartnerPreferences({ ...partnerPreferences, location: e.target.value })}
                        onBlur={() => setLocationTouched(true)}
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
                          <SelectItem value="Sunni">Sunni</SelectItem>
                          <SelectItem value="Shia">Shia</SelectItem>
                          <SelectItem value="No Preference">No Preference</SelectItem>
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
                        handleSaveChanges("preferences")
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
                        onClick={() => handleSaveChanges("photos")} 
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
                        onValueChange={(value) => setPrivacySettings({ ...privacySettings, profileVisibility: value })}
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
                      onClick={() => handleSaveChanges("privacy")} 
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
    </div>
  )
}