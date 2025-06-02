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
} from "lucide-react"
import { playfair } from "../lib/fonts"

export default function WeddingServicesPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className={`${playfair.className} text-4xl font-bold text-center mb-4`}>Wedding Services</h1>
          <p className="text-center text-muted-foreground mb-12">
            Make your special day memorable with our comprehensive wedding services that respect Islamic values
          </p>

          {/* Individual Services */}
          <h2 className={`${playfair.className} text-3xl font-semibold mb-8`}>Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <service.icon className="h-10 w-10 text-primary" />
                    {service.popular && (
                      <Badge variant="secondary">Popular</Badge>
                    )}
                  </div>
                  <h3 className={`${playfair.className} text-2xl font-semibold mb-2`}>{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-lg font-semibold text-primary mb-4">{service.pricing}</div>
                  <Button className="w-full">Get Quote</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Wedding Packages */}
          <h2 className={`${playfair.className} text-3xl font-semibold mb-8`}>Wedding Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg, index) => (
              <Card key={index} className={`card-hover ${pkg.popular ? 'border-primary' : ''}`}>
                <CardContent className="p-6">
                  {pkg.popular && (
                    <Badge className="mb-4" variant="secondary">Most Popular</Badge>
                  )}
                  <h3 className={`${playfair.className} text-2xl font-semibold mb-2`}>{pkg.name}</h3>
                  <div className="text-3xl font-bold text-primary mb-4">{pkg.price}</div>
                  <p className="text-muted-foreground mb-6">{pkg.description}</p>
                  <ul className="space-y-2 mb-8">
                    {pkg.services.map((service, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                    Choose Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Section */}
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <h2 className={`${playfair.className} text-2xl font-semibold mb-4`}>Need Help Planning Your Wedding?</h2>
              <p className="text-muted-foreground mb-6">
                Our wedding specialists are here to help you plan your perfect Islamic wedding
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <Button className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Sales
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
} 