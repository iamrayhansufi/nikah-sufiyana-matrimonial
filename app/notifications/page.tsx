"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MessageSquare, Eye, Bell, Star } from "lucide-react"
import Link from "next/link"
import { playfair } from "../lib/fonts"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className={`${playfair.className} text-2xl font-semibold text-center mb-8`}>Notifications</h1>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Today */}
                <div>
                  <h2 className={`${playfair.className} text-lg font-semibold mb-4`}>Today</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`${playfair.className} font-medium`}>New Interest Received</h3>
                        <p className="text-sm text-muted-foreground">
                          Aisha Khan has shown interest in your profile
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Button size="sm">Accept</Button>
                          <Button size="sm" variant="outline">View Profile</Button>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">2h ago</div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`${playfair.className} font-medium`}>New Message</h3>
                        <p className="text-sm text-muted-foreground">
                          You have a new message from Zainab Ali
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          Read Message
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">5h ago</div>
                    </div>
                  </div>
                </div>

                {/* Yesterday */}
                <div>
                  <h2 className={`${playfair.className} text-lg font-semibold mb-4`}>Yesterday</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Eye className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`${playfair.className} font-medium`}>Profile Views</h3>
                        <p className="text-sm text-muted-foreground">
                          Your profile was viewed by 5 new people
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          View Details
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">1d ago</div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`${playfair.className} font-medium`}>Premium Feature</h3>
                        <p className="text-sm text-muted-foreground">
                          Upgrade to Premium to unlock advanced search filters
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          Upgrade Now
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">1d ago</div>
                    </div>
                  </div>
                </div>

                {/* Earlier */}
                <div>
                  <h2 className={`${playfair.className} text-lg font-semibold mb-4`}>Earlier</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`${playfair.className} font-medium`}>Profile Match</h3>
                        <p className="text-sm text-muted-foreground">
                          We found 3 new matches based on your preferences
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          View Matches
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">3d ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          {false && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className={`${playfair.className} text-xl font-semibold mb-2`}>No Notifications</h2>
              <p className="text-muted-foreground mb-6">
                You're all caught up! Check back later for new updates.
              </p>
              <Link href="/browse">
                <Button>Browse Profiles</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
} 