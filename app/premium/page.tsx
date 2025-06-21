"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import {
  Check,
  Star,
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
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { elMessiri } from "../lib/fonts"
import { motion } from "framer-motion"

export default function PremiumPage() {
  const coreFeatures = [
    {
      title: "Priority Profile Visibility",
      description: "Your profile appears at the top of search results for maximum exposure",
      icon: Star,
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: Eye,
      title: "See Who Viewed You",
      description: "Discover which members viewed your profile and showed interest",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: Search,
      title: "Advanced Search Filters",
      description: "Find your perfect match with detailed criteria including profession, education, family background",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: MessageSquare,
      title: "Priority Communication",
      description: "Your messages appear at the top of recipients' inboxes for faster responses",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Lock,
      title: "Contact Information Access",
      description: "View phone numbers and contact details of verified members you connect with",
      gradient: "from-rose-500 to-red-500"
    },
    {
      icon: UserCheck,
      title: "Verification Priority",
      description: "Fast-track verification process for your profile and documents",
      gradient: "from-cyan-500 to-blue-500"
    }
  ]

  const premiumPlans = [
    {
      name: "Premium",
      price: 999,
      duration: "per month",
      description: "Perfect for serious seekers",
      features: [
        "Unlimited profile views",
        "See who viewed your profile",
        "Advanced search filters",
        "Priority in search results",
        "Contact information access",
        "WhatsApp profile sharing",
        "Email & phone support",
        "Profile highlighting"
      ],
      popular: false,
      icon: Heart,
      color: "emerald"
    },
    {
      name: "Premium Plus",
      price: 1499,
      duration: "per month", 
      description: "Enhanced matchmaking experience",
      features: [
        "All Premium features",
        "Dedicated relationship advisor",
        "Priority profile verification",
        "Featured profile placement",
        "Video call facility",
        "Personalized match recommendations",
        "24/7 priority support",
        "Success guarantee program"
      ],
      popular: true,
      icon: Star,
      color: "amber"
    },
    {
      name: "Premium VIP",
      price: 2499,
      duration: "per month",
      description: "Complete matrimonial solution",
      features: [
        "All Premium Plus features",
        "Personal relationship manager",
        "In-person meeting coordination",
        "Background verification assistance",
        "Family meeting facilitation",
        "Wedding planning consultation",
        "Exclusive member events",
        "Customized search priority"
      ],
      popular: false,
      icon: Gift,
      color: "purple"
    }
  ]

  const successStories = [
    {
      name: "Ahmed & Fatima",
      location: "Hyderabad",
      text: "Alhamdulillah! Premium features helped us connect instantly. The relationship advisor guided us through every step, and we found our perfect match within 2 months.",
      months: "Found match in 2 months",
      plan: "Premium Plus"
    },
    {
      name: "Zainab & Omar",
      location: "Mumbai",
      text: "The advanced search filters and priority visibility made all the difference. We connected based on our shared values and family backgrounds.",
      months: "Found match in 3 months", 
      plan: "Premium"
    },
    {
      name: "Yusuf & Aisha",
      location: "Delhi",
      text: "The personal relationship manager was incredible! They coordinated our family meetings and helped us navigate the entire process with Islamic guidance.",
      months: "Found match in 1 month",
      plan: "Premium VIP"
    }
  ]

  const benefits = [    { icon: Shield, text: "100% Verified Premium Members" },
    { icon: Heart, text: "Higher Success Rate (95%)" },
    { icon: Users, text: "Exclusive Premium Community" },
    { icon: Star, text: "Personalized Matchmaking Support" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-amber-600/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-emerald-500 to-amber-500 text-white border-0 px-6 py-2 text-lg">
            ✨ Premium Matrimonial Features
          </Badge>
          <h1 className={`${elMessiri.className} text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent mb-6`}>
            Find Your Perfect Match Faster
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Join thousands of successful couples who found their soulmates through our premium features. Enhanced visibility, verified profiles, and personalized matchmaking support.
          </p>
          
          {/* Success Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 mb-3">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
              Premium Features That Make a Difference
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced tools and exclusive access to help you find your perfect life partner faster
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/90">
                <CardContent className="p-8">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`${elMessiri.className} text-xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Plans */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
              Choose Your Premium Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Select the plan that best fits your matrimonial journey and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {premiumPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? "border-2 border-amber-500 shadow-2xl md:scale-105" : "border-0"} bg-white/90 dark:bg-gray-800/90 hover:shadow-xl transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-sm">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4 pt-8">
                  <div className="mb-4">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${
                      plan.color === 'emerald' ? 'from-emerald-500 to-teal-500' :
                      plan.color === 'amber' ? 'from-amber-500 to-orange-500' :
                      'from-purple-500 to-pink-500'
                    }`}>
                      <plan.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className={`${elMessiri.className} text-2xl font-bold text-gray-800 dark:text-gray-200`}>
                    {plan.name}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent mb-2">
                    ₹{plan.price}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">{plan.duration}</p>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : ''}`} size="lg">
                    Choose {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
              Premium Success Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real couples who found their perfect matches through our premium features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-0 bg-white/90 dark:bg-gray-800/90">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                    "{story.text}"
                  </p>
                  <div className="border-t pt-4">
                    <div className={`${elMessiri.className} font-bold text-gray-800 dark:text-gray-200`}>
                      {story.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{story.location}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-emerald-600 dark:text-emerald-400">
                        {story.months}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {story.plan}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700">
            <CardContent className="p-12">
              <Shield className="h-16 w-16 mx-auto text-emerald-600 mb-6" />
              <h3 className={`${elMessiri.className} text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
                Success Guarantee
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                If you don't find meaningful connections within 6 months of your premium membership, we'll extend your membership for 3 months at no additional cost.
              </p>
              <div className="flex items-center justify-center gap-4 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-6 w-6" />
                <span className="font-semibold">100% Satisfaction Guaranteed</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-amber-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className={`${elMessiri.className} text-4xl font-bold mb-6`}>
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Join thousands of successful couples who found their soulmates through our premium matrimonial platform. Start your journey today with enhanced features and personalized support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Upgrade to Premium
              <Star className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg">
              View All Features
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}