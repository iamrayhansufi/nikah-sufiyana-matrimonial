"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MessageSquare, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { elMessiri } from "../lib/fonts"
import { motion } from "framer-motion"
import Image from "next/image"

export default function ShortlistPage() {
  return (    <div className="min-h-screen bg-royal-gradient">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className={`${elMessiri.className} text-6xl md:text-7xl font-bold text-royal-primary mb-6`}>
              Your Sacred Sufiyana Shortlist
            </h1>
            <div className="flex justify-center mb-6">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={300}
                height={12}
                className="opacity-60"
              />
            </div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              Discover your saved divine connections - souls you've marked for deeper spiritual consideration on your matrimonial journey.
            </p>
          </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i, index) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <Image
                        src="/placeholder-user.jpg"
                        alt="Profile"
                        width={300}
                        height={200}
                        className="w-full aspect-[4/3] object-cover rounded-lg border-2 border-royal-primary/20"
                      />
                    </div>
                    <h2 className={`${elMessiri.className} text-xl font-bold text-royal-primary mb-2`}>Sister Sarah Khan</h2>
                    <p className="text-sm text-gray-600 mb-4 font-medium">24 yrs • Mumbai • Software Engineer</p>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-royal-primary hover:bg-royal-primary/90 text-white">
                        <Heart className="h-4 w-4 mr-2" />
                        Send Blessed Interest
                      </Button>
                      <Button variant="outline" className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {false && (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className={`${elMessiri.className} text-xl font-semibold mb-2 text-royal-primary`}>No Sacred Connections Yet</h2>              <p className="text-gray-600 mb-6 font-medium">
                You haven't saved any divine connections yet. Browse our blessed profiles and add potential soulmates to your sacred shortlist for deeper consideration.
              </p>
              <Link href="/browse">
                <Button className="bg-royal-primary hover:bg-royal-primary/90 text-white px-8 py-4 text-lg font-semibold">
                  Discover Sacred Connections
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
} 