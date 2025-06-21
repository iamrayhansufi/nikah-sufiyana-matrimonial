"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  Heart,
  Shield,
  Users,
  Search,
  UserCheck,
  Lock,
  HeartHandshake,
  Sparkles,
  Phone,
  Globe,
  Award,
  Clock,
  TrendingUp,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { playfair, elMessiri } from "../lib/fonts"

export default function ServicesPage() {
  const coreServices = [
    {
      icon: Search,
      title: "Smart Profile Matching",
      description: "Advanced compatibility matching based on Islamic values, education, profession, and family preferences",
      features: [
        "AI-powered compatibility scoring",
        "Islamic values alignment",
        "Educational & professional matching",
        "Family background consideration",
        "Location-based preferences",
        "Lifestyle compatibility"
      ],
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: UserCheck,
      title: "Profile Verification",
      description: "Comprehensive verification system ensuring authentic and genuine profiles for your safety",
      features: [
        "Identity document verification",
        "Educational qualification check",
        "Professional background verification",
        "Family reference validation",
        "Photo authenticity confirmation",
        "Contact information verification"
      ],
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: Lock,
      title: "Privacy & Security",
      description: "Advanced privacy controls and security measures to protect your personal information",
      features: [
        "Photo privacy settings",
        "Contact information protection",
        "Selective profile visibility",
        "Secure messaging system",
        "Block & report features",
        "Data encryption & protection"
      ],
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: HeartHandshake,
      title: "Personal Matchmaking",
      description: "Dedicated relationship managers providing personalized guidance and support",
      features: [
        "Dedicated relationship advisor",
        "Personalized match curation",
        "Profile optimization guidance",
        "Communication coaching",
        "Family meeting coordination",
        "Ongoing relationship support"
      ],
      gradient: "from-rose-500 to-red-600"
    }
  ]

  const premiumFeatures = [
    {
      icon: Sparkles,
      title: "Premium Membership Benefits",
      description: "Unlock exclusive features for enhanced matrimonial experience",
      benefits: [
        "Unlimited profile views",
        "Advanced search filters",
        "Priority customer support",
        "Enhanced profile visibility",
        "Exclusive member events",
        "Success story features"
      ]
    },
    {
      icon: Phone,
      title: "24/7 Customer Support",
      description: "Round-the-clock assistance for all your matrimonial needs",
      benefits: [
        "Multi-language support",
        "Technical assistance",
        "Profile guidance",
        "Matching support",
        "Privacy concerns",
        "General inquiries"
      ]
    },
    {
      icon: Globe,
      title: "Global Community Access",
      description: "Connect with Muslims worldwide while maintaining cultural values",
      benefits: [
        "International profiles",
        "Cultural preference filters",
        "Regional community groups",
        "Language-based matching",
        "Cross-cultural guidance",
        "Global success network"
      ]
    }
  ]

  const successStats = [
    { number: "50,000+", label: "Happy Couples", icon: Heart },
    { number: "2,00,000+", label: "Verified Profiles", icon: UserCheck },
    { number: "95%", label: "Success Rate", icon: TrendingUp },
    { number: "24/7", label: "Customer Support", icon: Clock }
  ]

  const testimonials = [
    {
      name: "Ahmed & Fatima",
      location: "Hyderabad",
      text: "Alhamdulillah! We found each other through Nikah Sufiyana. The platform's emphasis on Islamic values and family compatibility made our search meaningful and successful.",
      rating: 5,
      months: "Found match in 3 months"
    },
    {
      name: "Omar & Aisha", 
      location: "Mumbai",
      text: "The verification process gave us confidence, and the privacy features made us feel secure. Our families are delighted with the match!",
      rating: 5,
      months: "Found match in 2 months"
    },
    {
      name: "Hassan & Zainab",
      location: "Delhi",
      text: "Professional service with Islamic values at the core. The relationship advisor helped us communicate effectively and understand each other better.",
      rating: 5,
      months: "Found match in 4 months"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-amber-600/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className={`${elMessiri.className} text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent mb-6`}>
            Our Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive matrimonial services designed to help Indian Muslim families find perfect matches with Islamic values, security, and family support at the center.
          </p>
        </div>
      </section>

      {/* Success Statistics */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-amber-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {successStats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <stat.icon className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <div className={`${elMessiri.className} text-3xl md:text-4xl font-bold mb-2`}>
                  {stat.number}
                </div>
                <div className="text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
              Core Matrimonial Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive services designed to make your matrimonial journey safe, successful, and aligned with Islamic values
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreServices.map((service, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${service.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`${elMessiri.className} text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
              Additional Services & Support
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Enhanced features and comprehensive support to ensure your matrimonial success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300 border-0 bg-white/90 dark:bg-gray-800/90">
                <CardContent className="p-8">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mb-6">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`${elMessiri.className} text-xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2 text-left">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real couples who found their perfect match through our services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-0 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-gray-800 dark:to-gray-700">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t pt-4">
                    <div className={`${elMessiri.className} font-bold text-gray-800 dark:text-gray-200`}>
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.location}</div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                      {testimonial.months}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-amber-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className={`${elMessiri.className} text-4xl font-bold mb-6`}>
            Ready to Begin Your Matrimonial Journey?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Join thousands of Indian Muslim families who have found their perfect matches through our trusted platform. Start your journey with Islamic values, family support, and complete security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Create Your Profile
                <Heart className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/premium">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg">
                Explore Premium Features
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
