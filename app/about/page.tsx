"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Users, Award, CheckCircle, ChurchIcon as Mosque, Globe, ArrowRight, Star, MessageSquare, Target, UserCheck, Calendar, Phone, Eye, TrendingUp, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { elMessiri } from "../lib/fonts"

export default function AboutPage() {
  const ourValues = [
    {
      icon: Mosque,
      title: "Islamic Values First",
      description: "Built on authentic Islamic principles, respecting traditions while embracing modern matrimonial solutions."
    },
    {
      icon: Shield,
      title: "Trust & Authenticity",
      description: "Comprehensive verification process ensuring genuine profiles and secure interactions for all members."
    },
    {
      icon: Heart,
      title: "Meaningful Connections",
      description: "Focus on compatibility beyond surface level - shared values, faith, and life aspirations."
    },
    {
      icon: Users,
      title: "Family Oriented",
      description: "Understanding the importance of family approval and involvement in Islamic matrimonial decisions."
    }
  ]

  const impactStats = [
    { number: "25,000+", label: "Success Stories", icon: Heart },
    { number: "2,00,000+", label: "Verified Profiles", icon: UserCheck },
    { number: "95%", label: "Success Rate", icon: TrendingUp },
    { number: "50+", label: "Cities Covered", icon: MapPin }
  ]

  const whyChooseUs = [
    {
      icon: Target,
      title: "Hyderabad's #1 Muslim Matrimonial",
      description: "Leading platform specifically designed for the Hyderabadi Muslim community with deep local understanding."
    },
    {
      icon: Clock,
      title: "10+ Years of Excellence",
      description: "A decade of successful matchmaking with thousands of happy marriages across India."
    },
    {
      icon: Globe,
      title: "Global Reach, Local Touch",
      description: "Connecting Muslims worldwide while maintaining strong roots in Indian Islamic traditions."
    },
    {
      icon: Award,
      title: "Premium Service Quality",
      description: "Personalized matchmaking with dedicated relationship managers and family counselors."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-amber-50/30"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 text-lg">
              ✨ About Nikah Sufiyana
            </Badge>
            <h1 className={`${elMessiri.className} text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-6`}>
              Connecting Hearts, <br />Honoring Traditions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              India's most trusted Islamic matrimonial platform, dedicated to helping Muslim families find compatible life partners while preserving authentic Islamic values and cultural traditions.
            </p>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center border-0 bg-white/80 backdrop-blur-sm hover:scale-105 transition-transform duration-300">                <CardContent className="p-6">
                  <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 mb-4">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`${elMessiri.className} text-3xl font-bold text-red-600 mb-2`}>
                    {stat.number}
                  </div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8`}>
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                To create a platform that honors Islamic matrimonial traditions while providing modern, secure, and effective matchmaking services for Muslim families across India and beyond.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                We believe that finding a life partner is not just about individual compatibility, but about bringing together families and communities in the spirit of Islamic values.
              </p>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3">
                  Join Our Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>            <div className="grid grid-cols-2 gap-6">
              {ourValues.map((value, index) => (
                <Card key={index} className="border-0 bg-white/90 hover:shadow-lg transition-shadow duration-300 relative">
                  {/* SVG Borders */}
                  <>
                    {/* Bottom Left Border */}
                    <div className="absolute bottom-0 left-0 w-10 h-20 opacity-70">
                      <Image
                        src="/bottom-left-border.svg"
                        alt="Bottom Left Border"
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    {/* Top Right Border */}
                    <div className="absolute top-0 right-0 w-10 h-20 opacity-70">
                      <Image
                        src="/top-right-border.svg"
                        alt="Top Right Border"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </>
                    <CardContent className="p-6 text-center relative">
                    <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 mb-4">
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className={`${elMessiri.className} text-lg font-semibold text-gray-800 mb-3`}>
                      {value.title}
                    </h3>
                    
                    {/* Text Bottom Border */}
                    <div className="flex justify-center mb-4">
                      <Image
                        src="/text-bottom-border.svg"
                        alt="Text Bottom Border"
                        width={130}
                        height={13}
                        className="opacity-60"
                      />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
              Why Choose Nikah Sufiyana?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're not just another matrimonial site - we're your trusted partner in finding your perfect match
            </p>
          </div>          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseUs.map((reason, index) => (
              <Card key={index} className="group border-0 bg-gradient-to-br from-white to-red-50 hover:shadow-xl transition-all duration-300 relative">
                {/* SVG Borders */}
                <>
                  {/* Bottom Left Border */}
                  <div className="absolute bottom-0 left-0 w-10 h-20 opacity-70">
                    <Image
                      src="/bottom-left-border.svg"
                      alt="Bottom Left Border"
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  {/* Top Right Border */}
                  <div className="absolute top-0 right-0 w-10 h-20 opacity-70">
                    <Image
                      src="/top-right-border.svg"
                      alt="Top Right Border"
                      fill
                      className="object-contain"
                    />
                  </div>
                </>
                
                <CardContent className="p-8 relative">                  <div className="flex items-start gap-4">
                    <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 group-hover:scale-110 transition-transform duration-300">
                      <reason.icon className="h-6 w-6 text-white" />
                    </div>                    <div>
                      <h3 className={`${elMessiri.className} text-xl font-bold text-gray-800 mb-3`}>
                        {reason.title}
                      </h3>
                      
                      {/* Text Bottom Border */}
                      <div className="flex justify-start mb-4">
                        <Image
                          src="/text-bottom-border.svg"
                          alt="Text Bottom Border"
                          width={130}
                          height={13}
                          className="opacity-60"
                        />
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              From a small idea to India's leading Islamic matrimonial platform
            </p>
          </div>

          <div className="space-y-8">
            {[
              { year: "2014", title: "The Beginning", description: "Started with a vision to create an authentic Islamic matrimonial platform for Hyderabadi Muslims" },
              { year: "2017", title: "Rapid Growth", description: "Expanded across India with 50,000+ registered members and our first 1,000 success stories" },
              { year: "2020", title: "Digital Innovation", description: "Launched mobile app and advanced matching algorithms while maintaining Islamic authenticity" },
              { year: "2024", title: "Community Leader", description: "Now serving 2,00,000+ verified profiles with 25,000+ successful marriages" }
            ].map((milestone, index) => (
              <div key={index} className="flex gap-6 items-start">                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
                  {index < 3 && <div className="w-0.5 h-16 bg-gradient-to-b from-red-500 to-red-600 mt-2"></div>}
                </div>
                <Card className="flex-1 border-0 bg-white/90">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                        {milestone.year}
                      </Badge>
                      <h3 className={`${elMessiri.className} text-xl font-bold text-gray-800`}>
                        {milestone.title}
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      {milestone.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto text-center text-white">          <h2 className={`${elMessiri.className} text-4xl font-bold mb-6 text-white`}>
            Ready to Find Your Life Partner?
          </h2>
          <p className="text-xl text-red-100 mb-8 leading-relaxed">
            Join thousands of successful Muslim couples who found their perfect match through Nikah Sufiyana. Start your journey towards a blessed marriage today.
          </p>          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100 border-0 px-8 py-4 text-lg font-semibold">
                Create Your Profile
                <Heart className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg">
                Browse Profiles
                <Eye className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-red-400/30">
            <p className="text-red-200">
              <strong>Need help getting started?</strong>
            </p>
            <Link href="/contact">
              <Button variant="outline" className="mt-4 border-white text-white hover:bg-white hover:text-red-600">
                Contact Our Team
                <Phone className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
