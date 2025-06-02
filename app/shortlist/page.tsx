"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MessageSquare, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { playfair } from "../lib/fonts"

export default function ShortlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className={`${playfair.className} text-2xl font-semibold text-center mb-8`}>Shortlisted Profiles</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <img
                      src="/placeholder.svg?height=200&width=300"
                      alt="Profile"
                      className="w-full aspect-[4/3] object-cover rounded-lg"
                    />
                  </div>
                  <h2 className={`${playfair.className} text-lg font-semibold mb-2`}>Sarah Khan</h2>
                  <p className="text-sm text-muted-foreground mb-4">24 yrs • Mumbai • Software Engineer</p>
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Heart className="h-4 w-4 mr-2" />
                      Send Interest
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {false && (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className={`${playfair.className} text-xl font-semibold mb-2`}>No Shortlisted Profiles</h2>
              <p className="text-muted-foreground mb-6">
                You haven't shortlisted any profiles yet. Browse profiles and add them to your shortlist.
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