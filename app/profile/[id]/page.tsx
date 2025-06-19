"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Heart,
  Star,
  MapPin,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Phone,
  Mail,
  Shield,
  ChurchIcon as Mosque,
  ArrowLeft,
  Share2,
  Flag,
  Eye,
  EyeOff,
} from "lucide-react"
import Link from "next/link"
import { playfair } from "../../lib/fonts"
import { useSession, signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useNotifications } from "@/hooks/use-notifications"

// Helper function to safely parse JSON arrays
const safeJsonParse = (jsonString: string | null | undefined): any[] => {
  if (!jsonString) return [];
  if (jsonString === "Not specified") return [];
  
  try {
    // Handle case where it's already an array
    if (Array.isArray(jsonString)) return jsonString;
    
    // Only attempt to parse if it looks like an array
    if (typeof jsonString === 'string' && jsonString.trim().startsWith('[')) {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.warn("Failed to parse JSON:", e);
  }
  
  return [];
};

// Function to format text to Title Case - improved for better capitalization
const formatToTitleCase = (text: string): string => {
  if (!text) return "Not Specified";
  
  // Convert to string if it's not already
  const textStr = String(text).trim();
  if (!textStr) return "Not Specified";
  
  // List of words that should not be capitalized unless they're the first word
  const exceptions = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with', 'in', 'of'];
  
  // First handle kebab-case
  if (textStr.includes('-')) {
    return textStr
      .split('-')
      .map((word: string, index: number) => {
        if (index === 0 || !exceptions.includes(word.toLowerCase())) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word.toLowerCase();
      })
      .join(' ');
  }
  
  // Handle space-separated words
  if (textStr.includes(' ')) {
    return textStr
      .split(' ')
      .map((word: string, index: number) => {
        // Don't change words that are all numbers
        if (/^\d+$/.test(word)) return word;
        
        if (index === 0 || !exceptions.includes(word.toLowerCase())) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word.toLowerCase();
      })
      .join(' ');
  }
  
  // Single word - don't change if it's a number
  if (/^\d+$/.test(textStr)) return textStr;
  
  // Single word
  return textStr.charAt(0).toUpperCase() + textStr.slice(1).toLowerCase();
};

// Simple ProfilePage Component that doesn't rely on complex URL handling
export default function ProfilePage({ 
  params
}: { 
  params: { id: string } 
}) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const { refresh: refreshNotifications } = useNotifications()
  
  const [profile, setProfile] = useState<any>(null)
  const [isShortlisted, setIsShortlisted] = useState(false)
  const [isInterestSent, setIsInterestSent] = useState(false)
  const [interestMutual, setInterestMutual] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shouldBlurPhoto, setShouldBlurPhoto] = useState(false)
    // New state for handling incoming interest requests
  const [incomingInterestRequest, setIncomingInterestRequest] = useState<any>(null)
  const [showInterestRequestDialog, setShowInterestRequestDialog] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string>('')
  
  // Get the profile ID from params
  const { id } = params
  
  // Handle login redirection
  const handleLogin = () => {
    // Store where the user was trying to go
    localStorage.setItem('redirectAfterLogin', `/profile/${id}`)
    // Redirect to login
    router.push('/login')
  }
    useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        setError("Invalid profile ID")
        setLoading(false)
        return
      }
      
      setLoading(true)
      
      try {
        console.log(`Fetching profile with ID: ${id}`)
        
        const res = await fetch(`/api/profiles/${id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        })
        
        if (!res.ok) {
          if (res.status === 401) {
            setError("Please log in to view profiles")
            setLoading(false)
            return
          }
          
          if (res.status === 403) {
            setError("This profile is not currently available for viewing")
            setLoading(false)
            return
          }
          
          throw new Error(`Failed to fetch profile: ${res.status}`)
        }
        
        const data = await res.json()
        setProfile(data)
        
        // Check interest status for this profile
        if (session?.user?.id) {
          // Check if current user sent interest to this profile
          const interestRes = await fetch(`/api/profiles/interests?profileId=${id}`, {
            credentials: 'include'
          })
          
          if (interestRes.ok) {
            const interestData = await interestRes.json()
            
            // Set interest sent status
            if (interestData.sentInterests?.length > 0) {
              setIsInterestSent(true)
            }
              // Check if mutual interest exists
            if (interestData.receivedInterests?.length > 0) {
              setInterestMutual(true)
            }
            
            // Check if this profile has sent an interest request to the current user
            // that is still pending (for accept/decline UI)
            const pendingRequestFromThisProfile = interestData.receivedInterests?.find(
              (interest: any) => interest.fromUserId === parseInt(id) && interest.status === 'pending'
            );
            
            if (pendingRequestFromThisProfile) {
              setIncomingInterestRequest(pendingRequestFromThisProfile);
            }// Determine if photo should be blurred based on privacy settings
            // Photos should be blurred if:
            // 1. User has set showPhotos to false (privacy setting)
            // 2. AND the current user's interest hasn't been accepted by the profile owner
            
            // Check if current user's sent interest has been accepted
            const hasApproval = interestData.sentInterests?.some((interest: any) => 
              interest.status === 'accepted'
            );
            
            const shouldBlurBasedOnPrivacy = !data.showPhotos && !hasApproval;
            setShouldBlurPhoto(shouldBlurBasedOnPrivacy);
            
            console.log('Photo blur logic:', {
              showPhotos: data.showPhotos,
              hasApproval,
              shouldBlurBasedOnPrivacy,
              sentInterests: interestData.sentInterests || [],
              sentInterestsLength: interestData.sentInterests?.length || 0
            });
          }
          
          // Check if profile is shortlisted
          const shortlistRes = await fetch(`/api/profiles/shortlist?shortlistedId=${id}`, {
            credentials: 'include'
          })
          
          if (shortlistRes.ok) {
            const shortlistData = await shortlistRes.json()
            setIsShortlisted(shortlistData.isShortlisted)
          }
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching profile:', error)
        setError(error instanceof Error ? error.message : 'Unknown error')
        setProfile(null)
        setLoading(false)
      }
    }
    
    // Only fetch if we have a session
    if (status === 'authenticated') {
      fetchProfile()
    } else if (status === 'unauthenticated') {
      setError("Please log in to view profiles")
      setLoading(false)
    }
  }, [id, status, session?.user?.id])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-emerald-600 border-emerald-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  // Error state with login option
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
          <p className="mb-6">{error}</p>
          
          {status === 'unauthenticated' && (
            <div className="flex flex-col space-y-4">
              <p className="text-gray-700">You need to be logged in to view profiles.</p>
              <Button onClick={handleLogin} className="w-full bg-emerald-600 hover:bg-emerald-700">
                Login to View Profile
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-sm text-gray-500">
                    or
                  </span>
                </div>
              </div>
              <Link href="/register">
                <Button variant="outline" className="w-full border-emerald-600 text-emerald-600">
                  Create an Account
                </Button>
              </Link>
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => router.push('/browse')}
            className="mt-4"
          >
            Return to Browse
          </Button>
        </div>
      </div>
    );
  }
  
  // No profile state
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Profile not found or unavailable</p>
          <Button onClick={() => router.push('/browse')}>
            Return to Browse
          </Button>
        </div>
      </div>
    );
  }  const handleSendInterest = async () => {
    // Don't allow sending interest if already sent
    if (isInterestSent) return
    
    try {
      setIsInterestSent(true)
      
      // Send API request to send interest
      const response = await fetch(`/api/profiles/send-interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: id, // The profile receiving interest
          message: `${session?.user?.name || 'Someone'} has shown interest in your profile`
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to send interest')
      }
      
      const result = await response.json()
        // Check if it resulted in a mutual match
      if (result.isMutual) {
        setInterestMutual(true)
        setShouldBlurPhoto(false)
        toast({
          title: "It's a Match! 🎉",
          description: "You both have shown interest in each other! Photos are now visible.",
          variant: "default"
        })
      } else {
        // Show success toast or message
        toast({
          title: "Interest Sent",
          description: "Your interest has been sent to this member",
          variant: "default"
        })
      }
      
      // Refresh notifications to update the count
      refreshNotifications();
      
    } catch (error) {
      console.error("Failed to send interest:", error)
      setIsInterestSent(false)
      
      // Show error toast or message
      toast({
        title: "Failed to Send Interest",
        description: "There was a problem sending your interest. Please try again.",        
        variant: "destructive"
      })
    }
  }

  const handleUndoInterest = async () => {
    try {
      const response = await fetch(`/api/profiles/undo-interest`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: parseInt(id)
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to undo interest');
      }
        // Update UI state
      setIsInterestSent(false);
      setInterestMutual(false);
      
      // Show success toast
      toast({
        title: "Interest Undone",
        description: "Your interest has been removed",
        variant: "default"
      });
      
      // Refresh notifications to update the count
      refreshNotifications();
      
    } catch (error) {
      console.error("Failed to undo interest:", error);
      toast({
        title: "Failed to Undo Interest",
        description: error instanceof Error ? error.message : "Please try again.",        
        variant: "destructive"
      });
    }
  };

  const handleShortlist = async () => {
    try {
      // Toggle the UI state immediately for better user experience
      setIsShortlisted(!isShortlisted)
      
      // Send API request to add/remove from shortlist
      const response = await fetch(`/api/profiles/shortlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shortlistedUserId: id
        })
      })
      
      if (!response.ok) {
        // Revert UI state if request failed
        setIsShortlisted(isShortlisted)
        throw new Error('Failed to update shortlist')
      }
      
      const data = await response.json()
      
      // Show success toast or message
      toast({
        title: data.action === 'removed' ? "Removed from Shortlist" : "Added to Shortlist",
        description: data.action === 'removed' ? 
          "Profile has been removed from your shortlist" : 
          "Profile has been added to your shortlist",
        variant: "default"
      })
      
    } catch (error) {
      console.error("Failed to update shortlist:", error)
      
      // Show error toast or message
      toast({
        title: "Failed to Update Shortlist",
        description: "There was a problem updating your shortlist. Please try again.",
        variant: "destructive"
      })
    }
  }
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile.name}'s Profile - Nikah Sufiyana`,
        text: `Check out ${profile.name}'s profile on Nikah Sufiyana`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleRespondToInterest = async (action: 'accept' | 'decline') => {
    if (!incomingInterestRequest) return;
    
    try {
      const response = await fetch('/api/profiles/respond-interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interestId: incomingInterestRequest.id,
          action: action
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action} interest`);
      }
      
      // Update UI state
      setIncomingInterestRequest(null);
      
      if (action === 'accept') {
        setInterestMutual(true);
        setShouldBlurPhoto(false);
        toast({
          title: "Interest Accepted! 🎉",
          description: "You can now view each other's photos clearly.",
          variant: "default"
        });
      } else {
        toast({
          title: "Interest Declined",
          description: "The interest request has been declined.",
          variant: "default"
        });
      }
      
      // Refresh notifications to update the count
      refreshNotifications();
      
    } catch (error) {
      console.error(`Failed to ${action} interest:`, error);
      toast({
        title: `Failed to ${action.charAt(0).toUpperCase() + action.slice(1)} Interest`,
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImageClick = (imageSrc: string) => {
    if (!shouldBlurPhoto) {
      setLightboxImage(imageSrc);
      setShowLightbox(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/browse">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Browse
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Photo & Actions */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">                  {/* Profile Photo */}
                  <div className="relative mb-6">
                    <Avatar 
                      className={`w-full h-80 rounded-lg ${!shouldBlurPhoto ? 'cursor-pointer' : ''}`}
                      onClick={() => handleImageClick(profile.profilePhoto || "/placeholder.svg")}
                    >
                      <AvatarImage
                        src={profile.profilePhoto || "/placeholder.svg"}
                        alt={profile.name}
                        className={`object-cover ${shouldBlurPhoto ? 'blur-md' : ''}`}
                      />
                      <AvatarFallback className="text-4xl h-80 rounded-lg">
                        {profile.name && typeof profile.name === 'string' 
                          ? profile.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                          : "U"}
                      </AvatarFallback>
                    </Avatar>{/* Blur notice overlay for private photos */}
                    {shouldBlurPhoto && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-lg text-white p-4 text-center">
                        <EyeOff className="h-12 w-12 mb-2" />
                        <p className="font-semibold text-lg mb-1">Private Photos</p>
                        <p className="text-sm mb-4">This member has protected their photos. Send interest to view clearly.</p>
                        {!isInterestSent && (
                          <Button 
                            variant="secondary" 
                            className="bg-white text-black hover:bg-white/90"
                            onClick={handleSendInterest}
                          >
                            <Heart className="h-4 w-4 mr-2 text-red-500" />
                            Send Interest
                          </Button>
                        )}                        {isInterestSent && (
                          <Button variant="secondary" disabled className="bg-white/80 text-black">
                            <Heart className="h-4 w-4 mr-2 text-red-500 fill-red-500" />
                            Interest Sent
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-2">
                      {profile.premium && <Badge className="bg-yellow-500 text-white">⭐ Premium</Badge>}
                    </div>

                    {/* Match Percentage */}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-primary text-white">
                        {profile.matchPercentage}% Match
                      </Badge>
                    </div>

                    {/* Online Status */}
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="outline" className="bg-white/90">
                        Last seen: {profile.lastSeen}
                      </Badge>
                    </div>
                  </div>                  {/* Basic Info */}
                  <div className="text-center mb-6">
                    <h1 className={`${playfair.className} text-2xl font-semibold mb-2`}>{formatToTitleCase(profile.name)}</h1>
                    <p className="text-muted-foreground mb-1">{profile.age} years old</p>
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      {formatToTitleCase(profile.location)}
                    </div>
                    <p className="text-sm text-muted-foreground">Member since {profile.joinedDate}</p>
                  </div>                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* Interest Request Response (if user received request from this profile) */}
                    {incomingInterestRequest && (
                      <div className="space-y-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium text-center">
                          {formatToTitleCase(profile.name)} has sent you an interest request
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleRespondToInterest('accept')}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleRespondToInterest('decline')}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    )}

                    {!isInterestSent ? (
                      <Button
                        className="w-full gradient-emerald text-white"
                        onClick={handleSendInterest}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Send Interest
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full border-emerald-200 text-emerald-600 bg-emerald-50"
                          disabled
                        >
                          <Heart className="h-4 w-4 mr-2 fill-emerald-600" />
                          Interest Sent
                          {interestMutual && " ✓ Match"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleUndoInterest}
                          className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Undo Interest
                        </Button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={handleShortlist}
                        className={isShortlisted ? "bg-yellow-50 border-yellow-200" : ""}
                      >
                        <Star className={`h-4 w-4 mr-1 ${isShortlisted ? "fill-yellow-400 text-yellow-400" : ""}`} />
                        {isShortlisted ? "Saved" : "Save"}
                      </Button>

                      <Button variant="outline" onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>

                    <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Info
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Contact Information</DialogTitle>
                        </DialogHeader>
                        {profile.showContactInfo ? (
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Phone className="h-5 w-5 text-primary" />
                              <span>{profile.phone || profile.mobileNumber}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-primary" />
                              <span>{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <MessageSquare className="h-5 w-5 text-primary" />
                              <span>{profile.whatsapp || profile.mobileNumber}</span>
                            </div>
                            {profile.premium && (
                              <>
                                <Separator />
                                <h3 className="font-medium text-md">Parent Contact Information</h3>
                                
                                {profile.fatherOccupation && (
                                  <div className="flex items-center gap-3 mt-2">
                                    <Briefcase className="h-5 w-5 text-primary" />
                                    <span>Father's Occupation: {profile.fatherOccupation}</span>
                                  </div>
                                )}
                                
                                {profile.motherOccupation && (
                                  <div className="flex items-center gap-3">
                                    <Briefcase className="h-5 w-5 text-primary" />
                                    <span>Mother's Occupation: {
                                      profile.motherOccupation === "other" && profile.motherOccupationOther ? 
                                        profile.motherOccupationOther : 
                                        profile.motherOccupation
                                    }</span>
                                  </div>
                                )}
                                
                                <Separator className="my-2" />
                                
                                {profile.showFatherNumber && profile.fatherMobile && (
                                  <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-primary" />
                                    <span>Father: {profile.fatherMobile}</span>
                                  </div>
                                )}
                                
                                {profile.showMotherNumber && profile.motherMobile && (
                                  <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-primary" />
                                    <span>Mother: {profile.motherMobile}</span>
                                  </div>
                                )}
                                
                                {!profile.showFatherNumber && !profile.showMotherNumber && (
                                  <p className="text-sm text-muted-foreground">
                                    No parent contact numbers have been shared.
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <EyeOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="font-semibold mb-2">Upgrade to Premium</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Contact information is only available for Premium members
                            </p>
                            <Button className="gradient-gold text-white">Upgrade Now</Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" className="w-full text-red-600 border-red-200">
                      <Flag className="h-4 w-4 mr-2" />
                      Report Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="space-y-6">                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="family">Family</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>                {/* About Tab */}
                <TabsContent value="about">
                  <div className="space-y-6">                    {/* Basic Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                          <div>
                            <p className="font-medium mb-1">Full Name</p>
                            <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.fullName || profile.name || "Not Specified")}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Gender</p>
                            <p className="text-sm text-muted-foreground">
                              {profile.gender ? formatToTitleCase(profile.gender) : "Not Specified"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Age</p>
                            <p className="text-sm text-muted-foreground">{profile.age ? `${profile.age} Years` : "Not Specified"}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Height</p>
                            <p className="text-sm text-muted-foreground">{profile.height && profile.height.trim() !== "" ? profile.height : "Not Specified"}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Complexion</p>
                            <p className="text-sm text-muted-foreground">
                              {profile.complexion === "very-fair" ? "Very Fair" : 
                               profile.complexion === "fair" ? "Fair" :
                               profile.complexion === "wheatish" ? "Wheatish" :
                               profile.complexion === "wheatish-brown" ? "Wheatish Brown" :
                               profile.complexion === "brown" ? "Brown" :
                               profile.complexion === "dark" ? "Dark" : 
                               profile.complexion ? formatToTitleCase(profile.complexion) : "Not Specified"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Marital Status</p>
                            <p className="text-sm text-muted-foreground">
                              {profile.maritalStatus ? formatToTitleCase(profile.maritalStatus) : "Not Specified"}
                            </p>
                          </div>
                          {profile.maritalStatus === 'other' && (
                            <div>
                              <p className="font-medium mb-1">Other Marital Status</p>
                              <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.maritalStatusOther || "Not Specified")}</p>
                            </div>
                          )}
                          <div>
                            <p className="font-medium mb-1">Maslak</p>
                            <p className="text-sm text-muted-foreground">{profile.sect ? formatToTitleCase(profile.sect) : "Not Specified"}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Country</p>
                            <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.country || "Not Specified")}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">City</p>
                            <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.city || "Not Specified")}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Address</p>
                            <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.address || "Not Specified")}</p>
                          </div>                          <div className="col-span-1 md:col-span-2">
                            <p className="font-medium mb-1">About {profile.gender === 'male' ? 'Groom' : 'Bride'}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{formatToTitleCase(profile.aboutMe || "Not Specified")}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Education & Career */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Education & Career</CardTitle>
                      </CardHeader>
                      <CardContent>                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                          <div>
                            <p className="font-medium mb-1">Qualification</p>
                            <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.education || "Not Specified")}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Education Details</p>
                            <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.educationDetails || "Not Specified")}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Profession</p>
                            <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.profession || "Not Specified")}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Job Title</p>
                            <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.jobTitle || "Not Specified")}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Income</p>
                            <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.income || "Not Specified")}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                          <div className="flex items-center gap-3">
                            <GraduationCap className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{formatToTitleCase(profile.education)}</p>
                              <p className="text-sm text-muted-foreground">Education</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{formatToTitleCase(profile.profession)}</p>
                              <p className="text-sm text-muted-foreground">Profession</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{formatToTitleCase(profile.location)}</p>
                              <p className="text-sm text-muted-foreground">Location</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Mosque className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{formatToTitleCase(profile.sect)}</p>
                              <p className="text-sm text-muted-foreground">Islamic Sect</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Partner Preferences */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Partner Preferences</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium mb-1">Preferred Age</p>
                            <p className="text-sm text-muted-foreground">
                              {profile.preferredAgeMin && profile.preferredAgeMax 
                                ? `${profile.preferredAgeMin} - ${profile.preferredAgeMax} years` 
                                : "Not specified"}
                            </p>
                          </div>                          <div>
                            <p className="font-medium mb-1">Preferred Height</p>
                            <p className="text-sm text-muted-foreground">
                              {profile.preferredHeight && profile.preferredHeight.trim() !== "" ? formatToTitleCase(profile.preferredHeight) : "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Preferred Complexion</p>
                            <p className="text-sm text-muted-foreground">
                              {profile.preferredComplexion === "very-fair" ? "Very Fair" : 
                               profile.preferredComplexion === "fair" ? "Fair" :
                               profile.preferredComplexion === "wheatish" ? "Wheatish" :
                               profile.preferredComplexion === "wheatish-brown" ? "Wheatish Brown" :
                               profile.preferredComplexion === "brown" ? "Brown" :
                               profile.preferredComplexion === "dark" ? "Dark" : 
                               profile.preferredComplexion ? formatToTitleCase(profile.preferredComplexion) : "Not Specified"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Preferred Education</p>
                            <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.preferredEducation || "Not specified")}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Preferred Location</p>
                            <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.preferredLocation || "Not specified")}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Preferred Occupation</p>
                            <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.preferredOccupation || "Not specified")}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Preferred Maslak</p>
                            <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.preferredMaslak || "Not specified")}</p>
                          </div>
                        </div>
                          {profile.expectations && (
                          <div className="mt-4">
                            <p className="font-medium mb-1">Additional Expectations</p>
                            <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.expectations)}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>                </TabsContent>

                {/* Family Tab */}
                <TabsContent value="family">
                  <div className="space-y-6">
                    {/* Basic Family Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Family Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                          <div>
                            <p className="font-medium mb-1">Father's Name</p>
                            <p className="text-sm text-muted-foreground">
                              {profile.fatherName ? formatToTitleCase(profile.fatherName) : "Not Specified"}
                            </p>
                          </div>                          <div>
                            <p className="font-medium mb-1">Mother's Name</p>
                            <p className="text-sm text-muted-foreground">{formatToTitleCase(profile.motherName || "Not specified")}</p>
                          </div>                          <div>
                            <p className="font-medium mb-1">Father's Occupation</p>
                            <p className="text-sm text-muted-foreground">
                              {profile.fatherOccupation && profile.fatherOccupation.trim() !== "" ? 
                               formatToTitleCase(profile.fatherOccupation) : "Not Specified"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Mother's Occupation</p>
                            <p className="text-sm text-muted-foreground">
                              {profile.motherOccupation === "other" && profile.motherOccupationOther ? 
                                formatToTitleCase(profile.motherOccupationOther) : 
                                profile.motherOccupation === "Home Queen" ? 
                                  "Home Queen" : 
                                  formatToTitleCase(profile.motherOccupation || "Home Queen")}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Housing Status</p>                            <p className="text-sm text-muted-foreground">
                              {profile.housingStatus === "owned" ? "Own House" :
                               profile.housingStatus === "rented" ? "Rented" :
                               profile.housingStatus === "other" ? "Other" :
                               profile.housingStatus ? formatToTitleCase(profile.housingStatus) : 
                               "Not specified"}
                            </p>
                          </div>
                        </div>
                          <div className="mt-6">
                          <p className="font-medium mb-2">Family Description</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{formatToTitleCase(profile.familyDetails || "Not provided")}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Siblings Information - if available */}
                    {(() => {
                      const siblings = safeJsonParse(profile.siblings);
                      return siblings.length > 0 ? (
                        <Card>
                          <CardHeader>
                            <CardTitle>Siblings</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">                              {siblings.map((sibling: any, index: number) => (
                                <div key={index} className="border-b pb-2 last:border-0">
                                  <p className="font-medium">{formatToTitleCase(sibling.name || "No Name Provided")}</p>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                                    <p>
                                      {sibling.siblingType === "brother" ? "Brother" :
                                       sibling.siblingType === "sister" ? "Sister" :
                                       sibling.siblingType ? formatToTitleCase(sibling.siblingType) :
                                       "Not specified"}
                                    </p>
                                    <p>
                                      {sibling.maritalStatus === "married" ? "Married" :
                                       sibling.maritalStatus === "unmarried" ? "Unmarried" :
                                       sibling.maritalStatus ? formatToTitleCase(sibling.maritalStatus) :
                                       "Not specified"}
                                    </p>
                                    <p>Occupation: {formatToTitleCase(sibling.occupation || "Not specified")}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ) : null;
                    })()}

                    {/* Brother In Law Information - if available */}
                    {(() => {
                      const brotherInLaws = safeJsonParse(profile.brotherInLaws);
                      return brotherInLaws.length > 0 ? (
                        <Card>
                          <CardHeader>
                            <CardTitle>Brothers-in-Law</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">                              {brotherInLaws.map((brotherInLaw: any, index: number) => (
                                <div key={index} className="border-b pb-2 last:border-0">
                                  <p className="font-medium">{formatToTitleCase(brotherInLaw.name || "No Name Provided")}</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                    <p>Occupation: {formatToTitleCase(brotherInLaw.occupation || "Not specified")}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ) : null;
                    })()}

                    {/* Maternal/Paternal Information - if available */}
                    {(() => {
                      const maternalPaternals = safeJsonParse(profile.maternalPaternal);
                      return maternalPaternals.length > 0 ? (
                        <Card>
                          <CardHeader>
                            <CardTitle>Maternal & Paternal Relations</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">                              {maternalPaternals.map((relation: any, index: number) => (
                                <div key={index} className="border-b pb-2 last:border-0">
                                  <p className="font-medium">
                                    {relation.relation === "maternal-uncle" ? "Maternal Uncle" :
                                     relation.relation === "paternal-uncle" ? "Paternal Uncle" :
                                     relation.relation ? formatToTitleCase(relation.relation) :
                                     "Relative"}
                                  </p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                    <p>Name: {formatToTitleCase(relation.name || "Not specified")}</p>
                                    <p>Occupation: {formatToTitleCase(relation.occupation || "Not specified")}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ) : null;
                    })()}
                  </div>
                </TabsContent>                {/* Gallery Tab */}
                <TabsContent value="gallery">
                  <Card>
                    <CardHeader>
                      <CardTitle>Photo Gallery</CardTitle>
                    </CardHeader>                    <CardContent>
                      <div>                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          {/* Main Profile Photo */}
                          <div 
                            className={`aspect-square rounded-lg overflow-hidden bg-gray-100 relative ${!shouldBlurPhoto ? 'cursor-pointer' : ''}`}
                            onClick={() => handleImageClick(profile.profilePhoto || "/placeholder.svg")}
                          >
                            <img 
                              src={profile.profilePhoto || "/placeholder.svg"} 
                              alt={`${profile.name}'s profile photo`}
                              className={`w-full h-full object-cover ${shouldBlurPhoto ? 'blur-md' : ''}`}
                            />
                            <Badge className="absolute top-2 left-2 bg-primary">Main Photo</Badge>
                            {shouldBlurPhoto && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-lg text-white p-4 text-center">
                                <EyeOff className="h-8 w-8 mb-2" />
                                <p className="text-xs">Send interest to view</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Additional Photos */}
                          {profile.profilePhotos && profile.profilePhotos.length > 0 ? (
                            safeJsonParse(profile.profilePhotos).map((photo: string, index: number) => (
                              <div 
                                key={index} 
                                className={`aspect-square rounded-lg overflow-hidden bg-gray-100 relative ${!shouldBlurPhoto ? 'cursor-pointer' : ''}`}
                                onClick={() => handleImageClick(photo)}
                              >
                                <img 
                                  src={photo} 
                                  alt={`${profile.name}'s photo ${index + 1}`}
                                  className={`w-full h-full object-cover ${shouldBlurPhoto ? 'blur-md' : ''}`}
                                />
                                {shouldBlurPhoto && (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-lg text-white p-4 text-center">
                                    <EyeOff className="h-8 w-8 mb-2" />
                                    <p className="text-xs">Send interest to view</p>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full text-center">
                              <p className="text-sm text-muted-foreground mt-4">
                                {profile.profilePhoto ? "No additional photos available" : "No photos available"}
                              </p>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                          {profile.showPhotos ? 
                            "Photos are visible to all members" : 
                            shouldBlurPhoto ? 
                              "Photos are protected - send interest and get approval to view clearly" :
                              "Photos are visible to approved viewers"
                          }
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setShowLightbox(false)}
        >
          <div className="relative max-w-4xl max-h-screen p-4">
            <img 
              src={lightboxImage} 
              alt="Full size photo" 
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-colors"
              onClick={() => setShowLightbox(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
