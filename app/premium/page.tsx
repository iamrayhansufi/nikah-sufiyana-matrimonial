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
  Phone,
  Mail,
  Highlighter,
  Award,
  Verified,
  Crown,
  Sparkles,
  Target,
  Headphones,
  FileText,
  UserPlus,
  MapPin,
  HeartHandshake,
  PartyPopper,
  Diamond,
  Zap,
  PhoneCall
} from "lucide-react"
import Link from "next/link"
import { elMessiri } from "../lib/fonts"
import { motion } from "framer-motion"

export default function PremiumPage() {  const coreFeatures = [
    {
      title: "Priority Profile Visibility",
      description: "Your profile appears at the top of search results for maximum exposure",
      icon: Star,
      gradient: "from-red-500 to-rose-500"
    },
    {
      icon: Eye,
      title: "See Who Viewed You",
      description: "Discover which members viewed your profile and showed interest",
      gradient: "from-red-600 to-rose-600"
    },
    {
      icon: Search,
      title: "Advanced Search Filters",
      description: "Find your perfect match with detailed criteria including profession, education, family background",
      gradient: "from-rose-500 to-red-500"
    },
    {
      icon: MessageSquare,
      title: "Priority Communication",
      description: "Your messages appear at the top of recipients' inboxes for faster responses",
      gradient: "from-red-500 to-rose-500"
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
      gradient: "from-red-600 to-rose-600"    }
  ]
    const premiumPlans = [    {
      name: "Spark Connection",
      price: 999,
      duration: "per month",
      description: "Perfect for new seekers starting their matrimonial journey",
      features: [
        { text: "Unlimited profile views", icon: Eye },
        { text: "See who viewed your profile", icon: Users },
        { text: "Advanced search filters", icon: Search },
        { text: "Priority in search results", icon: Star },
        { text: "Contact information access", icon: Lock },
        { text: "WhatsApp profile sharing", icon: Phone },
        { text: "Email & phone support", icon: Mail },
        { text: "Profile highlighting", icon: Highlighter }
      ],
      svgPath: "/Spark-Connection.svg",
      popular: false
    },
    {
      name: "Blissful Bond",
      price: 1499,
      duration: "per month", 
      description: "Enhanced matchmaking with dedicated advisor support",
      features: [
        { text: "All Spark Connection features", icon: CheckCircle },
        { text: "Dedicated relationship advisor", icon: UserCheck },
        { text: "Priority profile verification", icon: Verified },
        { text: "Featured profile placement", icon: Award },
        { text: "Video call facility", icon: Video },
        { text: "Personalized match recommendations", icon: Target },
        { text: "24/7 priority support", icon: Headphones },
        { text: "Success guarantee program", icon: Shield }
      ],
      svgPath: "/Standard-Plan.svg",
      popular: true
    },
    {
      name: "Eternal Harmony",
      price: 2499,
      duration: "per month",
      description: "Complete solution with personal manager and family coordination",
      features: [
        { text: "All Blissful Bond features", icon: CheckCircle },
        { text: "Personal relationship manager", icon: UserPlus },
        { text: "In-person meeting coordination", icon: MapPin },
        { text: "Background verification assistance", icon: FileText },
        { text: "Family meeting facilitation", icon: HeartHandshake },
        { text: "Wedding planning consultation", icon: Calendar },
        { text: "Exclusive member events", icon: PartyPopper },
        { text: "Customized search priority", icon: Zap }
      ],
      svgPath: "/Premium-Plan.svg",
      popular: false
    },
    {
      name: "Nikah Sufiyana Elite",
      price: 3999,
      duration: "per month",
      description: "Luxury service with exclusive network and VIP treatment",
      features: [
        { text: "All Eternal Harmony features", icon: CheckCircle },
        { text: "Exclusive elite member network", icon: Crown },
        { text: "Personalized matchmaking events", icon: Sparkles },
        { text: "Private consultation sessions", icon: PhoneCall },
        { text: "Premium family verification", icon: Diamond },
        { text: "Luxury meeting arrangements", icon: Gift },
        { text: "Dedicated success coordinator", icon: Award },
        { text: "VIP customer support", icon: Crown }
      ],
      svgPath: "/Elite-Plan.svg",
      popular: false
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
    <div className="min-h-screen bg-cream-bg dark:from-gray-950 dark:to-gray-900">
      <Header />      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-rose-600/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 px-6 py-2 text-lg">
            ✨ Premium Matrimonial Features
          </Badge>
          <h1 className={`${elMessiri.className} text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-6`}>
            Find Your Perfect Match Faster
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Join thousands of successful couples who found their soulmates through our premium features. Enhanced visibility, verified profiles, and personalized matchmaking support.
          </p>
            {/* Success Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-red-500 to-rose-500 mb-3">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>{/* Premium Plans */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
              Premium Matrimonial Plans
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the perfect plan for your matrimonial journey - designed to help you find your soulmate - All below plans are valid upto 3 Months are
            </p>
          </div>          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {premiumPlans.map((plan, index) => (
              <div key={index} className="relative group flex flex-col">
                {/* SVG Background with content inside */}
                <div className="relative">
                  <div className="relative w-full h-80 mb-6">
                    <Image
                      src={plan.svgPath}
                      alt={`${plan.name} plan`}
                      fill
                      className="object-contain"
                    />                    {/* Content overlay inside SVG */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">                      <h3 className={`${elMessiri.className} text-3xl font-bold mb-3 ${
                        plan.name === "Nikah Sufiyana Elite" 
                          ? "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent" 
                          : "text-red-600"
                      }`}>
                        {plan.name === "Nikah Sufiyana Elite" ? (
                          <>
                            <span className="block md:inline">Nikah Sufiyana</span>
                            <span className="block md:inline md:ml-2">Elite</span>
                          </>
                        ) : (
                          plan.name
                        )}
                      </h3><p className={`text-sm mb-4 max-w-[200px] font-medium ${
                        plan.name === "Nikah Sufiyana Elite"
                          ? "text-white"
                          : "text-gray-800"
                      }`}>
                        {plan.description}
                      </p><div className={`text-5xl font-bold mb-1 ${
                        plan.name === "Nikah Sufiyana Elite" 
                          ? "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent" 
                          : "text-red-600"
                      }`}>
                        ₹{plan.price}
                      </div>
                    </div>
                  </div>
                </div>                {/* Features list below SVG with no background */}
                <div className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 md:text-left text-center">
                      <div className={`p-1.5 rounded-full ${
                        plan.name === "Nikah Sufiyana Elite" 
                          ? "bg-gradient-to-r from-amber-400 to-yellow-500" 
                          : "bg-gradient-to-r from-red-500 to-rose-500"
                      }`}>
                        <feature.icon className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Golden gradient border line */}
                <div className="h-[2px] bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 mb-4 rounded-full"></div>

                {/* Button aligned to bottom */}
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600' : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'} text-white border-2 border-amber-400 hover:border-amber-500 transition-all duration-300 mt-auto`} 
                  size="lg"
                >
                  Choose {plan.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* Core Features */}
      <section className="py-20 px-4 bg-cream-soft dark:from-gray-800 dark:to-gray-700">
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
      </section>      {/* Success Stories */}
      <section className="py-20 px-4 bg-cream-soft dark:from-gray-800 dark:to-gray-700">
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
                      <Star key={i} className="h-5 w-5 text-red-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                    "{story.text}"
                  </p>
                  <div className="border-t pt-4">
                    <div className={`${elMessiri.className} font-bold text-gray-800 dark:text-gray-200`}>
                      {story.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{story.location}</div>                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-red-600 dark:text-red-400">
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
      </section>      {/* Money Back Guarantee */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">          <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-700">
            <CardContent className="p-12">
              <Shield className="h-16 w-16 mx-auto text-red-600 mb-6" />
              <h3 className={`${elMessiri.className} text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
                Success Guarantee
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                If you don't find meaningful connections within 6 months of your premium membership, we'll extend your membership for 3 months at no additional cost.
              </p>
              <div className="flex items-center justify-center gap-4 text-red-600 dark:text-red-400">
                <CheckCircle className="h-6 w-6" />
                <span className="font-semibold">100% Satisfaction Guaranteed</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-rose-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className={`${elMessiri.className} text-4xl font-bold mb-6`}>
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-red-100 mb-8 leading-relaxed">
            Join thousands of successful couples who found their soulmates through our premium matrimonial platform. Start your journey today with enhanced features and personalized support.
          </p>          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100 border-0 px-8 py-4 text-lg font-semibold">
              Upgrade to Premium
              <Star className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-red-600 hover:bg-gray-100 hover:text-red-600 px-8 py-4 text-lg">
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