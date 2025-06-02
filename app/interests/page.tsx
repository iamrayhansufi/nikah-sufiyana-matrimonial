"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageSquare, Eye } from "lucide-react"
import Link from "next/link"
import { playfair } from "../lib/fonts"

export default function InterestsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className={`${playfair.className} text-2xl font-semibold text-center mb-8`}>Interests</h1>
          
          <Tabs defaultValue="received" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
            </TabsList>

            {/* Received Interests */}
            <TabsContent value="received">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="relative mb-4">
                        <img
                          src="/placeholder.svg?height=200&width=300"
                          alt="Profile"
                          className="w-full aspect-[4/3] object-cover rounded-lg"
                        />
                      </div>
                      <h2 className={`${playfair.className} text-lg font-semibold mb-2`}>Zainab Ali</h2>
                      <p className="text-sm text-muted-foreground mb-4">27 yrs • Delhi • Doctor</p>
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Heart className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Sent Interests */}
            <TabsContent value="sent">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="relative mb-4">
                        <img
                          src="/placeholder.svg?height=200&width=300"
                          alt="Profile"
                          className="w-full aspect-[4/3] object-cover rounded-lg"
                        />
                      </div>
                      <h2 className={`${playfair.className} text-lg font-semibold mb-2`}>Mariam Sheikh</h2>
                      <p className="text-sm text-muted-foreground mb-4">25 yrs • Mumbai • Engineer</p>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          Pending
                        </Button>
                        <Button variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Accepted Interests */}
            <TabsContent value="accepted">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="relative mb-4">
                        <img
                          src="/placeholder.svg?height=200&width=300"
                          alt="Profile"
                          className="w-full aspect-[4/3] object-cover rounded-lg"
                        />
                      </div>
                      <h2 className={`${playfair.className} text-lg font-semibold mb-2`}>Ayesha Patel</h2>
                      <p className="text-sm text-muted-foreground mb-4">26 yrs • Bangalore • Teacher</p>
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  )
} 