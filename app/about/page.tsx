"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Users, Award, CheckCircle, ChurchIcon as Mosque, Globe, ArrowRight, Star, MessageSquare } from "lucide-react"
import Link from "next/link"
import { playfair } from "../lib/fonts"

export default function AboutPage() {
  const values = [
    {
      icon: Mosque,
      title: "Islamic Values",
      description:
        "We prioritize Islamic principles and values in every aspect of our platform, ensuring halal relationships.",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description:
        "Every profile is manually verified to ensure authenticity and create a safe environment for our members.",
    },
    {
      icon: Heart,
      title: "Meaningful Connections",
      description: "We focus on helping Muslims find life partners based on compatibility, values, and mutual respect.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a strong Muslim community where members support each other in their journey to find love.",
    },
  ]

  const stats = [
    { number: "50,000+", label: "Verified Members" },
    { number: "5,000+", label: "Success Stories" },
    { number: "100+", label: "Cities Covered" },
    { number: "99%", label: "Member Satisfaction" },
  ]

  const team = [
    {
      name: "Dr. Ahmed Hassan",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=200&width=200",
      description: "Islamic scholar and technology entrepreneur with 15+ years experience",
    },
    {
      name: "Fatima Al-Zahra",
      role: "Head of Community",
      image: "/placeholder.svg?height=200&width=200",
      description: "Marriage counselor and community leader specializing in Islamic relationships",
    },
    {
      name: "Omar Malik",
      role: "CTO",
      image: "/placeholder.svg?height=200&width=200",
      description: "Technology expert ensuring platform security and user experience",
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "100% Profile Verification",
      description: "Every profile undergoes thorough verification to ensure authenticity"
    },
    {
      icon: Users,
      title: "Privacy Controls",
      description: "Advanced privacy settings to control who can view your profile"
    },
    {
      icon: MessageSquare,
      title: "Safe Communication",
      description: "Secure messaging system with anti-harassment protection"
    },
    {
      icon: Star,
      title: "Premium Support",
      description: "Dedicated relationship advisors to guide your journey"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/islamic-pattern-bg.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm hover:bg-primary hover:text-white transition-colors">
              Trusted by 50,000+ Muslims Worldwide
            </Badge>
            <h1 className={`${playfair.className} text-4xl md:text-5xl lg:text-6xl font-bold mb-6`}>
              About Nikah Sufiyana
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your trusted partner in finding a blessed Islamic marriage. We combine traditional values with modern technology to help you find your perfect match.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="gradient-primary text-white">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/success-stories">
                <Button size="lg" variant="outline">
                  View Success Stories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-black/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`${playfair.className} text-4xl font-bold text-primary mb-2`}>
                  {stat.number}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`${playfair.className} text-3xl font-bold mb-4`}>Our Mission</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-muted-foreground">
                At Nikah Sufiyana, we are dedicated to helping Muslim singles find their perfect life partner
                in accordance with Islamic principles and values. Our platform combines traditional matchmaking
                values with modern technology to create meaningful connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`${playfair.className} text-3xl font-bold mb-4`}>Our Core Values</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-6 gradient-primary rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`${playfair.className} text-xl font-semibold mb-4`}>{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`${playfair.className} text-3xl font-bold mb-4`}>Why Choose Us</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mb-6 gradient-primary rounded-full flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`${playfair.className} text-lg font-semibold mb-2`}>{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-950 dark:to-rose-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`${playfair.className} text-3xl font-bold mb-4`}>Meet Our Team</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-lg">
                <div className="aspect-square relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className={`${playfair.className} text-xl font-semibold mb-1`}>{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-lg">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/islamic-pattern-light.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold mb-6`}>
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of Muslims who have found their soulmate through Nikah Sufiyana
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="font-medium">
                  Create Your Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white hover:text-primary">
                  View Premium Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
