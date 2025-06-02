"use client"

import { useState } from "react"
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

export default function DashboardPage() {
  const [profileStatus, setProfileStatus] = useState<"pending" | "approved" | "active">("approved")

  const userProfile = {
    name: "Fatima Ahmed",
    age: 26,
    location: "Mumbai, Maharashtra",
    profession: "Software Engineer",
    profilePhoto: "/placeholder.svg?height=150&width=150",
    completeness: 85,
    verified: true,
    premium: false,
  }

  const stats = {
    profileViews: 156,
    interests: 23,
    shortlisted: 12,
    matches: 8,
  }

  const recentInterests = [
    {
      id: 1,
      name: "Ahmed Khan",
      age: 28,
      location: "Delhi",
      profession: "Doctor",
      image: "/placeholder.svg?height=60&width=60",
      status: "pending",
      time: "2 hours ago",
    },
    {
      id: 2,
      name: "Omar Ali",
      age: 30,
      location: "Bangalore",
      profession: "Engineer",
      image: "/placeholder.svg?height=60&width=60",
      status: "accepted",
      time: "1 day ago",
    },
    {
      id: 3,
      name: "Hassan Sheikh",
      age: 27,
      location: "Hyderabad",
      profession: "Teacher",
      image: "/placeholder.svg?height=60&width=60",
      status: "declined",
      time: "3 days ago",
    },
  ]

  const shortlistedProfiles = [
    {
      id: 1,
      name: "Yusuf Rahman",
      age: 29,
      location: "Pune",
      profession: "Business Analyst",
      image: "/placeholder.svg?height=80&width=80",
      match: 92,
    },
    {
      id: 2,
      name: "Ibrahim Malik",
      age: 31,
      location: "Chennai",
      profession: "Architect",
      image: "/placeholder.svg?height=80&width=80",
      match: 88,
    },
  ]

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
                        .map((n) => n[0])
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
                                .map((n) => n[0])
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
                                .map((n) => n[0])
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