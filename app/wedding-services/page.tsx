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
  Phone,
  Mail,
  Heart,
  Users,
  MapPin,
  Clock,
  Award,
  Sparkles,
  ArrowRight
} from "lucide-react"
import { elMessiri } from "../lib/fonts"
import Link from "next/link"

export default function WeddingServicesPage() {
  const weddingServices = [
    {
      icon: Calendar,
      title: "Nikah Ceremony Planning",
      description: "Complete Islamic nikah ceremony planning with religious guidance and cultural respect",
      features: [
        "Islamic ceremony coordination",
        "Imam & religious guidance",
        "Venue arrangement",
        "Guest management",
        "Traditional customs guidance",
        "Timeline management"
      ],
      pricing: "₹25,000 - ₹75,000",
      popular: true,
      gradient: "from-red-500 to-rose-600"
    },
    {
      icon: Camera,
      title: "Wedding Photography",
      description: "Professional Islamic wedding photography respecting cultural and religious sensitivities",
      features: [
        "Pre-wedding photoshoot",
        "Nikah ceremony coverage",
        "Reception photography",
        "Family portraits",
        "Digital gallery & albums",
        "Video highlights"
      ],
      pricing: "₹30,000 - ₹1,00,000",
      popular: true,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: FileText,
      title: "Wedding Invitations",
      description: "Beautiful Islamic wedding invitation designs with calligraphy and traditional motifs",
      features: [
        "Islamic calligraphy designs",
        "Bilingual invitations (Urdu/Hindi)",
        "Digital & print options",
        "RSVP management",
        "Custom illustrations",
        "Premium paper options"
      ],
      pricing: "₹8,000 - ₹25,000",
      popular: false,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Utensils,
      title: "Halal Catering",
      description: "Authentic halal catering with traditional Indian Muslim cuisine and modern options",
      features: [
        "100% Halal certified",
        "Hyderabadi specialties",
        "Live cooking stations",
        "Traditional desserts",
        "Professional service staff",
        "Custom menu planning"
      ],
      pricing: "₹800 - ₹2,000 per person",
      popular: true,
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: Flower,
      title: "Islamic Decoration",
      description: "Elegant Islamic-themed decorations with cultural motifs and beautiful floral arrangements",
      features: [
        "Islamic geometric patterns",
        "Fresh flower arrangements",
        "Stage & mandap setup",
        "Lighting design",
        "Cultural motifs",
        "Color coordination"
      ],
      pricing: "₹35,000 - ₹1,50,000",
      popular: false,
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: Music,
      title: "Islamic Entertainment",
      description: "Cultural entertainment including Qawwali, Nasheed, and traditional Islamic music",
      features: [
        "Qawwali performances",
        "Nasheed artists",
        "Traditional music",
        "Sound system setup",
        "Cultural programs",
        "MC services"
      ],
      pricing: "₹20,000 - ₹75,000",
      popular: false,
      gradient: "from-cyan-500 to-blue-600"
    }
  ]

  const weddingPackages = [
    {
      name: "Simple Nikah Package",
      price: "₹1,25,000",
      originalPrice: "₹1,50,000",
      description: "Perfect for intimate Islamic ceremonies",
      services: [
        "Basic nikah ceremony planning",
        "Simple photography (4 hours)",
        "Digital invitations",
        "Basic decoration",
        "Halal catering for 75 guests",
        "Sound system"
      ],
      popular: false,
      icon: Heart,
      guests: "Up to 75 guests"
    },
    {
      name: "Traditional Wedding Package",
      price: "₹2,75,000",
      originalPrice: "₹3,25,000",
      description: "Complete Islamic wedding experience",
      services: [
        "Full nikah ceremony planning",
        "Professional photography & videography",
        "Custom print invitations",
        "Premium decoration",
        "Halal catering for 150 guests",
        "Qawwali/Nasheed entertainment",
        "Transportation coordination"
      ],
      popular: true,
      icon: Star,
      guests: "Up to 150 guests"
    },
    {
      name: "Grand Wedding Package",
      price: "₹5,50,000",
      originalPrice: "₹6,50,000",
      description: "Luxury Islamic wedding celebration",
      services: [
        "Complete wedding planning",
        "Cinematic photography & videography",
        "Designer invitations",
        "Luxury decoration & lighting",
        "Premium halal catering for 250 guests",
        "Live entertainment & cultural programs",
        "Luxury transportation",
        "Bridal makeup & styling",
        "Wedding coordination team"
      ],
      popular: false,
      icon: Gift,
      guests: "Up to 250 guests"
    }
  ]

  const whyChooseUs = [
    {
      icon: Award,
      title: "Islamic Values First",
      description: "All our services respect Islamic traditions and cultural sensitivities"
    },
    {
      icon: Users,
      title: "Experienced Team",
      description: "Specialized team with 10+ years experience in Muslim weddings"
    },
    {
      icon: MapPin,
      title: "Hyderabad Specialists",
      description: "Deep understanding of local traditions and vendor networks"
    },
    {
      icon: Clock,
      title: "On-Time Delivery",
      description: "Reliable service with guaranteed timelines for your special day"
    }
  ]

  const testimonials = [
    {
      name: "Ahmed & Fatima",
      location: "Hyderabad",
      text: "Alhamdulillah! Our nikah ceremony was beautifully organized. The team understood our religious requirements perfectly and made our day memorable.",
      service: "Traditional Wedding Package",
      rating: 5
    },
    {
      name: "Omar & Zainab",
      location: "Mumbai", 
      text: "The halal catering was exceptional, and the Islamic decorations were stunning. Every detail was handled with care and respect for our traditions.",
      service: "Grand Wedding Package",
      rating: 5
    },
    {
      name: "Hassan & Aisha",
      location: "Delhi",
      text: "Professional service from start to finish. The Qawwali performance was the highlight of our reception. Highly recommended!",
      service: "Traditional Wedding Package", 
      rating: 5
    }
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-rose-600/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className={`${elMessiri.className} text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-6`}>
            Islamic Wedding Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Complete wedding solutions that honor Islamic traditions and create beautiful memories for your special day. From nikah ceremonies to grand receptions, we handle every detail with care and cultural respect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-4 text-lg">
              View Our Packages
              <Heart className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              Get Free Consultation
              <Phone className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-rose-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center text-white">
                <div className="inline-flex p-3 rounded-full bg-white/20 mb-4">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className={`${elMessiri.className} text-xl font-bold mb-2`}>{item.title}</h3>
                <p className="text-red-100 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Services */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
              Our Wedding Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Professional services tailored for Islamic weddings with attention to religious and cultural details
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {weddingServices.map((service, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/90">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${service.gradient} group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    {service.popular && (
                      <Badge className="bg-red-500 text-white">Popular</Badge>
                    )}
                  </div>
                  <h3 className={`${elMessiri.className} text-xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-4">
                    {service.pricing}
                  </div>
                  <Button className="w-full">Get Quote</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Packages */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
              Wedding Packages
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive wedding packages designed to make your special day perfect and memorable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {weddingPackages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'border-2 border-red-500 shadow-2xl md:scale-105' : 'border-0'} bg-white/90 dark:bg-gray-800/90 hover:shadow-xl transition-all duration-300`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4 pt-8">
                  <div className="mb-4">
                    <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-red-500 to-rose-500">
                      <pkg.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className={`${elMessiri.className} text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2`}>
                    {pkg.name}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{pkg.description}</p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                      {pkg.price}
                    </span>
                    {pkg.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">{pkg.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400">{pkg.guests}</p>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                  <ul className="space-y-3 mb-8">
                    {pkg.services.map((service, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{service}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${pkg.popular ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600' : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'}`} size="lg">
                    Choose Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${elMessiri.className} text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
              Happy Couples
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our clients say about their wedding experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-0 bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-700">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-red-400 fill-current" />
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
                    <Badge variant="outline" className="mt-2 text-xs">
                      {testimonial.service}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-rose-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className={`${elMessiri.className} text-4xl font-bold mb-6`}>
            Ready to Plan Your Dream Wedding?
          </h2>
          <p className="text-xl text-red-100 mb-8 leading-relaxed">
            Let our experienced team help you create the perfect Islamic wedding celebration. Get in touch for a free consultation and custom quote.
          </p>          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100 border-0 px-8 py-4 text-lg font-semibold">
              <Phone className="mr-2 h-5 w-5" />
              Call Now: +91-9876543210
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg">
              <Mail className="mr-2 h-5 w-5" />
              Email Consultation
            </Button>
          </div>          <div className="mt-8 pt-8 border-t border-red-400/30">
            <p className="text-red-200">
              <strong>Also interested in finding your life partner?</strong>
            </p>
            <Link href="/register">
              <Button variant="outline" className="mt-4 border-white text-white hover:bg-white hover:text-red-600">
                Create Matrimonial Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 