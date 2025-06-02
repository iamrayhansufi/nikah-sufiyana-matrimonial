"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Camera,
  FileText,
  Calendar,
  Utensils,
  Music,
  Car,
  Flower,
  Gift,
  Star,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  Heart,
  Shield,
  Users,
} from "lucide-react"
import Link from "next/link"
import { playfair } from "../lib/fonts"

export default function ServicesPage() {
  const services = [
    {
      icon: Camera,
      title: "Wedding Photography",
      description: "Professional wedding photography and videography services",
      features: [
        "Pre-wedding photoshoot",
        "Wedding day coverage",
        "Reception photography",
        "Drone photography",
        "Photo editing & albums",
        "Digital gallery",
      ],
      pricing: "₹25,000 - ₹75,000",
      popular: true,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: FileText,
      title: "Wedding Invitations",
      description: "Custom Islamic wedding invitation designs and printing",
      features: [
        "Islamic calligraphy designs",
        "Custom illustrations",
        "Digital invitations",
        "Print invitations",
        "RSVP management",
        "Multiple language support",
      ],
      pricing: "₹5,000 - ₹15,000",
      popular: false,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: Calendar,
      title: "Event Planning",
      description: "Complete wedding and nikah ceremony planning services",
      features: [
        "Venue selection",
        "Vendor coordination",
        "Timeline management",
        "Decoration planning",
        "Guest management",
        "Day-of coordination",
      ],
      pricing: "₹50,000 - ₹2,00,000",
      popular: true,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: Utensils,
      title: "Catering Services",
      description: "Halal catering for wedding events and ceremonies",
      features: [
        "100% Halal certified",
        "Traditional cuisines",
        "Live cooking stations",
        "Dessert counters",
        "Service staff included",
        "Custom menu planning",
      ],
      pricing: "₹500 - ₹1,500 per person",
      popular: false,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: Music,
      title: "Entertainment",
      description: "Islamic entertainment and music for wedding celebrations",
      features: [
        "Qawwali performances",
        "Nasheed artists",
        "Traditional music",
        "Sound system setup",
        "MC services",
        "Cultural performances",
      ],
      pricing: "₹15,000 - ₹50,000",
      popular: false,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: Car,
      title: "Transportation",
      description: "Wedding transportation and logistics services",
      features: [
        "Bridal car decoration",
        "Guest transportation",
        "Airport transfers",
        "Luxury vehicle options",
        "Professional drivers",
        "Route planning",
      ],
      pricing: "₹10,000 - ₹30,000",
      popular: false,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: Flower,
      title: "Decoration",
      description: "Beautiful Islamic-themed wedding decorations",
      features: [
        "Venue decoration",
        "Floral arrangements",
        "Stage setup",
        "Lighting design",
        "Islamic motifs",
        "Color coordination",
      ],
      pricing: "₹20,000 - ₹1,00,000",
      popular: false,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: Gift,
      title: "Wedding Favors",
      description: "Customized wedding favors and gift items",
      features: [
        "Islamic-themed gifts",
        "Personalized items",
        "Packaging design",
        "Bulk ordering",
        "Quality assurance",
        "Timely delivery",
      ],
      pricing: "₹100 - ₹500 per piece",
      popular: false,
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const packages = [
    {
      name: "Basic Wedding Package",
      price: "₹1,50,000",
      description: "Essential services for a beautiful Islamic wedding",
      services: [
        "Wedding Photography (Basic)",
        "Digital Invitations",
        "Basic Decoration",
        "Catering for 100 guests",
        "Basic Sound System",
      ],
      popular: false,
    },
    {
      name: "Premium Wedding Package",
      price: "₹3,50,000",
      description: "Comprehensive wedding services with premium features",
      services: [
        "Professional Photography & Videography",
        "Custom Print Invitations",
        "Premium Decoration",
        "Catering for 200 guests",
        "Entertainment & Music",
        "Transportation",
        "Wedding Coordination",
      ],
      popular: true,
    },
    {
      name: "Luxury Wedding Package",
      price: "₹7,50,000",
      description: "Ultimate luxury wedding experience",
      services: [
        "Cinematic Photography & Videography",
        "Designer Invitations",
        "Luxury Decoration & Lighting",
        "Premium Catering for 300 guests",
        "Live Entertainment",
        "Luxury Transportation",
        "Full Event Management",
        "Wedding Favors",
        "Honeymoon Planning",
      ],
      popular: false,
    },
  ]

  const testimonials = [
    {
      name: "Ahmed & Fatima",
      service: "Complete Wedding Package",
      text: "Alhamdulillah! The team made our wedding day absolutely perfect. Every detail was handled with care and Islamic values were respected throughout.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Omar & Aisha",
      service: "Photography & Catering",
      text: "The photography was stunning and the halal catering was delicious. Our guests are still talking about the food!",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Hassan & Zainab",
      service: "Event Planning",
      text: "Professional service from start to finish. They understood our vision and made it a reality while staying within our budget.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className={`${playfair.className} text-4xl font-bold text-center mb-8`}>Our Services</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Premium Matchmaking */}
            <Card>
              <CardContent className="p-6">
                <Star className="h-10 w-10 text-yellow-500 mb-4" />
                <h2 className={`${playfair.className} text-2xl font-semibold mb-4`}>Premium Matchmaking</h2>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Dedicated relationship manager</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Priority profile visibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Personalized match recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Background verification</span>
                  </li>
                </ul>
                <Link href="/premium">
                  <Button className="w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Privacy Protection */}
            <Card>
              <CardContent className="p-6">
                <Shield className="h-10 w-10 text-blue-500 mb-4" />
                <h2 className={`${playfair.className} text-2xl font-semibold mb-4`}>Privacy Protection</h2>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Photo privacy controls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Contact information protection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Profile visibility settings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Secure messaging system</span>
                  </li>
                </ul>
                <Link href="/privacy-features">
                  <Button variant="outline" className="w-full">View Features</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Community Events */}
            <Card>
              <CardContent className="p-6">
                <Users className="h-10 w-10 text-purple-500 mb-4" />
                <h2 className={`${playfair.className} text-2xl font-semibold mb-4`}>Community Events</h2>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Matrimonial meetups</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Islamic seminars</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Family counseling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Community networking</span>
                  </li>
                </ul>
                <Link href="/events">
                  <Button variant="outline" className="w-full">View Events</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Wedding Services */}
            <Card>
              <CardContent className="p-6">
                <Gift className="h-10 w-10 text-pink-500 mb-4" />
                <h2 className={`${playfair.className} text-2xl font-semibold mb-4`}>Wedding Services</h2>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Nikah ceremony planning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Venue recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Vendor connections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Wedding consultation</span>
                  </li>
                </ul>
                <Link href="/wedding-services">
                  <Button variant="outline" className="w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <h2 className={`${playfair.className} text-2xl font-semibold mb-4`}>Ready to Begin Your Journey?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of Muslims who have found their perfect match through our platform
            </p>
            <Link href="/register">
              <Button size="lg" className="px-8">
                Create Your Profile
                <Heart className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
