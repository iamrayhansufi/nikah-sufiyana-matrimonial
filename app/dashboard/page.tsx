"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  Star,
  Eye,
  MessageSquare,
  CreditCard,
  Edit,
  Camera,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react"
import { playfair } from "../lib/fonts"

// Helper functions for status icons/text
const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-500" />
    case "active":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    default:
      return <AlertCircle className="h-5 w-5 text-red-500" />
  }
}
const getStatusText = (status: string) => {
  switch (status) {
    case "approved":
      return "Profile Approved"
    case "pending":
      return "Verification Pending"
    case "active":
      return "Profile Active"
    default:
      return "Profile Inactive"
  }
}

// Add types for interests and shortlist
interface DashboardInterest {
  id: number;
  name: string;
  age: number;
  location: string;
  profession: string;
  image: string;
  status: string;
  time: string;
}
interface DashboardShortlist {
  id: number;
  name: string;
  age: number;
  location: string;
  profession: string;
  image: string;
  match: number;
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [stats, setStats] = useState({ profileViews: 0, interests: 0, shortlisted: 0, matches: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [recentInterests, setRecentInterests] = useState<DashboardInterest[]>([])
  const [shortlistedProfiles, setShortlistedProfiles] = useState<DashboardShortlist[]>([])

  // Helper function to decode JWT
  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''))
      return JSON.parse(jsonPayload)
    } catch (e) {
      console.error('Failed to decode token:', e)
      return null
    }
  }

  // Fetch profile and stats
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          setError("Not logged in.")
          setLoading(false)
          return
        }
        // Try to get user id from localStorage or token
        let userId = null
        const userStr = localStorage.getItem("currentUser")
        if (userStr) {
          try { userId = JSON.parse(userStr).id } catch {}
        }
        // Fallback: decode JWT to get userId
        if (!userId) {
          const decoded = decodeToken(token)
          userId = decoded?.userId
        }
        if (!userId) {
          setError("User info missing. Please log in again.")
          setLoading(false)
          return
        }

        // Fetch user profile from API
        const res = await fetch(`/api/profiles/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Profile fetch failed:", res.status, errorText);
          setError(`Failed to load profile. (${res.status})`)
          setLoading(false)
          return
        }
        const profile = await res.json()
        setUserProfile({
          ...profile,
          name: profile.fullName || profile.name || "",
          completeness: profile.completeness || 80, // fallback if not present
        })

        // Fetch user stats for dashboard
        const statsRes = await fetch(`/api/profiles/${userId}/stats`)
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        // Fetch recent interests
        const interestsRes = await fetch('/api/profiles/interests?type=received')
        if (interestsRes.ok) {
          const interests = await interestsRes.json()
          setRecentInterests(interests.slice(0, 3).map((interest: any) => ({
            id: interest.id,
            name: interest.fromUser.fullName,
            age: interest.fromUser.age,
            location: interest.fromUser.location,
            profession: interest.fromUser.profession,
            image: interest.fromUser.profilePhoto || "/placeholder.svg?height=60&width=60",
            status: interest.status,
            time: formatTimeAgo(interest.createdAt),
          })))
        }

        // Fetch shortlisted profiles
        const shortlistRes = await fetch('/api/profiles/shortlist')
        if (shortlistRes.ok) {
          const shortlisted = await shortlistRes.json()
          setShortlistedProfiles(shortlisted.slice(0, 3).map((item: any) => ({
            id: item.shortlistedUser.id,
            name: item.shortlistedUser.fullName,
            age: item.shortlistedUser.age,
            location: item.shortlistedUser.location,
            profession: item.shortlistedUser.profession,
            image: item.shortlistedUser.profilePhoto || "/placeholder.svg?height=80&width=80",
            match: calculateMatchPercentage(userProfile, item.shortlistedUser),
          })))
        }
      } catch (e) {
        setError("An error occurred.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // Helper function to format time ago
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} days ago`
    if (hours > 0) return `${hours} hours ago`
    if (minutes > 0) return `${minutes} minutes ago`
    return 'just now'
  }

  // Enhanced profile matching algorithm
  const calculateMatchPercentage = (user1: any, user2: any) => {
    if (!user1 || !user2) return 0
    let matches = 0
    let total = 0

    // Education
    if (user1.education && user2.education) {
      total++
      if (user1.education === user2.education) matches++
    }
    // Location (city or location string)
    if (user1.city && user2.city) {
      total++
      if (user1.city === user2.city) matches++
    } else if (user1.location && user2.location) {
      total++
      if (user1.location === user2.location) matches++
    }
    // Age range (within 3 years)
    if (user1.age && user2.age) {
      total++
      const ageDiff = Math.abs(user1.age - user2.age)
      if (ageDiff <= 3) matches++
    }
    // Sect
    if (user1.sect && user2.sect) {
      total++
      if (user1.sect === user2.sect) matches++
    }
    // Marital Status
    if (user1.maritalStatus && user2.maritalStatus) {
      total++
      if (user1.maritalStatus === user2.maritalStatus) matches++
    }
    // Mother Tongue
    if (user1.motherTongue && user2.motherTongue) {
      total++
      if (user1.motherTongue === user2.motherTongue) matches++
    }
    // Preferred Location (if set)
    if (user1.preferredLocation && user2.location) {
      total++
      if (user2.location.includes(user1.preferredLocation)) matches++
    }
    // Profession
    if (user1.profession && user2.profession) {
      total++
      if (user1.profession === user2.profession) matches++
    }
    // Add more fields as needed for your business logic

    return total > 0 ? Math.round((matches / total) * 100) : 0
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><span>Loading your dashboard...</span></div>
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  }
  if (!userProfile) {
    return <div className="min-h-screen flex items-center justify-center">No profile data found.</div>
  }

  const profileStatus = "approved"

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={userProfile.profilePhoto || "/placeholder.svg"} alt={userProfile.name} />
                    <AvatarFallback className="text-2xl">
                      {userProfile.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className={`${playfair.className} text-2xl font-bold`}>{userProfile.name}</h1>
                    {userProfile.verified && <Badge className="bg-green-500 text-white">✓ Verified</Badge>}
                    {!userProfile.premium && <Badge variant="outline">Free Plan</Badge>}
                  </div>

                  <p className="text-muted-foreground mb-2">
                    {userProfile.age} years • {userProfile.location}
                  </p>
                  <p className="text-muted-foreground mb-4">{userProfile.profession}</p>

                  <div className="flex items-center gap-2 mb-4">
                    {getStatusIcon(profileStatus)}
                    <span className="text-sm font-medium">{getStatusText(profileStatus)}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profile Completeness</span>
                      <span className="text-sm font-medium">{userProfile.completeness}%</span>
                    </div>
                    <Progress value={userProfile.completeness} className="h-2" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link href="/edit-profile">
                    <Button className="gradient-emerald text-white">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  {!userProfile.premium && (
                    <Link href="/premium">
                      <Button variant="outline" className="gradient-gold text-white border-0">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Upgrade to Premium
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Eye className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.profileViews}</div>
                <div className="text-sm text-muted-foreground">Profile Views</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold">{stats.interests}</div>
                <div className="text-sm text-muted-foreground">Interests Received</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{stats.shortlisted}</div>
                <div className="text-sm text-muted-foreground">Shortlisted</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{stats.matches}</div>
                <div className="text-sm text-muted-foreground">Mutual Matches</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="interests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="interests">My Interests</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
              <TabsTrigger value="visitors">Profile Visitors</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            {/* My Interests Tab */}
            <TabsContent value="interests">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentInterests.map((interest) => (
                      <div key={interest.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={interest.image || "/placeholder.svg"} alt={interest.name} />
                            <AvatarFallback>
                              {interest.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{interest.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {interest.age} years • {interest.location}
                            </p>
                            <p className="text-sm text-muted-foreground">{interest.profession}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              interest.status === "accepted"
                                ? "default"
                                : interest.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {interest.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{interest.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shortlisted Tab */}
            <TabsContent value="shortlisted">
              <Card>
                <CardHeader>
                  <CardTitle>Shortlisted Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shortlistedProfiles.map((profile) => (
                      <div key={profile.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={profile.image || "/placeholder.svg"} alt={profile.name} />
                            <AvatarFallback>
                              {profile.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold">{profile.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {profile.age} years • {profile.location}
                            </p>
                            <p className="text-sm text-muted-foreground">{profile.profession}</p>
                          </div>
                          <Badge variant="secondary">{profile.match}% Match</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Interest
                          </Button>
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Visitors Tab */}
            <TabsContent value="visitors">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Profile Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Eye className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
                    <p className="text-muted-foreground mb-4">See who viewed your profile with Premium membership</p>
                    <Link href="/premium">
                      <Button className="gradient-gold text-white">Upgrade Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription & Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">Current Plan</h4>
                          <p className="text-sm text-muted-foreground">Free Membership</p>
                        </div>
                        <Badge variant="outline">Free</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upgrade to Premium to unlock all features and connect with more profiles.
                      </p>
                      <Link href="/premium">
                        <Button className="gradient-emerald text-white">View Premium Plans</Button>
                      </Link>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">Payment History</h4>
                      <div className="text-center py-8 text-muted-foreground">No payment history available</div>
                    </div>
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