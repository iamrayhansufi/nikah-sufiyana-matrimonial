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
import { playfair } from "@/lib/fonts"
import { useSession, signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

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
    console.error("Error parsing JSON:", e);
    return [];
  }
  
  return [];
};

export default function ProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>({});
  const [showFullBio, setShowFullBio] = useState(false);
  const [loadingInterest, setLoadingInterest] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [interestMutual, setInterestMutual] = useState(false);
  const [requestedPhotoAccess, setRequestedPhotoAccess] = useState(false);
  const [photoAccessGranted, setPhotoAccessGranted] = useState(false);
  
  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchProfile() {
      try {
        // Add public=true flag in development mode to bypass auth requirement
        const queryParam = process.env.NODE_ENV === 'development' ? '?public=true' : '';
        const response = await fetch(`/api/profiles/${params.id}${queryParam}`, {
          signal: controller.signal
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to login if unauthorized
            signIn();
            toast({
              title: "Sign in required",
              description: "Please sign in to view profiles.",
              variant: "default",
            });
            return;
          }
          
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          toast({
            title: "Error",
            description: data.error || "Failed to load profile",
            variant: "destructive",
          });
          return;
        }
        
        // Handle different API response formats
        if (data.success && data.profile) {
          setProfile(data.profile);
        } else if (data && Object.keys(data).length > 0) {
          setProfile(data);
        } else {
          router.push("/browse");
          toast({
            title: "Profile not found",
            description: "The requested profile could not be found.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching profile:", error);
          router.push("/browse");
        }
      }
    }

    async function checkInterestStatus() {
      if (!session?.user) return;
      
      try {
        const response = await fetch(`/api/profiles/interests?profileId=${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          const hasInterest = data.interests.some((interest: any) => 
            interest.senderUserId === session.user.id && interest.receiverUserId === params.id
          );
          const hasMutualInterest = data.interests.some((interest: any) => 
            interest.senderUserId === session.user.id && interest.receiverUserId === params.id && interest.status === "accepted"
          ) || data.interests.some((interest: any) => 
            interest.receiverUserId === session.user.id && interest.senderUserId === params.id && interest.status === "accepted"
          );
          
          setInterestSent(hasInterest);
          setInterestMutual(hasMutualInterest);
        }
      } catch (error) {
        console.error("Error checking interest status:", error);
      }
    }    fetchProfile();
    if (session?.user) {
      checkInterestStatus();
    }
    
    // Clean up function for the AbortController
    return () => {
      controller.abort();
    }
    
    // Clean up function for the AbortController
    return () => {
      controller.abort();
    }
  }, [params.id, router, session, toast]);

  const handleSendInterest = async () => {
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to send interest.",
        variant: "default",
      });
      signIn();
      return;
    }

    setLoadingInterest(true);
    
    try {
      const response = await fetch("/api/profiles/send-interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverUserId: params.id,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setInterestSent(true);
        toast({
          title: "Interest sent!",
          description: "Your interest has been sent successfully.",
          variant: "default",
        });
        
        if (data.isMutual) {
          setInterestMutual(true);
          toast({
            title: "It's a match!",
            description: "This member has also shown interest in your profile.",
            variant: "default",
          });
        }
      } else {
        toast({
          title: "Failed to send interest",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending interest:", error);
      toast({
        title: "Error",
        description: "Failed to send interest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingInterest(false);
    }
  };

  // Check if we should blur photos based on privacy settings and interest status
  const shouldBlurPhoto = !profile.showPhotos && !interestMutual && !photoAccessGranted;

  const handleRequestPhotoAccess = async () => {
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to request photo access.",
        variant: "default",
      });
      signIn();
      return;
    }

    setRequestedPhotoAccess(true);
    
    try {
      // Simulate access request for demo purposes
      // In production, implement actual API call to request/grant access
      toast({
        title: "Access Requested",
        description: "Photo access requested. The member will be notified.",
        variant: "default",
      });
      
      // Simulate access granted after delay (for demo)
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          setPhotoAccessGranted(true);
          toast({
            title: "Access Granted",
            description: "Photo access has been granted.",
            variant: "default",
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error requesting photo access:", error);
      toast({
        title: "Error",
        description: "Failed to request photo access. Please try again.",
        variant: "destructive",
      });
      setRequestedPhotoAccess(false);
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
                <CardContent className="p-6">
                  {/* Profile Photo */}
                  <div className="relative mb-6">
                    <Avatar className="w-full h-80 rounded-lg">
                      <AvatarImage
                        src={profile.profilePhoto || "/placeholder.svg"}
                        alt={profile.name}
                        className={`object-cover ${shouldBlurPhoto ? 'blur-md' : ''}`}
                      />
                      <AvatarFallback className="text-4xl">
                        {profile.name ? profile.name.substring(0, 2) : "NS"}
                      </AvatarFallback>
                    </Avatar>
                    {shouldBlurPhoto && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-lg text-white p-4 text-center">
                        <Shield className="h-12 w-12 mb-2" />
                        <p className="text-sm mb-4">For modesty, photos are protected</p>
                        {!session ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white text-black hover:bg-white/90"
                            onClick={() => signIn()}
                          >
                            Sign In to View
                          </Button>
                        ) : (
                          !interestSent && (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="bg-white text-black hover:bg-white/90"
                              onClick={handleSendInterest}
                            >
                              Send Interest to View
                            </Button>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Name & Basic Info */}
                  <div className="text-center mb-6">
                    <h2 className={`${playfair.className} text-2xl font-semibold`}>{profile.name}</h2>
                    <p className="text-muted-foreground">
                      {profile.age ? profile.age + " Years" : ""}{profile.age && profile.height ? ", " : ""}
                      {profile.height || ""}
                    </p>
                    <div className="flex items-center justify-center mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-green-600 dark:text-green-400" />
                      <span className="text-sm">{profile.location || "Not specified"}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                      disabled={interestSent || loadingInterest}
                      onClick={handleSendInterest}
                    >
                      {loadingInterest ? (
                        "Sending..."
                      ) : interestSent ? (
                        <>
                          <Heart className="h-4 w-4 mr-2 fill-white" />
                          {interestMutual ? "Mutual Interest!" : "Interest Sent"}
                        </>
                      ) : (
                        <>
                          <Heart className="h-4 w-4 mr-2" />
                          Send Interest
                        </>
                      )}
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full text-red-600 dark:text-red-400">
                            <Flag className="h-4 w-4 mr-2" />
                            Report
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Report Profile</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <p>Please select a reason for reporting this profile:</p>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <input type="radio" id="fake" name="report-reason" className="mr-2" />
                                <label htmlFor="fake">Fake profile</label>
                              </div>
                              <div className="flex items-center">
                                <input type="radio" id="inappropriate" name="report-reason" className="mr-2" />
                                <label htmlFor="inappropriate">Inappropriate content</label>
                              </div>
                              <div className="flex items-center">
                                <input type="radio" id="harassment" name="report-reason" className="mr-2" />
                                <label htmlFor="harassment">Harassment</label>
                              </div>
                              <div className="flex items-center">
                                <input type="radio" id="other" name="report-reason" className="mr-2" />
                                <label htmlFor="other">Other</label>
                              </div>
                            </div>
                            <textarea
                              placeholder="Please provide additional details..."
                              className="w-full min-h-[100px] p-2 border rounded-md"
                            />
                            <div className="flex justify-end">
                              <Button variant="destructive">Submit Report</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Profile Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="family">Family</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>
                <TabsContent value="about">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {profile.name?.split(' ')[0]}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Bio */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Bio</h3>
                        {profile.bio ? (
                          <>
                            <p className="text-muted-foreground">
                              {showFullBio ? profile.bio : `${profile.bio.substring(0, 200)}${profile.bio.length > 200 ? "..." : ""}`}
                            </p>
                            {profile.bio.length > 200 && (
                              <Button variant="link" className="p-0 h-auto" onClick={() => setShowFullBio(!showFullBio)}>
                                {showFullBio ? "Show less" : "Show more"}
                              </Button>
                            )}
                          </>
                        ) : (
                          <p className="text-muted-foreground">No bio available</p>
                        )}
                      </div>

                      <Separator />

                      {/* Basic Details */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Basic Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full mr-3">
                              <Mosque className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Sect</p>
                              <p className="font-medium">{profile.sect || "Not specified"}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full mr-3">
                              <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Location</p>
                              <p className="font-medium">{profile.location || "Not specified"}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full mr-3">
                              <GraduationCap className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Education</p>
                              <p className="font-medium">{profile.education || "Not specified"}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full mr-3">
                              <Briefcase className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Occupation</p>
                              <p className="font-medium">{profile.occupation || "Not specified"}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full mr-3">
                              <Star className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Mother Tongue</p>
                              <p className="font-medium">{profile.motherTongue || "Not specified"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information (Show only for mutual interest) */}
                      {interestMutual && (
                        <>
                          <Separator />
                          <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full mr-3">
                                  <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Phone</p>
                                  <p className="font-medium">{profile.phone || "Not specified"}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full mr-3">
                                  <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Email</p>
                                  <p className="font-medium">{profile.email || "Not specified"}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full mr-3">
                                  <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                                </div>
                                <div>
                                  <Button variant="link" className="h-auto p-0">
                                    Send a message
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="family">
                  <Card>
                    <CardHeader>
                      <CardTitle>Family Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Family Type */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Family Type</h3>
                        <p className="text-muted-foreground">
                          {profile.familyType || "Not specified"}
                        </p>
                      </div>

                      <Separator />

                      {/* Parents */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Parents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">Father</h4>
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p>{profile.fatherName || "Not specified"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Occupation</p>
                                <p>{profile.fatherOccupation || "Not specified"}</p>
                              </div>
                              {interestMutual && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Contact</p>
                                  <p>{profile.fatherMobile || "Not specified"}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Mother</h4>
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p>{profile.motherName || "Not specified"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Occupation</p>
                                <p>{profile.motherOccupation || "Not specified"}</p>
                              </div>
                              {interestMutual && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Contact</p>
                                  <p>{profile.motherMobile || "Not specified"}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Siblings */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Siblings</h3>
                        {profile.siblings && profile.siblings !== "Not specified" && 
                          safeJsonParse(profile.siblings).length > 0 ? (
                          <div className="space-y-4">
                            {safeJsonParse(profile.siblings).map((sibling: any, index: number) => (
                              <div key={index} className="border rounded-md p-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Gender</p>
                                    <p>{sibling.gender || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Marital Status</p>
                                    <p>{sibling.maritalStatus || "Not specified"}</p>
                                  </div>
                                  {sibling.occupation && (
                                    <div>
                                      <p className="text-sm text-muted-foreground">Occupation</p>
                                      <p>{sibling.occupation || "Not specified"}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No sibling information available</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="gallery">
                  <Card>
                    <CardHeader>
                      <CardTitle>Photo Gallery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="gallery-container">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          {/* Main Profile Photo */}
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                            <img 
                              src={profile.profilePhoto || "/placeholder.svg"} 
                              alt={`${profile.name}'s profile photo`}
                              className={`w-full h-full object-cover ${shouldBlurPhoto ? 'blur-md' : ''}`}
                            />
                            <Badge className="absolute top-2 left-2 bg-primary">Main Photo</Badge>
                            {shouldBlurPhoto && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-lg text-white p-4 text-center">
                                <Shield className="h-8 w-8 mb-2" />
                                <p className="text-xs mb-2">For modesty, send interest to view</p>
                                {interestMutual && !requestedPhotoAccess && !photoAccessGranted && (
                                  <Button 
                                    variant="secondary" 
                                    size="sm"
                                    className="bg-white text-black hover:bg-white/90 mt-1"
                                    onClick={handleRequestPhotoAccess}
                                  >
                                    <Eye className="h-3 w-3 mr-1 text-blue-500" />
                                    Request Access
                                  </Button>
                                )}
                                {interestMutual && requestedPhotoAccess && !photoAccessGranted && (
                                  <Button 
                                    variant="secondary"
                                    size="sm" 
                                    disabled 
                                    className="bg-white/80 text-black mt-1"
                                  >
                                    <Eye className="h-3 w-3 mr-1 text-blue-500" />
                                    Requested
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Additional Photos */}
                          {profile.profilePhotos && profile.profilePhotos.length > 0 ? (
                            safeJsonParse(profile.profilePhotos).map((photo: string, index: number) => (
                              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                                <img 
                                  src={photo} 
                                  alt={`${profile.name}'s photo ${index + 1}`}
                                  className={`w-full h-full object-cover ${shouldBlurPhoto ? 'blur-md' : ''}`}
                                />
                                {shouldBlurPhoto && (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-lg text-white p-4 text-center">
                                    <Shield className="h-8 w-8 mb-2" />
                                    <p className="text-xs mb-2">For modesty, send interest to view</p>
                                    {interestMutual && !requestedPhotoAccess && !photoAccessGranted && (
                                      <Button 
                                        variant="secondary" 
                                        size="sm"
                                        className="bg-white text-black hover:bg-white/90 mt-1"
                                        onClick={handleRequestPhotoAccess}
                                      >
                                        <Eye className="h-3 w-3 mr-1 text-blue-500" />
                                        Request Access
                                      </Button>
                                    )}
                                    {interestMutual && requestedPhotoAccess && !photoAccessGranted && (
                                      <Button 
                                        variant="secondary"
                                        size="sm" 
                                        disabled 
                                        className="bg-white/80 text-black mt-1"
                                      >
                                        <Eye className="h-3 w-3 mr-1 text-blue-500" />
                                        Requested
                                      </Button>
                                    )}
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}