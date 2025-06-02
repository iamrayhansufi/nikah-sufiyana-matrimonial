"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Check,
  Star,
  Crown,
  Heart,
  Shield,
  Search,
  MessageSquare,
  Eye,
  Users,
  Video,
  Calendar,
  Lock,
  UserCheck,
  Gift,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { playfair } from "../lib/fonts"

export default function PremiumPage() {
  const features = [
    {
      icon: UserCheck,
      title: "Verified Profiles Only",
      description: "Connect with 100% manually verified profiles to ensure safety and authenticity",
    },
    {
      icon: Eye,
      title: "See Who Viewed You",
      description: "Discover which members viewed your profile and showed interest",
    },
    {
      icon: Search,
      title: "Advanced Search Filters",
      description: "Find your perfect match with detailed search criteria and preferences",
    },
    {
      icon: MessageSquare,
      title: "Priority Communication",
      description: "Your messages appear at the top of your matches' inbox for faster responses",
    },
    {
      icon: Lock,
      title: "Contact Information Access",
      description: "View phone numbers and direct contact details of members you connect with",
    },
    {
      icon: Shield,
      title: "Success Guarantee",
      description: "If you don't find a match within 6 months, get 3 months free membership",
    },
  ]

  const premiumPlans = [
    {
      name: "Premium",
      price: 999,
      features: [
        "Unlimited profile views",
        "Unlimited interests",
        "See who viewed your profile",
        "Advanced search filters",
        "Contact information access",
        "Profile highlighting",
        "WhatsApp profile sharing",
        "Priority customer support",
      ],
      popular: true,
    },
    {
      name: "Premium Plus",
      price: 1499,
      features: [
        "All Premium features",
        "Relationship manager",
        "Profile verification priority",
        "Featured profile placement",
        "Video call feature",
        "Personalized matchmaking",
        "24/7 priority support",
      ],
      popular: false,
    },
    {
      name: "VIP",
      price: 2499,
      features: [
        "All Premium Plus features",
        "Dedicated relationship manager",
        "In-person meeting arrangements",
        "Background verification",
        "Family meetings assistance",
        "Wedding planning consultation",
        "Customized search priority",
      ],
      popular: false,
    },
  ]

  const testimonials = [
    {
      name: "Ahmed & Fatima",
      location: "Mumbai",
      text: "Upgrading to Premium was the best decision we made. We found each other within a month and are now happily married!",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Zainab & Omar",
      location: "Delhi",
      text: "The Premium features helped us find each other based on our specific preferences. Our relationship manager was extremely helpful.",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Yusuf & Aisha",
      location: "Bangalore",
      text: "The video call feature helped us connect despite living in different cities. Worth every rupee!",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              ✨ Upgrade Your Matrimonial Experience
            </Badge>
            <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold mb-4`}>
              Unlock Premium Features to Find Your <span className="text-primary">Perfect Match</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of successful couples who found their life partners with our premium features
            </p>
          </div>

          {/* Premium Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card>
              <CardContent className="p-6">
                <Star className="h-10 w-10 text-yellow-500 mb-4" />
                <h2 className={`${playfair.className} text-xl font-semibold mb-2`}>Priority Visibility</h2>
                <p className="text-muted-foreground">
                  Your profile gets featured at the top of search results
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Shield className="h-10 w-10 text-blue-500 mb-4" />
                <h2 className={`${playfair.className} text-xl font-semibold mb-2`}>Advanced Privacy</h2>
                <p className="text-muted-foreground">
                  Control who can view your photos and contact details
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Users className="h-10 w-10 text-purple-500 mb-4" />
                <h2 className={`${playfair.className} text-xl font-semibold mb-2`}>Unlimited Interests</h2>
                <p className="text-muted-foreground">
                  Send unlimited interests to potential matches
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Gift className="h-10 w-10 text-pink-500 mb-4" />
                <h2 className={`${playfair.className} text-xl font-semibold mb-2`}>Special Benefits</h2>
                <p className="text-muted-foreground">
                  Get access to exclusive events and matchmaking services
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Premium Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {premiumPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? "border-primary shadow-lg md:scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="mb-4">
                    {plan.name === "VIP" ? (
                      <Crown className="h-12 w-12 mx-auto text-yellow-500" />
                    ) : plan.name === "Premium Plus" ? (
                      <Star className="h-12 w-12 mx-auto text-orange-500" />
                    ) : (
                      <Heart className="h-12 w-12 mx-auto text-primary" />
                    )}
                  </div>
                  <CardTitle className={`${playfair.className} text-2xl`}>{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-primary mb-2">
                    ₹{plan.price}
                  </div>
                  <p className="text-muted-foreground">per month</p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" size="lg">
                    Choose {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Testimonials */}
          <div className="text-center mb-16">
            <h2 className={`${playfair.className} text-3xl font-bold mb-8`}>Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="rounded-full"
                        width={60}
                        height={60}
                      />
                    </div>
                    <p className="text-muted-foreground mb-4">{testimonial.text}</p>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className={`${playfair.className} text-3xl font-bold mb-4`}>
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Choose your premium plan and start your journey to finding true love
            </p>
            <Button size="lg" className="px-8">
              View All Premium Features
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}