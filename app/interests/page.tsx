"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageSquare, Eye, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { elMessiri } from "../lib/fonts"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface InterestItem {
  id: number
  fromUserId: number
  toUserId: number
  status: "pending" | "accepted" | "declined"
  createdAt: string
  fromUser: {
    id: number
    fullName: string
    age: number
    location: string
    profession: string
    profilePhoto: string | null
  }
}

export default function InterestsPage() {
  const [receivedInterests, setReceivedInterests] = useState<InterestItem[]>([])
  const [sentInterests, setSentInterests] = useState<InterestItem[]>([])
  const [acceptedInterests, setAcceptedInterests] = useState<InterestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Fetch all interests
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        // Fetch received interests
        const receivedRes = await fetch('/api/profiles/interests?type=received')
        if (receivedRes.ok) {
          const receivedData = await receivedRes.json()
          setReceivedInterests(receivedData.filter((interest: InterestItem) => interest.status === 'pending'))
          
          // Also add the accepted ones to the accepted list
          const acceptedFromReceived = receivedData.filter((interest: InterestItem) => interest.status === 'accepted')
          setAcceptedInterests(prevAccepted => [...prevAccepted, ...acceptedFromReceived])
        }
        
        // Fetch sent interests
        const sentRes = await fetch('/api/profiles/interests?type=sent')
        if (sentRes.ok) {
          const sentData = await sentRes.json()
          setSentInterests(sentData.filter((interest: InterestItem) => interest.status === 'pending'))
          
          // Also add the accepted ones to the accepted list
          const acceptedFromSent = sentData.filter((interest: InterestItem) => interest.status === 'accepted')
          setAcceptedInterests(prevAccepted => [...prevAccepted, ...acceptedFromSent])
        }
        
      } catch (error) {
        console.error('Failed to fetch interests:', error)
        toast({
          title: "Failed to load interests",
          description: "Please try again later",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchInterests()
  }, [toast])
  
  // Handle accepting an interest
  const handleAcceptInterest = async (interestId: number) => {
    try {
      setUpdatingId(interestId)
      
      const response = await fetch('/api/profiles/interests/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interestId,
          status: 'accepted'
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to accept interest')
      }
      
      // Update the UI - move the interest from received to accepted
      const acceptedInterest = receivedInterests.find(interest => interest.id === interestId)
      if (acceptedInterest) {
        acceptedInterest.status = 'accepted'
        setAcceptedInterests(prev => [...prev, acceptedInterest])
        setReceivedInterests(prev => prev.filter(interest => interest.id !== interestId))
        
        toast({
          title: "Interest Accepted",
          description: "You can now view this member's photos and contact info",
          variant: "default"
        })
      }
      
    } catch (error) {
      console.error('Failed to accept interest:', error)
      toast({
        title: "Failed to accept interest",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setUpdatingId(null)
    }
  }
  
  // Handle declining an interest
  const handleDeclineInterest = async (interestId: number) => {
    try {
      setUpdatingId(interestId)
      
      const response = await fetch('/api/profiles/interests/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interestId,
          status: 'declined'
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to decline interest')
      }
      
      // Update the UI - remove from received list
      setReceivedInterests(prev => prev.filter(interest => interest.id !== interestId))
      
      toast({
        title: "Interest Declined",
        description: "The member will not be notified",
        variant: "default"
      })
      
    } catch (error) {
      console.error('Failed to decline interest:', error)
      toast({
        title: "Failed to decline interest",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setUpdatingId(null)
    }
  }
  
  // Handle viewing a profile
  const handleViewProfile = (userId: number) => {
    router.push(`/profile/${userId}`)
  }
  
  // Handle messaging a user
  const handleMessage = (userId: number) => {
    router.push(`/messages?userId=${userId}`)
  }
  
  // Function to format age and location
  const formatProfileInfo = (age: number, location: string, profession: string) => {
    const parts = []
    if (age) parts.push(`${age} yrs`)
    if (location) parts.push(location)
    if (profession) parts.push(profession)
    return parts.join(' • ')
  }

  if (loading) {
    return (      <div className="min-h-screen bg-royal-gradient">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-royal-primary" />
            <p className="text-gray-700 font-medium">Loading your blessed interests...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (    <div className="min-h-screen bg-royal-gradient">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">          <h1 className={`${elMessiri.className} text-6xl md:text-7xl font-bold text-royal-primary text-center mb-8`}>
            Sacred Sufiyana Interests - Divine Connections
          </h1>
          
          <div className="flex justify-center mb-8">
            <Image
              src="/sufiyana-border-ui.svg"
              alt="Decorative Border"
              width={300}
              height={12}
              className="opacity-60"
            />
          </div>
          
          <Tabs defaultValue="received" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="received" className="data-[state=active]:bg-royal-primary data-[state=active]:text-white">
                Received{receivedInterests.length > 0 ? ` (${receivedInterests.length})` : ''}
              </TabsTrigger>
              <TabsTrigger value="sent" className="data-[state=active]:bg-royal-primary data-[state=active]:text-white">
                Sent{sentInterests.length > 0 ? ` (${sentInterests.length})` : ''}
              </TabsTrigger>
              <TabsTrigger value="accepted" className="data-[state=active]:bg-royal-primary data-[state=active]:text-white">
                Matched{acceptedInterests.length > 0 ? ` (${acceptedInterests.length})` : ''}
              </TabsTrigger>
            </TabsList>

            {/* Received Interests */}
            <TabsContent value="received">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {receivedInterests.length > 0 ? (
                  receivedInterests.map((interest, index) => (
                    <motion.div
                      key={interest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="relative mb-4">
                          <Image
                            src={interest.fromUser.profilePhoto || "/placeholder-user.jpg"}
                            alt={interest.fromUser.fullName}
                            width={300}
                            height={200}
                            className="w-full aspect-[4/3] object-cover rounded-lg border-2 border-royal-primary/20"
                          />
                        </div>
                        <h2 className={`${elMessiri.className} text-xl font-bold text-royal-primary mb-2`}>{interest.fromUser.fullName}</h2>
                        <p className="text-sm text-gray-600 mb-4 font-medium">
                          {formatProfileInfo(interest.fromUser.age, interest.fromUser.location, interest.fromUser.profession)}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1 bg-royal-primary hover:bg-royal-primary/90 text-white shadow-lg" 
                            onClick={() => handleAcceptInterest(interest.id)}
                            disabled={updatingId === interest.id}
                          >
                            {updatingId === interest.id ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Heart className="h-4 w-4 mr-2" />
                            )}
                            Accept Blessed Interest
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleViewProfile(interest.fromUser.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleDeclineInterest(interest.id)}
                            disabled={updatingId === interest.id}
                          >
                            <X className="h-4 w-4" />
                          </Button>                        </div>
                      </CardContent>
                    </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-muted-foreground">No interests received yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Sent Interests */}
            <TabsContent value="sent">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sentInterests.length > 0 ? (
                  sentInterests.map((interest) => (
                    <Card key={interest.id}>
                      <CardContent className="p-6">
                        <div className="relative mb-4">
                          <Image
                            src={interest.fromUser.profilePhoto || "/placeholder-user.jpg"}
                            alt={interest.fromUser.fullName}
                            width={300}
                            height={200}
                            className="w-full aspect-[4/3] object-cover rounded-lg"
                          />
                        </div>                        <h2 className={`${elMessiri.className} text-lg font-semibold mb-2 text-royal-primary`}>{interest.fromUser.fullName}</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          {formatProfileInfo(interest.fromUser.age, interest.fromUser.location, interest.fromUser.profession)}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1" disabled>
                            Pending
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleViewProfile(interest.fromUser.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-muted-foreground">You haven't sent any interests yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Accepted Interests */}
            <TabsContent value="accepted">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {acceptedInterests.length > 0 ? (
                  acceptedInterests.map((interest) => (
                    <Card key={interest.id}>
                      <CardContent className="p-6">
                        <div className="relative mb-4">
                          <Image
                            src={interest.fromUser.profilePhoto || "/placeholder-user.jpg"}
                            alt={interest.fromUser.fullName}
                            width={300}
                            height={200}
                            className="w-full aspect-[4/3] object-cover rounded-lg"
                          />
                        </div>                        <h2 className={`${elMessiri.className} text-lg font-semibold mb-2 text-royal-primary`}>{interest.fromUser.fullName}</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          {formatProfileInfo(interest.fromUser.age, interest.fromUser.location, interest.fromUser.profession)}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1 bg-royal-primary hover:bg-royal-primary/90 text-white"
                            onClick={() => handleMessage(interest.fromUser.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleViewProfile(interest.fromUser.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-muted-foreground">No matches yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  )
}