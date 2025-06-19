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
import { Heart, Star, MapPin, GraduationCap, Briefcase, Filter, Eye, EyeOff, MessageSquare } from "lucide-react"
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
  showPhotos?: boolean  // Added showPhotos property for privacy settings
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
  // New state to track interest status for each profile
  const [sentInterests, setSentInterests] = useState<Set<string>>(new Set())
  const [mutualInterests, setMutualInterests] = useState<Set<string>>(new Set())
  const [blurredPhotoIds, setBlurredPhotoIds] = useState<Set<string>>(new Set())

  // Fetch real profiles from API
  useEffect(() => {
    setLoading(true)
    
    // Build query parameters based on filters
    const params = new URLSearchParams();
    params.append("limit", "100"); // Increase limit to get more profiles
    
    // No longer filtering by profileStatus - removed
    
    if (filters.ageMin) params.append("ageMin", filters.ageMin);
    if (filters.ageMax) params.append("ageMax", filters.ageMax);
    if (filters.location) params.append("location", filters.location);
    if (filters.education) params.append("education", filters.education);
    if (filters.sect) params.append("sect", filters.sect);
    
    // Only use dummy data as fallback if there are no real users
    // params.append("useDummy", "true");
    
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
          
          if (data.profiles.length === 0) {
            // If no real profiles, try again with dummy data
            const dummyParams = new URLSearchParams(params);
            dummyParams.append("useDummy", "true");
            
            fetch(`/api/profiles?${dummyParams.toString()}`)
              .then(res => res.json())
              .then(dummyData => {
                if (dummyData.profiles && Array.isArray(dummyData.profiles)) {
                  console.log(`Received ${dummyData.profiles.length} dummy profiles as fallback`);
                  setProfiles(dummyData.profiles);
                }
                setLoading(false);
              })
              .catch(err => {
                console.error("Error fetching dummy profiles:", err);
                setLoading(false);
              });
          } else {
            setProfiles(data.profiles);
            setLoading(false);
          }
        } else {
          console.warn("API returned no profiles array:", data);
          setProfiles([]);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching profiles:", error);
        setLoading(false);
      });
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
  
  // New effect to fetch photo visibility status for all profiles based on privacy settings and interest status
  useEffect(() => {
    if (!session?.user?.id || profiles.length === 0) return;
    
    const checkPhotoVisibility = async () => {
      try {
        // Create new Sets to track various states
        const newBlurredPhotoIds = new Set<string>();
        const newSentInterests = new Set<string>();
        const newMutualInterests = new Set<string>();
        
        // For each profile, check if we should blur photos
        for (const profile of profiles) {
          // Skip if profile doesn't have ID
          if (!profile.id) continue;
          
          // Check interest status for this profile
          const interestRes = await fetch(`/api/profiles/interests?profileId=${profile.id}`, {
            credentials: 'include'
          });
          
          if (interestRes.ok) {
            const interestData = await interestRes.json();
            
            // Check if interest was sent
            if (interestData.sentInterests?.length > 0) {
              newSentInterests.add(profile.id);
            }
            
            // Check if user's interest has been accepted by the profile owner
            const hasApproval = interestData.sentInterests?.some((interest: any) => 
              interest.status === 'accepted'
            );
            
            // Check if there's a mutual interest (user received interest from profile as well)
            if (interestData.receivedInterests?.length > 0 && newSentInterests.has(profile.id)) {
              newMutualInterests.add(profile.id);
            }
            
            // Determine if photos should be blurred based on privacy settings and interest status
            // Get showPhotos value from the profile
            const showPhotos = profile.showPhotos !== undefined ? profile.showPhotos : true;
            
            // Photos should be blurred if profile owner has disabled photos AND user's interest hasn't been accepted
            if (!showPhotos && !hasApproval) {
              newBlurredPhotoIds.add(profile.id);
            }
          }
        }
        
        // Update states
        setBlurredPhotoIds(newBlurredPhotoIds);
        setSentInterests(newSentInterests);
        setMutualInterests(newMutualInterests);
        
        console.log('Photo visibility status:', {
          blurredCount: newBlurredPhotoIds.size,
          sentInterestsCount: newSentInterests.size,
          mutualCount: newMutualInterests.size
        });
      } catch (error) {
        console.error('Error checking photo visibility:', error);
      }
    };
    
    checkPhotoVisibility();
  }, [profiles, session?.user?.id]);

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

  // Add handleFilterChange function
  const handleFilterChange = (newFilters: typeof filters) => {
    setTempFilters(newFilters);
    setShowApplyButton(true);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowApplyButton(false);
    // If mobile filters are open, close them after applying
    if (showFilters) {
      setShowFilters(false);
    }
  };
  
  // Function to send interest from browse page
  const handleSendInterest = async (profileId: string) => {
    if (!session?.user?.id) {
      // Redirect to login if not logged in
      window.location.href = '/login';
      return;
    }
    
    try {
      // Send API request to send interest
      const response = await fetch(`/api/profiles/send-interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: profileId, // The profile receiving interest
          message: `${session?.user?.name || 'Someone'} has shown interest in your profile`
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send interest');
      }
      
      const result = await response.json();
      
      // If interest is mutual, unblur photos immediately
      if (result.isMutual) {
        setBlurredPhotoIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(profileId);
          return newSet;
        });
      }
      
      // Show success notification (you can replace this with your toast system)
      alert(result.isMutual ? "It's a match! Photos are now visible." : "Interest sent successfully");
      
      // Update sent interests state
      setSentInterests(prev => {
        const newSet = new Set(prev);
        newSet.add(profileId);
        return newSet;
      });
      
      // If interest is mutual, add to mutual interests state
      if (result.isMutual) {
        setMutualInterests(prev => {
          const newSet = new Set(prev);
          newSet.add(profileId);
          return newSet;
        });
      }
      
    } catch (error) {
      console.error("Failed to send interest:", error);
      // Show error notification
      alert("Failed to send interest. Please try again later.");
    }
  };

  // Function to toggle photo visibility for a specific profile
  const togglePhotoVisibility = (profileId: string) => {
    // If the photo is currently blurred, unblur it
    if (blurredPhotoIds.has(profileId)) {
      setBlurredPhotoIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(profileId);
        return newSet;
      });
    } else {
      // Otherwise blur it
      setBlurredPhotoIds(prev => {
        const newSet = new Set(prev);
        newSet.add(profileId);
        return newSet;
      });
    }
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
                        className={`w-full object-cover ${viewMode === "grid" ? "h-64" : "h-32"} ${blurredPhotoIds.has(profile.id) ? 'blur-md' : ''}`}
                      />
                      {!profile.premium && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-white text-center">
                            <Eye className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">Upgrade to view</p>
                          </div>
                        </div>
                      )}
                      {/* Islamic-themed blur overlay for private photos */}
                      {blurredPhotoIds.has(profile.id) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900/95 to-emerald-900/95 rounded-lg text-white p-4 text-center backdrop-blur-sm border border-amber-400/20">
                          {/* Islamic geometric pattern background - subtle */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="w-full h-full islamic-pattern"></div>
                          </div>
                          
                          {/* Islamic crescent moon icon */}
                          <div className="bg-gradient-to-br from-amber-400/20 to-emerald-400/20 p-2 rounded-full mb-3 backdrop-blur-sm border border-amber-300/30 relative z-10">
                            <div className="flex items-center justify-center">
                              <svg className="h-7 w-7 text-amber-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" opacity="0.1"/>
                                <path d="M10 17C7.23858 17 5 14.7614 5 12C5 9.23858 7.23858 7 10 7C9.73179 7.97256 9.5 9.23744 9.5 10C9.5 13.0376 11.3795 15.5 14 15.5C14.2731 15.5 14.5418 15.4809 14.8049 15.4443C13.8186 16.4437 11.9999 17 10 17Z" fill="currentColor"/>
                                <circle cx="17" cy="7" r="2" fill="currentColor"/>
                              </svg>
                            </div>
                          </div>
                          
                          {/* Text and action button */}
                          <div className="text-center mb-4 relative z-10">
                            <h3 className="font-bold text-lg mb-1 text-amber-100 font-arabic">
                              صور محفوظة بالحشمة
                            </h3>
                            <p className="font-semibold text-base text-white">Photos Protected with Haya</p>
                            <p className="text-xs text-emerald-100 leading-relaxed mt-1">
                              Express your interest to connect respectfully
                            </p>
                          </div>
                          
                          {/* Express Interest Button */}
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 hover:from-amber-300 hover:to-amber-400 font-medium border border-amber-300 shadow-lg transition-all duration-300 relative z-10"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent navigation to profile
                              handleSendInterest(profile.id);
                            }}
                          >
                            <Heart className="h-4 w-4 mr-2 text-red-600" />
                            Express Interest
                          </Button>
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
                          {/* Photo visibility toggle button - only shown for mutual interests */}
                          {mutualInterests.has(profile.id) && (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePhotoVisibility(profile.id);
                              }}
                              title={blurredPhotoIds.has(profile.id) ? "Show Photos" : "Hide Photos"}
                            >
                              {blurredPhotoIds.has(profile.id) ? (
                                <Eye className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-amber-500" />
                              )}
                            </Button>
                          )}
                          
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Heart className={`h-4 w-4 ${sentInterests.has(profile.id) ? "text-red-500 fill-red-500" : ""}`} />
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

                      {/* New Interest Button */}
                      <div className="mt-3">
                        <Button
                          onClick={() => handleSendInterest(profile.id)}
                          variant="default"
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <Heart className="h-4 w-4" />
                          Send Interest
                        </Button>
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
