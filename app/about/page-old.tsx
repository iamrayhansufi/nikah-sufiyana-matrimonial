"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Users, Award, CheckCircle, ChurchIcon as Mosque, Globe, ArrowRight, Star, MessageSquare, Target, UserCheck, Calendar, Phone } from "lucide-react"
import Link from "next/link"
import { elMessiri } from "../lib/fonts"

export default function AboutPage() {
  const values = [
    {
      icon: Mosque,
      title: "Islamic Values & Traditions",
      description: "We uphold authentic Islamic principles and family traditions while providing modern matrimonial solutions for today's Muslim families.",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Every profile undergoes thorough verification with document checks and family verification to ensure complete authenticity and safety.",
    },
    {
      icon: Heart,
      title: "Meaningful Connections",
      description: "We focus on helping Muslims find compatible life partners based on shared values, family backgrounds, and life goals.",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Building a strong Muslim community where families support each other in finding the perfect matches for their children.",
    },
  ]

  const stats = [
    { number: "100,000+", label: "Happy Families", icon: Users },
    { number: "50,000+", label: "Success Stories", icon: Heart },
    { number: "50+", label: "Cities in India", icon: Globe },
    { number: "95%", label: "Family Satisfaction", icon: Star },
  ]

  const milestones = [
    {
      year: "2019",
      title: "Founded in Hyderabad",
      description: "Started with a vision to help Muslim families find perfect matches while maintaining Islamic values and traditions."
    },
    {
      year: "2020",
      title: "10,000+ Members",
      description: "Reached our first major milestone with thousands of families trusting our platform for matrimonial needs."
    },
    {
      year: "2022",
      title: "Pan-India Presence",
      description: "Expanded across 50+ cities in India, becoming one of the most trusted Muslim matrimonial platforms."
    },
    {
      year: "2024",
      title: "100,000+ Families",
      description: "Celebrating over 100,000 families who have found their perfect matches through our platform."
    }
  ]

  const features = [
    {
      icon: Shield,
      title: "100% Profile Verification",
      description: "Every profile undergoes thorough verification including document verification and family background checks"
    },
    {
      icon: UserCheck,
      title: "Advanced Privacy Controls",
      description: "Complete control over who can view your profile with advanced privacy settings and photo protection"
    },
    {
      icon: MessageSquare,
      title: "Safe Communication",
      description: "Secure messaging system with anti-harassment protection and family-supervised interactions"
    },
    {
      icon: Target,
      title: "Smart Matchmaking",
      description: "AI-powered matchmaking that considers compatibility factors, family preferences, and lifestyle choices"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-amber-600/10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-emerald-500 to-amber-500 text-white px-6 py-2 text-lg">
            ✨ Trusted by 100,000+ Muslim Families Across India
          </Badge>
          <h1 className={`${elMessiri.className} text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent mb-6`}>
            About Nikah Sufiyana
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            India's most trusted Islamic matrimonial platform, dedicated to helping Muslim families find perfect life partners with complete Islamic values and modern convenience.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
              Our Mission & Vision
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Committed to preserving Islamic values while embracing modern matrimonial solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-0 bg-white/90 dark:bg-gray-800/90 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className={`${elMessiri.className} text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center`}>Our Mission</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-center">
                  To provide a safe, secure, and authentic platform where Muslim families can find compatible life partners while upholding Islamic values and traditions. We aim to make the matrimonial process easier, more efficient, and completely trustworthy for Indian Muslim families.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/90 dark:bg-gray-800/90 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className={`${elMessiri.className} text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center`}>Our Vision</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-center">
                  To become India's most trusted and preferred Islamic matrimonial platform, connecting millions of Muslim families and facilitating blessed marriages that strengthen our community and preserve our Islamic heritage for future generations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-amber-600">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold mb-6 text-white`}>
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-emerald-100">
              Real results that showcase our commitment to Muslim families
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <stat.icon className="h-10 w-10 text-white" />
                </div>
                <div className={`${elMessiri.className} text-4xl md:text-5xl font-bold mb-2`}>
                  {stat.number}
                </div>
                <p className="text-white/90 text-lg font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The principles that guide us in helping Muslim families find their perfect matches
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`${elMessiri.className} text-xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>Why Choose Us</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced features that make us the most trusted matrimonial platform for Muslim families
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/90 dark:bg-gray-800/90">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mb-6 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`${elMessiri.className} text-lg font-bold text-gray-800 dark:text-gray-200 mb-2`}>{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Milestones that mark our commitment to the Muslim community
            </p>
          </div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full flex items-center justify-center">
                        <span className={`${elMessiri.className} text-lg font-bold text-white`}>{milestone.year}</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className={`${elMessiri.className} text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2`}>
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-amber-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className={`${elMessiri.className} text-4xl font-bold mb-6`}>
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Join thousands of Muslim families who have found their soulmates through our trusted platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Create Your Profile
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/premium">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg">
                View Premium Plans
                <Star className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
