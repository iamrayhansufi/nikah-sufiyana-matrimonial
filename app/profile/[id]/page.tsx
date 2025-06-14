"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
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

export default function ProfilePage() {
  const params = useParams()
  const [profile, setProfile] = useState<any>(null)
  const [isShortlisted, setIsShortlisted] = useState(false)
  const [isInterestSent, setIsInterestSent] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (!params?.id) return

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profiles/${params.id}`, {
          credentials: 'include', // This ensures cookies are sent
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store' // Disable caching to ensure we get fresh data
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            // If unauthorized, redirect to login
            window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
            return;
          }
          throw new Error(`Failed to fetch profile: ${res.status}`);
        }
        
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      }
    };

    fetchProfile();
  }, [params?.id])

  if (!profile) return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>

  const handleSendInterest = () => {
    setIsInterestSent(true)
    // Handle send interest logic
  }

  const handleShortlist = () => {
    setIsShortlisted(!isShortlisted)
    // Handle shortlist logic
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
                        className="object-cover"
                      />
                      <AvatarFallback className="text-4xl h-80 rounded-lg">
                        {profile.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

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
                  </div>

                  {/* Basic Info */}
                  <div className="text-center mb-6">
                    <h1 className={`${playfair.className} text-2xl font-semibold mb-2`}>{profile.name}</h1>
                    <p className="text-muted-foreground mb-1">{profile.age} years old</p>
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                    <p className="text-sm text-muted-foreground">Member since {profile.joinedDate}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      className="w-full gradient-emerald text-white"
                      onClick={handleSendInterest}
                      disabled={isInterestSent}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      {isInterestSent ? "Interest Sent" : "Send Interest"}
                    </Button>

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
                              <span>{profile.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-primary" />
                              <span>{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <MessageSquare className="h-5 w-5 text-primary" />
                              <span>{profile.whatsapp}</span>
                            </div>
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
              <Tabs defaultValue="about" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="family">Family</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>

                {/* About Tab */}
                <TabsContent value="about">
                  <div className="space-y-6">
                    {/* About Me */}
                    <Card>
                      <CardHeader>
                        <CardTitle>About Me</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{profile.aboutMe}</p>
                      </CardContent>
                    </Card>

                    {/* Quick Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <GraduationCap className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{profile.education}</p>
                              <p className="text-sm text-muted-foreground">Education</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{profile.profession}</p>
                              <p className="text-sm text-muted-foreground">Profession</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{profile.location}</p>
                              <p className="text-sm text-muted-foreground">Location</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Mosque className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{profile.sect}</p>
                              <p className="text-sm text-muted-foreground">Islamic Sect</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Islamic Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Islamic Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium mb-1">Prayer Habit</p>
                            <p className="text-sm text-muted-foreground">{profile.prayerHabit}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Hijab</p>
                            <p className="text-sm text-muted-foreground">{profile.hijab}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Quran Reading</p>
                            <p className="text-sm text-muted-foreground">{profile.quranReading}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Islamic Education</p>
                            <p className="text-sm text-muted-foreground">{profile.islamicEducation}</p>
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
                            <p className="text-sm text-muted-foreground">{profile.preferredAge}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Preferred Height</p>
                            <p className="text-sm text-muted-foreground">{profile.preferredHeight}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Preferred Education</p>
                            <p className="text-sm text-muted-foreground">{profile.preferredEducation}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Preferred Location</p>
                            <p className="text-sm text-muted-foreground">{profile.preferredLocation}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details">
                  <div className="space-y-6">
                    {/* Personal Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium mb-1">Height</p>
                            <p className="text-sm text-muted-foreground">{profile.height}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Weight</p>
                            <p className="text-sm text-muted-foreground">{profile.weight}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Complexion</p>
                            <p className="text-sm text-muted-foreground">{profile.complexion}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Body Type</p>
                            <p className="text-sm text-muted-foreground">{profile.bodyType}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Marital Status</p>
                            <p className="text-sm text-muted-foreground">{profile.maritalStatus}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Mother Tongue</p>
                            <p className="text-sm text-muted-foreground">{profile.motherTongue}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Professional Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Professional Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium mb-1">Profession</p>
                            <p className="text-sm text-muted-foreground">{profile.profession}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Company</p>
                            <p className="text-sm text-muted-foreground">{profile.company}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Education</p>
                            <p className="text-sm text-muted-foreground">{profile.education}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Lifestyle */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Lifestyle</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium mb-1">Diet</p>
                            <p className="text-sm text-muted-foreground">{profile.diet}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Smoking</p>
                            <p className="text-sm text-muted-foreground">{profile.smoking}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Drinking</p>
                            <p className="text-sm text-muted-foreground">{profile.drinking}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Languages</p>
                            <p className="text-sm text-muted-foreground">{profile.languages.join(", ")}</p>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div>
                          <p className="font-medium mb-2">Hobbies & Interests</p>
                          <div className="flex flex-wrap gap-2">
                            {profile.hobbies.map((hobby: string, index: number) => (
                              <Badge key={index} variant="outline">
                                {hobby}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Family Tab */}
                <TabsContent value="family">
                  <Card>
                    <CardHeader>
                      <CardTitle>Family Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium mb-1">Father's Occupation</p>
                          <p className="text-sm text-muted-foreground">{profile.fatherOccupation}</p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Mother's Occupation</p>
                          <p className="text-sm text-muted-foreground">{profile.motherOccupation}</p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Siblings</p>
                          <p className="text-sm text-muted-foreground">{profile.siblings}</p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Family Type</p>
                          <p className="text-sm text-muted-foreground">{profile.familyType}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="font-medium mb-1">Family Values</p>
                          <p className="text-sm text-muted-foreground">{profile.familyValues}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Gallery Tab */}
                <TabsContent value="gallery">
                  <Card>
                    <CardHeader>
                      <CardTitle>Photo Gallery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {profile.showFullPhotos ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {profile.gallery.map((image: string, index: number) => (
                            <div key={index} className="relative aspect-square">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setCurrentImageIndex(index)}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Eye className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
                          <p className="text-muted-foreground mb-4">
                            Full photo gallery is only available for Premium members
                          </p>
                          <Button className="gradient-gold text-white">Upgrade Now</Button>
                        </div>
                      )}
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
  )
}
