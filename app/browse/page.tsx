"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Heart, Star, MapPin, GraduationCap, Briefcase, Filter, Eye, MessageSquare } from "lucide-react"
import Link from "next/link"
import { playfair } from "../lib/fonts"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useSession } from "next-auth/react"

interface Profile {
  id: string
  name: string
  age: number
  location: string
  education: string
  profession?: string
  sect: string
  height: string
  maritalStatus?: string
  housing?: string
  image?: string
  profilePhoto?: string
  match?: number
  premium?: boolean
  verified?: boolean
}

export default function BrowseProfilesPage() {
  const { data: session } = useSession()
  const [filters, setFilters] = useState({
    ageRange: [18, 45],
    location: "",
    education: "",
    profession: "",
    sect: "",
    prayer: "",
    hijab: "",
    ageMin: "18",
    ageMax: "45",
    heightMin: "",
    heightMax: "",
    maritalStatus: "",
    housing: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [contactInfo, setContactInfo] = useState<string | null>(null)
  const [showContactDialog, setShowContactDialog] = useState(false)

  // Fetch real profiles from API
  useEffect(() => {
    setLoading(true)
    
    // Build query parameters based on filters
    const params = new URLSearchParams();
    params.append("limit", "100"); // Increase limit to get more profiles
    
    if (filters.ageMin) params.append("ageMin", filters.ageMin);
    if (filters.ageMax) params.append("ageMax", filters.ageMax);
    if (filters.location) params.append("location", filters.location);
    if (filters.education) params.append("education", filters.education);
    if (filters.sect) params.append("sect", filters.sect);
    
    // Log the API request for debugging
    console.log(`Fetching profiles with params: ${params.toString()}`);
    
    fetch(`/api/profiles?${params.toString()}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`API error with status ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.profiles && Array.isArray(data.profiles)) {
          console.log(`Received ${data.profiles.length} profiles from API`);
          setProfiles(data.profiles)
        } else {
          console.warn("API returned no profiles array:", data);
          setProfiles([]);
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching profiles:", error);
        setLoading(false)
      })
  }, [filters])

  // Check user subscription status from session
  useEffect(() => {
    if (session?.user) {
      // For now, we'll assume free users. In a real app, you'd fetch subscription status from the user profile
      setIsPremium(false)
    } else {
      setIsPremium(false)
    }
  }, [session])

  // Filtering logic (update to use real profiles)
  const filteredProfiles = profiles.filter((profile) => {
    const matchesAge =
      (!filters.ageMin || profile.age >= Number(filters.ageMin)) &&
      (!filters.ageMax || profile.age <= Number(filters.ageMax))
    const matchesHeight =
      (!filters.heightMin || parseFloat(profile.height) >= parseFloat(filters.heightMin)) &&
      (!filters.heightMax || parseFloat(profile.height) <= parseFloat(filters.heightMax))
    const matchesMaritalStatus = !filters.maritalStatus || profile.maritalStatus === filters.maritalStatus
    const matchesHousing = !filters.housing || profile.housing === filters.housing
    const matchesLocation = !filters.location || profile.location === filters.location
    const matchesEducation = !filters.education || profile.education === filters.education
    const matchesSect = !filters.sect || profile.sect === filters.sect
    const matchesSearch = !searchTerm || profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    return (
      matchesAge &&
      matchesHeight &&
      matchesMaritalStatus &&
      matchesHousing &&
      matchesLocation &&
      matchesEducation &&
      matchesSect &&
      matchesSearch
    )
  })

  // Contact Info logic
  const handleContactInfo = async (profile: Profile) => {
    if (!isPremium) {
      setShowUpgradeDialog(true)
      return
    }
    // Fetch contact info from API (replace with real endpoint)
    setContactInfo(null)
    setShowContactDialog(true)
    try {
      const res = await fetch(`/api/profiles/${profile.id}`)
      if (res.ok) {
        const data = await res.json()
        setContactInfo(data.phone || data.email || "Contact info not available")
      } else {
        setContactInfo("Contact info not available")
      }
    } catch {
      setContactInfo("Contact info not available")
    }
  }

  const [showApplyButton, setShowApplyButton] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowApplyButton(false);
    // If mobile filters are open, close them after applying
    if (showFilters) {
      setShowFilters(false);
    }
  };

  // Function to handle filter changes and show apply button
  const handleFilterChange = (newFilters: any) => {
    setTempFilters(newFilters);
    setShowApplyButton(true);
  };

  const FilterContent = () => (
    <div className="space-y-6 p-4">
      <div className="bg-primary/5 p-4 rounded-md border border-primary/20">
        <Label className="text-base font-semibold mb-3 block text-primary">Age Range</Label>
        <div className="mt-2">
          <Slider
            value={tempFilters.ageRange}
            onValueChange={(value) => {
              // Ensure minimum age is at least 18
              const minAge = Math.max(18, value[0]);
              // Ensure max age is at least min age
              const maxAge = Math.max(minAge, value[1]); 
              const newAgeRange = [minAge, maxAge];
              
              handleFilterChange({ 
                ...tempFilters, 
                ageRange: newAgeRange,
                ageMin: minAge.toString(),
                ageMax: maxAge.toString()
              });
            }}
            max={65}
            min={18}
            step={1}
            className="w-full relative [&>[role=slider]]:block"
          />
          <div className="flex justify-between text-sm font-medium mt-3">
            <div className="flex flex-col gap-1">
              <span className="bg-primary/10 px-3 py-1 rounded-full text-center">{tempFilters.ageRange[0]} years</span>
              <span className="text-xs text-center">Min Age</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="bg-primary/10 px-3 py-1 rounded-full text-center">{tempFilters.ageRange[1]} years</span>
              <span className="text-xs text-center">Max Age</span>
            </div>
          </div>
          
          {/* Precise Age Inputs */}
          <div className="flex gap-2 mt-4">
            <div className="flex-1">
              <Label className="mb-1 block text-xs">Min Age</Label>
              <Input 
                type="number" 
                min="18"
                max="65"
                value={tempFilters.ageMin}
                onChange={(e) => {
                  const minAge = Math.max(18, parseInt(e.target.value) || 18);
                  const maxAge = Math.max(minAge, parseInt(tempFilters.ageMax) || minAge);
                  handleFilterChange({
                    ...tempFilters,
                    ageMin: minAge.toString(),
                    ageMax: maxAge.toString(),
                    ageRange: [minAge, maxAge]
                  });
                }}
                className="h-8 text-sm"
              />
            </div>
            <div className="flex-1">
              <Label className="mb-1 block text-xs">Max Age</Label>
              <Input 
                type="number"
                min="18"
                max="65" 
                value={tempFilters.ageMax}
                onChange={(e) => {
                  const maxAge = Math.min(65, Math.max(18, parseInt(e.target.value) || 18));
                  const minAge = Math.min(parseInt(tempFilters.ageMin) || 18, maxAge);
                  handleFilterChange({
                    ...tempFilters,
                    ageMin: minAge.toString(),
                    ageMax: maxAge.toString(),
                    ageRange: [minAge, maxAge]
                  });
                }}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label>Height</Label>
        <div className="flex space-x-2">
          <Select
            value={tempFilters.heightMin}
            onValueChange={(value) => handleFilterChange({ ...tempFilters, heightMin: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Min height" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4.5">4'5" (135 cm)</SelectItem>
              <SelectItem value="4.6">4'6" (137 cm)</SelectItem>
              <SelectItem value="4.7">4'7" (140 cm)</SelectItem>
              <SelectItem value="4.8">4'8" (142 cm)</SelectItem>
              <SelectItem value="4.9">4'9" (145 cm)</SelectItem>
              <SelectItem value="4.10">4'10" (147 cm)</SelectItem>
              <SelectItem value="4.11">4'11" (150 cm)</SelectItem>
              <SelectItem value="5.0">5'0" (152 cm)</SelectItem>
              <SelectItem value="5.1">5'1" (155 cm)</SelectItem>
              <SelectItem value="5.2">5'2" (157 cm)</SelectItem>
              <SelectItem value="5.3">5'3" (160 cm)</SelectItem>
              <SelectItem value="5.4">5'4" (162 cm)</SelectItem>
              <SelectItem value="5.5">5'5" (165 cm)</SelectItem>
              <SelectItem value="5.6">5'6" (168 cm)</SelectItem>
              <SelectItem value="5.7">5'7" (170 cm)</SelectItem>
              <SelectItem value="5.8">5'8" (173 cm)</SelectItem>
              <SelectItem value="5.9">5'9" (175 cm)</SelectItem>
              <SelectItem value="5.10">5'10" (178 cm)</SelectItem>
              <SelectItem value="5.11">5'11" (180 cm)</SelectItem>
              <SelectItem value="6.0">6'0" (183 cm)</SelectItem>
              <SelectItem value="6.1">6'1" (185 cm)</SelectItem>
              <SelectItem value="6.2">6'2" (188 cm)</SelectItem>
              <SelectItem value="6.3">6'3" (190 cm)</SelectItem>
              <SelectItem value="6.4">6'4" (193 cm)</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={tempFilters.heightMax}
            onValueChange={(value) => handleFilterChange({ ...tempFilters, heightMax: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Max height" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4.5">4'5" (135 cm)</SelectItem>
              <SelectItem value="4.6">4'6" (137 cm)</SelectItem>
              <SelectItem value="4.7">4'7" (140 cm)</SelectItem>
              <SelectItem value="4.8">4'8" (142 cm)</SelectItem>
              <SelectItem value="4.9">4'9" (145 cm)</SelectItem>
              <SelectItem value="4.10">4'10" (147 cm)</SelectItem>
              <SelectItem value="4.11">4'11" (150 cm)</SelectItem>
              <SelectItem value="5.0">5'0" (152 cm)</SelectItem>
              <SelectItem value="5.1">5'1" (155 cm)</SelectItem>
              <SelectItem value="5.2">5'2" (157 cm)</SelectItem>
              <SelectItem value="5.3">5'3" (160 cm)</SelectItem>
              <SelectItem value="5.4">5'4" (162 cm)</SelectItem>
              <SelectItem value="5.5">5'5" (165 cm)</SelectItem>
              <SelectItem value="5.6">5'6" (168 cm)</SelectItem>
              <SelectItem value="5.7">5'7" (170 cm)</SelectItem>
              <SelectItem value="5.8">5'8" (173 cm)</SelectItem>
              <SelectItem value="5.9">5'9" (175 cm)</SelectItem>
              <SelectItem value="5.10">5'10" (178 cm)</SelectItem>
              <SelectItem value="5.11">5'11" (180 cm)</SelectItem>
              <SelectItem value="6.0">6'0" (183 cm)</SelectItem>
              <SelectItem value="6.1">6'1" (185 cm)</SelectItem>
              <SelectItem value="6.2">6'2" (188 cm)</SelectItem>
              <SelectItem value="6.3">6'3" (190 cm)</SelectItem>
              <SelectItem value="6.4">6'4" (193 cm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Marital Status</Label>
        <Select
          value={tempFilters.maritalStatus}
          onValueChange={(value) => handleFilterChange({ ...tempFilters, maritalStatus: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select marital status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="never-married">Never Married</SelectItem>
            <SelectItem value="divorced">Divorced</SelectItem>
            <SelectItem value="widowed">Widowed</SelectItem>
            <SelectItem value="any">Any</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Housing Status</Label>
        <Select
          value={tempFilters.housing}
          onValueChange={(value) => handleFilterChange({ ...tempFilters, housing: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select housing status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="own">Own House</SelectItem>
            <SelectItem value="rental">Rental</SelectItem>
            <SelectItem value="family">Living with Family</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Education Level</Label>
        <Select
          value={tempFilters.education}
          onValueChange={(value) => handleFilterChange({ ...tempFilters, education: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select education level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high-school">High School & above</SelectItem>
            <SelectItem value="bachelors">Bachelor's & above</SelectItem>
            <SelectItem value="masters">Master's & above</SelectItem>
            <SelectItem value="phd">PhD</SelectItem>
            <SelectItem value="islamic-studies">Islamic Studies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Location</Label>
        <Select
          value={tempFilters.location}
          onValueChange={(value) => handleFilterChange({ ...tempFilters, location: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="india">India</SelectItem>
            <SelectItem value="uae">United Arab Emirates</SelectItem>
            <SelectItem value="saudi-arabia">Saudi Arabia</SelectItem>
            <SelectItem value="qatar">Qatar</SelectItem>
            <SelectItem value="kuwait">Kuwait</SelectItem>
            <SelectItem value="oman">Oman</SelectItem>
            <SelectItem value="bahrain">Bahrain</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Maslak/Sect</Label>
        <Select
          value={tempFilters.sect}
          onValueChange={(value) => handleFilterChange({ ...tempFilters, sect: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Maslak/Sect" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sunni">Sunni</SelectItem>
            <SelectItem value="shafii">Shafi'i</SelectItem>
            <SelectItem value="ahle-sunnat-wal-jamaat">Ahle Sunnat Wal Jamaat</SelectItem>
            <SelectItem value="deobandi">Deobandi</SelectItem>
            <SelectItem value="shia">Shia</SelectItem>
            <SelectItem value="revert">Revert Muslim</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectItem value="no-preference">No Preference</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">          <Button
            onClick={() => {
            const defaultFilters = {
              ageRange: [18, 45],
              location: "",
              education: "",
              profession: "",
              sect: "",
              prayer: "",
              hijab: "",
              ageMin: "18",
              ageMax: "45",
              heightMin: "",
              heightMax: "",
              maritalStatus: "",
              housing: "",
            };
            setTempFilters(defaultFilters);
            setFilters(defaultFilters);
            setShowApplyButton(false);
          }}
          variant="outline"
          className="flex-1"
        >
          Clear Filters
        </Button>
        
        {showApplyButton && (
          <Button
            onClick={applyFilters}
            variant="default"
            className="flex-1 gradient-emerald text-white"
          >
            Apply Filters
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 shrink-0">
            <Card className="sticky top-24">
              <div className="p-4 border-b">
                <h2 className={`${playfair.className} font-semibold text-lg`}>Filters</h2>
              </div>
              <FilterContent />
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full sm:max-w-md">
                  <Input
                    placeholder="Search profiles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile Filter Button */}
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild className="lg:hidden">
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <div className="py-4">
                        <h2 className={`${playfair.className} font-semibold text-lg mb-4`}>Filters</h2>
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    List
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Showing {filteredProfiles.length} profiles</p>
                <Select defaultValue="match">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Best Match</SelectItem>
                    <SelectItem value="age">Age</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="recent">Recently Joined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Profiles Grid/List */}
            {loading ? (
              <div className="min-h-screen flex items-center justify-center">Loading profiles...</div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredProfiles.map((profile) => (
                  <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={profile.profilePhoto || "/placeholder-user.jpg"}
                        alt={profile.name}
                        className={`w-full object-cover ${viewMode === "grid" ? "h-64" : "h-32"}`}
                      />
                      {!profile.premium && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-white text-center">
                            <Eye className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">Upgrade to view</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex gap-2">
                        <Badge className="bg-yellow-500 text-white">⭐ Premium</Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-primary text-white">
                          {profile.match}% Match
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`${playfair.className} font-semibold text-lg`}>{profile.name}</h3>
                          <p className="text-sm text-muted-foreground">{profile.age} years old</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.education}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.profession}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline">{profile.sect}</Badge>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1" onClick={() => handleContactInfo(profile)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Info
                        </Button>
                        <Link href={`/profile/${profile.id}`}>
                          <Button variant="outline" className="flex-1">
                            View Profile
                          </Button>
                        </Link>
                      </div>

                      {!profile.premium && (
                        <p className="text-xs text-center text-muted-foreground mt-2">
                          Upgrade to Premium to send interests
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredProfiles.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Heart className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className={`${playfair.className} text-lg font-semibold mb-2`}>No profiles found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters to see more profiles</p>
                <Button
                  onClick={() =>
                    setFilters({
                      ageRange: [22, 35],
                      location: "",
                      education: "",
                      profession: "",
                      sect: "",
                      prayer: "",
                      hijab: "",
                      ageMin: "",
                      ageMax: "",
                      heightMin: "",
                      heightMax: "",
                      maritalStatus: "",
                      housing: "",
                    })
                  }
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Load More */}
            {filteredProfiles.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Profiles
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Premium</DialogTitle>
            <DialogDescription>
              Only premium members can view contact info and connect with other users. Upgrade now to unlock this feature!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Link href="/premium">
              <Button className="w-full gradient-gold text-white">Upgrade Now</Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={() => setShowUpgradeDialog(false)}>
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
          </DialogHeader>
          <div className="mt-4 text-center">
            {contactInfo ? (
              <span className="font-semibold text-lg">{contactInfo}</span>
            ) : (
              <span>Loading contact info...</span>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" className="w-full mt-4" onClick={() => setShowContactDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
