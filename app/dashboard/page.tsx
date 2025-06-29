"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Star,
  Eye,
  MessageSquare,  CreditCard,
  Edit,
  Camera,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Check,
  Sparkles,
  Award,
} from "lucide-react"
import { elMessiri } from "../lib/fonts"
import { useNotifications } from "@/hooks/notification-provider"
import { PhotoAccessManager } from "@/components/PhotoAccessManager"
import Image from "next/image"

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
  id: string
  name: string
  age: number
  location: string
  profession: string
  image: string
  status: string
  time: string
}

interface DashboardShortlist {
  id: string
  name: string
  age: number
  location: string
  profession: string
  image: string
  match: number
}

interface DashboardStats {
  profileViews: number
  interests: number
  shortlisted: number
  matches: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { refresh: refreshNotifications } = useNotifications()
  const [neonLimitHit, setNeonLimitHit] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    profileViews: 0,
    interests: 0,
    shortlisted: 0,
    matches: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [recentInterests, setRecentInterests] = useState<DashboardInterest[]>([])
  const [receivedInterests, setReceivedInterests] = useState<DashboardInterest[]>([])
  const [shortlistedProfiles, setShortlistedProfiles] = useState<DashboardShortlist[]>([])
  const [activeTab, setActiveTab] = useState("interests")
  
  // Check for tab parameter in URL
  useEffect(() => {
    // Get the tab from URL query parameters
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get('tab')
    
    // Map URL parameter to actual tab values
    const tabMapping: Record<string, string> = {
      'interests': 'interests',
      'shortlist': 'shortlisted',
      'received_interests': 'received_interests',
      'privacy': 'privacy',
      'payments': 'payments'
    }
    
    // Set active tab if a valid tab is provided
    if (tabParam && tabParam in tabMapping) {
      setActiveTab(tabMapping[tabParam])
      console.log('Setting active tab from URL parameter:', tabParam, '→', tabMapping[tabParam])
    }
  }, [])
  
  // Helper function to format time ago
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return 'just now';
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

    return total ? Math.floor((matches / total) * 100) : 50  }  // Helper to calculate profile completeness
  const calculateCompleteness = (profile: any) => {
    if (!profile) return 0
    
    // List of important fields for completeness based on actual database schema
    const fields = [
      // Basic info (high priority)
      'fullName', 'age', 'email', 'phone', 'gender', 'height', 'complexion', 'maritalStatus',
      'city', 'country', 'bio',
      // Religious info (high priority)
      'sect', 'prayerHabit', 'quranReading',
      // Education & Career (medium priority)
      'education', 'profession',
      // Family info (medium priority)
      'fatherOccupation', 'motherOccupation', 'siblings',
      // Partner preferences (medium priority)
      'partnerAge', 'partnerHeight', 'partnerEducation', 'partnerProfession',
      // Profile photos (high priority)
      'profilePhoto'
    ]
    
    let filled = 0
    let total = fields.length
    
    fields.forEach(field => {
      const value = profile[field]
      // Check if field has meaningful value
      if (value !== null && 
          value !== undefined && 
          value !== "" && 
          value !== "null" && 
          value !== "undefined" &&
          String(value).trim() !== "" &&
          String(value).trim().toLowerCase() !== "null") {
        filled++
      }
    })
    
    // Ensure we don't divide by zero and return a valid percentage
    const percentage = total > 0 ? Math.round((filled / total) * 100) : 0
    console.log(`📊 Profile Completeness: ${filled}/${total} fields filled = ${percentage}%`)
    
    return percentage
  }

  useEffect(() => {
    const fetchProfile = async () => {
      // Debug current session state
      console.log('🔍 Dashboard Debug - Auth status:', status);
      console.log('🔍 Dashboard Debug - Session:', {
        exists: !!session,
        userId: session?.user?.id,
        verified: session?.user?.verified,
        email: session?.user?.email
      });
      
      if (status === "loading") return;
      
      if (status === "unauthenticated") {
        console.log('❌ Dashboard: User not authenticated, redirecting to login');
        setError("Please log in to access your dashboard.");
        setLoading(false);
        router.push('/login?callbackUrl=/dashboard');
        return;
      }

      if (!session?.user?.id) {
        console.log('❌ Dashboard: No user ID in session, redirecting to login');
        setError("User ID not found. Please log in again.");
        setLoading(false);
        router.push('/login?callbackUrl=/dashboard');
        return;
      }
      
      // Check if user is verified
      if (session?.user?.verified === false) {
        console.log('📧 Dashboard: User not verified, redirecting to verification page');
        setError("Please verify your email to access your dashboard.");
        setLoading(false);
        if (session?.user?.email) {
          router.push(`/verify-email?email=${encodeURIComponent(session.user.email)}`);
        } else {
          router.push('/verify-email');
        }
        return;
      }
      
      console.log('✅ Dashboard: User authenticated and verified, proceeding to fetch profile');

      // Check if we've hit the Neon database limit
      const isDbLimitHit = sessionStorage.getItem('db_rate_limited') === 'true';
      if (isDbLimitHit && !neonLimitHit) {
        setNeonLimitHit(true);
        console.log("Dashboard: Database transfer limit hit, using cached data where possible");
      }
      
      try {
        // Check for cached data first with 30-minute expiry
        const userId = session.user.id;
        const cachedProfileKey = `dashboard_profile_${userId}`;
        const cachedProfile = sessionStorage.getItem(cachedProfileKey);
        const cacheTimestamp = sessionStorage.getItem(`${cachedProfileKey}_timestamp`);
        const cacheAge = cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : null;
        const useCachedProfile = cachedProfile && cacheAge && cacheAge < 30 * 60 * 1000;
          if (useCachedProfile) {
          console.log('Using cached profile data (30-minute cache)');
          const profileData = JSON.parse(cachedProfile);
          // Calculate completeness if not already present
          if (!profileData.completeness) {
            profileData.completeness = calculateCompleteness(profileData);
          }
          setUserProfile(profileData);
          
          // Update profile views from cached data
          if (profileData.profileViews || profileData.views) {
            setStats(prevStats => ({
              ...prevStats,
              profileViews: profileData.profileViews || profileData.views || 0
            }));
          }
        } else {
          // Add credentials to ensure cookies are sent
          const fetchOptions = {
            credentials: 'include' as RequestCredentials,
            headers: {
              'Cache-Control': 'no-cache'
            }
          };
  
          // Fetch user profile from API
          const res = await fetch(`/api/profiles/${session.user.id}`, fetchOptions)
          if (!res.ok) {
            const errorText = await res.text()
            console.error("Profile fetch failed:", res.status, errorText)
            
            // Check if this is a data transfer limit error
            if (errorText.includes('data transfer') || errorText.includes('allowance')) {
              setNeonLimitHit(true);
              sessionStorage.setItem('db_rate_limited', 'true');              // If we have cached data, use it even if it's older
              if (cachedProfile) {
                const profileData = JSON.parse(cachedProfile);
                // Calculate completeness if not already present
                if (!profileData.completeness) {
                  profileData.completeness = calculateCompleteness(profileData);
                }
                setUserProfile(profileData);
              }
            }
            
            throw new Error(`Profile fetch failed: ${errorText}`)
          }          const profileData = await res.json()
          // Calculate and add completeness to profile data
          profileData.completeness = calculateCompleteness(profileData);
          setUserProfile(profileData)
          
          // Update profile views in stats if available
          if (profileData.profileViews || profileData.views) {
            setStats(prevStats => ({
              ...prevStats,
              profileViews: profileData.profileViews || profileData.views || 0
            }));
          }
          
          // Cache the profile data
          sessionStorage.setItem(cachedProfileKey, JSON.stringify(profileData));
          sessionStorage.setItem(`${cachedProfileKey}_timestamp`, Date.now().toString());
        }

        // Only continue with other API requests if we haven't hit the data limit
        if (!neonLimitHit) {
          // Check for cached stats
          const cachedStatsKey = `dashboard_stats_${userId}`;
          const cachedStats = sessionStorage.getItem(cachedStatsKey);
          const statsTimestamp = sessionStorage.getItem(`${cachedStatsKey}_timestamp`);
          const statsAge = statsTimestamp ? Date.now() - parseInt(statsTimestamp) : null;
          const useCachedStats = cachedStats && statsAge && statsAge < 30 * 60 * 1000;
          
          if (useCachedStats) {
            console.log('Using cached stats data');
            setStats(JSON.parse(cachedStats));
          } else {
            // Fetch user stats for dashboard
            const statsRes = await fetch(`/api/profiles/${session.user.id}/stats`)
            if (statsRes.ok) {
              const statsData = await statsRes.json();
              setStats(statsData);
              
              // Cache the stats
              sessionStorage.setItem(cachedStatsKey, JSON.stringify(statsData));
              sessionStorage.setItem(`${cachedStatsKey}_timestamp`, Date.now().toString());
            }
          }
          
          // Check for cached interests
          const cachedInterestsKey = `dashboard_interests_${userId}`;
          const cachedInterests = sessionStorage.getItem(cachedInterestsKey);
          const interestsTimestamp = sessionStorage.getItem(`${cachedInterestsKey}_timestamp`);
          const interestsAge = interestsTimestamp ? Date.now() - parseInt(interestsTimestamp) : null;
          const useCachedInterests = cachedInterests && interestsAge && interestsAge < 15 * 60 * 1000; // 15 min
          
          if (useCachedInterests) {
            console.log('Using cached interests data');
            const parsedInterests = JSON.parse(cachedInterests);
            setRecentInterests(parsedInterests.recent);
            setReceivedInterests(parsedInterests.received);
            
            // Update stats from cached data
            setStats(prevStats => ({
              ...prevStats,
              interests: parsedInterests.received?.length || 0,
              matches: parsedInterests.accepted?.length || 0
            }));
          } else {
            // Fetch recent interests
            const interestsRes = await fetch('/api/profiles/interests?type=received')
            
            if (interestsRes.ok) {
              const interests = await interestsRes.json()
              
              console.log('Dashboard: Fetched interests:', {
                total: interests.length,
                pending: interests.filter((interest: any) => interest.status === 'pending').length,
                accepted: interests.filter((interest: any) => interest.status === 'accepted').length
              });
              
              // Map interests for the My Interests tab (showing just 3)
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
              // Map all received interests for the Interests Received tab (only pending ones)
              const pendingInterests = interests.filter((interest: any) => interest.status === 'pending');
              const acceptedInterests = interests.filter((interest: any) => interest.status === 'accepted');
              
              setReceivedInterests(pendingInterests.map((interest: any) => ({
                id: interest.id,
                name: interest.fromUser.fullName,
                age: interest.fromUser.age,
                location: interest.fromUser.location,
                profession: interest.fromUser.profession,
                image: interest.fromUser.profilePhoto || "/placeholder.svg?height=60&width=60",
                status: interest.status,
                time: formatTimeAgo(interest.createdAt),
              })))
              
              // Cache the interests data
              const interestsToCache = {
                recent: interests.slice(0, 3).map((interest: any) => ({
                  id: interest.id,
                  name: interest.fromUser.fullName,
                  age: interest.fromUser.age,
                  location: interest.fromUser.location,
                  profession: interest.fromUser.profession,
                  image: interest.fromUser.profilePhoto || "/placeholder.svg?height=60&width=60",
                  status: interest.status,
                  time: formatTimeAgo(interest.createdAt),
                })),
                received: pendingInterests.map((interest: any) => ({
                  id: interest.id,
                  name: interest.fromUser.fullName,
                  age: interest.fromUser.age,
                  location: interest.fromUser.location,
                  profession: interest.fromUser.profession,
                  image: interest.fromUser.profilePhoto || "/placeholder.svg?height=60&width=60",
                  status: interest.status,
                  time: formatTimeAgo(interest.createdAt),
                })),
                accepted: acceptedInterests.map((interest: any) => ({
                  id: interest.id,
                  name: interest.fromUser.fullName,
                  age: interest.fromUser.age,
                  location: interest.fromUser.location,
                  profession: interest.fromUser.profession,
                  image: interest.fromUser.profilePhoto || "/placeholder.svg?height=60&width=60",
                  status: interest.status,
                  time: formatTimeAgo(interest.createdAt),
                }))
              };
              sessionStorage.setItem(cachedInterestsKey, JSON.stringify(interestsToCache));
              sessionStorage.setItem(`${cachedInterestsKey}_timestamp`, Date.now().toString());
              
              // Update stats with actual counts
              setStats(prevStats => ({
                ...prevStats,
                interests: pendingInterests.length, // Count of pending received interests
                matches: acceptedInterests.length // Count of accepted interests (mutual matches)
              }));
            }
            
            // Fetch shortlisted profiles
            const shortlistRes = await fetch('/api/profiles/shortlist');
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
              })));
              
              // Update shortlisted count in stats
              setStats(prevStats => ({
                ...prevStats,
                shortlisted: shortlisted.length
              }));
            }
          }
        }
      } catch (e) {
        setError("An error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();  }, [session, status]);

  const handleInterestResponse = async (interestId: string, action: 'accept' | 'decline') => {
    try {
      const response = await fetch('/api/profiles/respond-interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interestId: interestId,
          action: action
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action} interest`);
      }
        // Remove the interest from the list since it's been handled
      setReceivedInterests(prev => {
        const updatedInterests = prev.filter(interest => interest.id !== interestId);
        
        // Update stats count
        setStats(prevStats => ({
          ...prevStats,
          interests: updatedInterests.length
        }));
        
        return updatedInterests;
      });
      
      // Clear cached interests since data has changed
      const userId = session?.user?.id;
      if (userId) {
        const cachedInterestsKey = `dashboard_interests_${userId}`;
        sessionStorage.removeItem(cachedInterestsKey);
        sessionStorage.removeItem(`${cachedInterestsKey}_timestamp`);
      }
      
      // Show success message
      alert(action === 'accept' 
        ? 'Interest accepted! They can now view your photos.' 
        : 'Interest declined.');
      
      // Refresh notifications to update the count
      refreshNotifications();
      
    } catch (error) {
      console.error(`Failed to ${action} interest:`, error);
      alert(`Failed to ${action} interest. Please try again.`);
    }
  };

  // Handle dashboard photo upload
  const handleDashboardPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const file = files[0]
    console.log("Dashboard photo upload - Selected file:", file.name, "Type:", file.type, "Size:", file.size);
    
    // Check file size client-side
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("The image file is too large. Please select an image smaller than 5MB.");
      return;
    }
    
    // Check file type client-side
    if (!file.type.startsWith('image/')) {
      alert("Please select an image file (JPG, PNG, GIF, etc.)");
      return;
    }
    
    const formData = new FormData()
    formData.append('photo', file)
    
    try {
      console.log("Sending dashboard photo upload request...");
      
      const response = await fetch('/api/profiles/upload-photo', {
        method: 'POST',
        body: formData,
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      const responseData = await response.json()
      
      if (response.ok) {
        console.log("Dashboard photo uploaded successfully:", responseData.url);
        alert("Profile photo updated successfully!");
        
        // Refresh the profile data to show the new photo
        if (userProfile) {
          setUserProfile((prev: any) => ({
            ...prev,
            profilePhoto: responseData.url
          }));
        }
        
        // Clear the input
        e.target.value = '';
      } else {
        console.error("Dashboard photo upload failed:", responseData.error);
        alert(`Upload failed: ${responseData.error || 'Please try again with a smaller image.'}`);
      }
    } catch (error) {
      console.error("Dashboard photo upload error:", error)
      alert("Failed to upload photo. Please try again.");
    }
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
    <div className="min-h-screen bg-royal-gradient">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Royal Welcome Header */}
          <div className="text-center mb-8">            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-royal-primary to-royal-primary/80 rounded-full flex items-center justify-center shadow-lg">
              <Image
                src="/Nikah-Sufiyana-Icon-white-01.svg"
                alt="Nikah Sufiyana Icon"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </div>
            <h1 className={`${elMessiri.className} text-3xl md:text-4xl font-bold text-gray-800 mb-2`}>
              Welcome to Your Nikah Sufiyana Dashboard
            </h1>
            <div className="flex justify-center mb-4">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={200}
                height={12}
                className="opacity-60"
              />
            </div>
            <p className="text-gray-600">
              Manage your blessed profile and discover your destined companion
            </p>
          </div>

          {/* Royal Profile Card */}
          <Card className="mb-8 border-0 shadow-2xl royal-shadow bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-royal-primary/20">
                    <AvatarImage src={userProfile.profilePhoto || "/placeholder.svg"} alt={userProfile.name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-royal-primary/20 to-royal-primary/10 text-royal-primary">
                      {userProfile.name && typeof userProfile.name === 'string' 
                        ? userProfile.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="dashboard-photo-upload" 
                    className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-royal-primary hover:bg-royal-primary/90 shadow-lg flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Camera className="h-5 w-5 text-white" />
                    <input 
                      id="dashboard-photo-upload" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleDashboardPhotoUpload}
                      className="hidden" 
                    />
                  </label>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className={`${elMessiri.className} text-3xl font-bold text-gray-800`}>{userProfile.name}</h1>
                    {userProfile.verified && <Badge className="bg-green-500 text-white flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Blessed & Verified
                    </Badge>}
                    {/* Premium badge removed - requires admin approval verification */}
                    {/* {userProfile.premium ? (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white flex items-center gap-1">
                        <Image
                          src="/Nikah-Sufiyana-Icon-white-01.svg"
                          alt="Nikah Sufiyana Icon"
                          width={12}
                          height={12}
                          className="h-3 w-3"
                        />
                        Royal Member
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-royal-primary text-royal-primary">Sufiyana Premium Plan</Badge>
                    )} */}
                  </div>

                  <p className="text-gray-600 mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-royal-primary" />
                    {userProfile.age} years • {userProfile.location}
                  </p>
                  <p className="text-gray-600 mb-4">{userProfile.profession}</p>

                  <div className="flex items-center gap-2 mb-4">
                    {getStatusIcon(profileStatus)}                    <span className="text-lg font-medium">{getStatusText(profileStatus)}</span>
                  </div>                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base lg:text-lg font-medium text-gray-700">Profile Completeness</span>
                      <span className="text-base lg:text-lg font-bold text-royal-primary">
                        {userProfile?.completeness ? userProfile.completeness : calculateCompleteness(userProfile)}%
                      </span>
                    </div>
                    <Progress 
                      value={userProfile?.completeness ? userProfile.completeness : calculateCompleteness(userProfile)} 
                      className="h-2.5 bg-gray-200" 
                    />
                    {(userProfile?.completeness ? userProfile.completeness : calculateCompleteness(userProfile)) < 100 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">
                          Complete your profile to get more visibility and better matches!
                        </p>
                        <Link href="/edit-profile">
                          <Button size="sm" variant="outline" className="text-royal-primary border-royal-primary hover:bg-royal-primary hover:text-white">
                            <Edit className="h-4 w-4 mr-1" />
                            Complete Profile
                          </Button>
                        </Link>
                      </div>
                    )}
                    {(userProfile?.completeness ? userProfile.completeness : calculateCompleteness(userProfile)) === 100 && (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <CheckCircle className="h-4 w-4" />
                        Profile 100% Complete!
                      </div>
                    )}
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
                <div className="text-lg text-muted-foreground">Profile Views</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold">{stats.interests}</div>
                <div className="text-lg text-muted-foreground">Interests Received</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{stats.shortlisted}</div>
                <div className="text-lg text-muted-foreground">Shortlisted</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{stats.matches}</div>
                <div className="text-lg text-muted-foreground">Mutual Matches</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="interests">My Interests</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
              <TabsTrigger value="received_interests">Interests Received</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
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
                              {interest.name && typeof interest.name === 'string'
                                ? interest.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{interest.name}</h4>
                            <p className="text-lg text-muted-foreground">
                              {interest.age} years • {interest.location}
                            </p>
                            <p className="text-lg text-muted-foreground">{interest.profession}</p>
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
                              {profile.name && typeof profile.name === 'string'
                                ? profile.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold">{profile.name}</h4>
                            <p className="text-lg text-muted-foreground">
                              {profile.age} years • {profile.location}
                            </p>
                            <p className="text-lg text-muted-foreground">{profile.profession}</p>
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

            {/* Interests Received Tab */}
            <TabsContent value="received_interests">
              <Card>
                <CardHeader>
                  <CardTitle>Interests Received</CardTitle>
                </CardHeader>
                <CardContent>
                  {receivedInterests && receivedInterests.length > 0 ? (
                    <div className="space-y-4">
                      {receivedInterests.map((interest) => (
                        <div key={interest.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={interest.image || "/placeholder.svg"} alt={interest.name} />
                              <AvatarFallback>
                                {interest.name && typeof interest.name === 'string'
                                  ? interest.name.charAt(0)
                                  : 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{interest.name}</h3>
                              <div className="text-lg text-muted-foreground">
                                {interest.age} years • {interest.location} • {interest.profession || 'Not specified'}
                              </div>
                              <div className="text-xs text-muted-foreground">Interest sent {interest.time}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="gradient-emerald text-white"
                              onClick={() => handleInterestResponse(interest.id, 'accept')}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Allow Photos
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleInterestResponse(interest.id, 'decline')}
                            >
                              Decline
                            </Button>
                            <Link href={`/profile/${interest.id}`}>
                              <Button size="sm" variant="outline">
                                View Profile
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Interests Yet</h3>
                      <p className="text-muted-foreground mb-4">When someone shows interest in your profile, it will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <div className="space-y-6">
                <PhotoAccessManager />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Control who can view your photos and profile information
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Profile Photo Visibility</h4>
                          <p className="text-sm text-muted-foreground">
                            Show your photos to other members automatically
                          </p>
                        </div>
                        <Badge variant={userProfile?.showPhotos !== false ? "default" : "secondary"}>
                          {userProfile?.showPhotos !== false ? "Public" : "Private"}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                        <p className="font-medium text-blue-800 mb-1">How it works:</p>
                        <ul className="space-y-1 text-blue-700">
                          <li>• When set to Private, only users whose interest you accept can see your photos</li>
                          <li>• You can set time limits when accepting interests (1 day to permanent)</li>
                          <li>• You can revoke photo access at any time from the "Photo Access Management" section above</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                          <p className="text-lg text-muted-foreground">Free Membership</p>
                        </div>
                        <Badge variant="outline">Free</Badge>
                      </div>
                      <p className="text-lg text-muted-foreground mb-4">
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
      </div>      <Footer />
    </div>
  )
}
