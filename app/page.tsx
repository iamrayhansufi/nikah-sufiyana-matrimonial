"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WhatsAppChat } from "@/components/whatsapp-chat"
import { HeroRegistrationForm } from "@/components/hero-registration-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Heart, Shield, Star, ArrowRight, ChurchIcon as Mosque, UserCheck, CheckCircle, MapPin, GraduationCap, Briefcase, MessageSquare, UserPlus, Search, HeartHandshake } from "lucide-react"
import { playfair } from "./lib/fonts"
import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [filters, setFilters] = useState({
    ageRange: [18, 60],
    ageMin: "18",
    ageMax: "60",
    height: ""
  })

  const slides = [
    {
      title: "Join India's most trusted Islamic matrimonial platform",      
      description: "Connect with verified profiles seeking halal relationships based on Islamic values and mutual respect.",
      image: "/placeholder.svg",
      badge: "✨ Trusted by 50,000+ Muslims"
    },
    {
      title: "Upcoming Event",
      subtitle: "Islamic Marriage Conference 2024",
      description: "Meet Islamic scholars, relationship experts, and successful couples. Learn about building a strong Islamic marriage.",
      image: "/events-bg.jpg",
      badge: "🎉 Register Now - Limited Seats",
      cta: "View Event Details"
    },
    {
      title: "Premium Matchmaking",
      subtitle: "Personalized Support for Your Search",
      description: "Get dedicated assistance from our marriage consultants who understand your preferences and values.",
      image: "/premium-bg.jpg",
      badge: "⭐ Special Ramadan Offer",
      cta: "Explore Premium Services"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const values = [
    {
      icon: Mosque,
      title: "Islamic Values & Traditions",
      description: "Our platform is built on the foundation of Islamic principles, ensuring your search for a life partner aligns with our beautiful faith and traditions.",
    },
    {
      icon: Shield,
      title: "Safe & Secure Matching",
      description: "Every profile undergoes thorough verification by our dedicated team, providing you a safe and trusted environment to find your perfect match.",
    },
    {
      icon: UserCheck,
      title: "Personalized Support",
      description: "Our experienced marriage consultants provide personalized guidance throughout your journey to finding your soulmate.",
    },
    {
      icon: Heart,
      title: "Success Stories",
      description: "Join thousands of happy couples who found their perfect match through Nikah Sufiyana, building beautiful families together.",
    },
  ]

  const testimonials = [
    {
      name: "Fatima & Ahmed",
      location: "Mumbai",
      text: "Alhamdulillah! We found each other through Nikah Sufiyana. The platform made it easy to connect with like-minded Muslims who share our values.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Aisha & Omar",
      location: "Delhi",
      text: "The verification process gave us confidence. We're grateful for this halal way to find our life partner. Highly recommended!",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Zainab & Hassan",
      location: "Bangalore",
      text: "Professional, respectful, and Islamic. Exactly what we were looking for in a matrimonial platform. Thank you!",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const premiumProfiles = [
    {
      id: 1,
      name: "Aisha Khan",
      age: 24,
      location: "Delhi, Delhi",
      education: "Bachelor's in Medicine",
      profession: "Doctor",
      sect: "Sunni",
      image: "/placeholder.svg?height=300&width=300",
      match: 88,
      verified: true,
      premium: true,
    },
    {
      id: 2,
      name: "Mariam Sheikh",
      age: 25,
      location: "Hyderabad, Telangana",
      education: "Bachelor's in Education",
      profession: "Teacher",
      sect: "Sunni",
      image: "/placeholder.svg?height=300&width=300",
      match: 90,
      verified: true,
      premium: true,
    },
    {
      id: 3,
      name: "Ruqaiya Siddiqui",
      age: 29,
      location: "Pune, Maharashtra",
      education: "PhD in Psychology",
      profession: "Psychologist",
      sect: "Sunni",
      image: "/placeholder.svg?height=300&width=300",
      match: 92,
      verified: true,
      premium: true,
    },
    {
      id: 4,
      name: "Sarah Ahmed",
      age: 27,
      location: "Mumbai, Maharashtra",
      education: "Master's in Business",
      profession: "Business Analyst",
      sect: "Sunni",
      image: "/placeholder.svg?height=300&width=300",
      match: 85,
      verified: true,
      premium: true,
    },
  ]

  const successStories = [
    {
      couple: "Ahmed & Fatima",
      location: "Mumbai",
      image: "/success-stories/couple1.jpg",
      story: "Alhamdulillah, we found each other through Nikah Sufiyana. The platform's Islamic values and verification process gave us confidence in our search.",
      date: "Married in 2023",
    },
    {
      couple: "Ibrahim & Aisha",
      location: "Delhi",
      image: "/success-stories/couple2.jpg",
      story: "What stood out about Nikah Sufiyana was how they maintained Islamic principles while making the search process easy and respectful.",
      date: "Married in 2023",
    },
    {
      couple: "Yusuf & Zainab",
      location: "Hyderabad",
      image: "/success-stories/couple3.jpg",
      story: "The support from Nikah Sufiyana team was incredible. They guided us through the process with understanding and care.",
      date: "Married in 2022",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />

      {/* Enhanced Hero Section with Slider */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Slider */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                currentSlide === index ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
              }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[10000ms]"
                style={{
                  backgroundImage: `url('${slide.image}')`,
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#EC1A74]/80 via-[#F1662C]/70 to-[#EC1A74]/80" />

              {/* Islamic Pattern Overlay */}
              <div className="absolute inset-0 islamic-pattern opacity-20" />
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="relative flex flex-col min-h-[500px] lg:min-h-0">
              <div className="flex-grow relative">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-1000 ease-in-out absolute inset-0 ${
                      currentSlide === index
                        ? "opacity-100 translate-x-0 pointer-events-auto"
                        : "opacity-0 translate-x-full pointer-events-none"
                    }`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="h-full flex flex-col justify-center text-white">
                      <div className="inline-flex">
                        <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-1.5">
                          {slide.badge}
                        </Badge>
                      </div>
                      <h1 className={`${playfair.className} text-4xl md:text-6xl font-bold mb-6 font-heading leading-tight`}>
                        {slide.title}{' '}
                        <span className="block bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent mt-2">
                          {slide.subtitle}
                        </span>
                      </h1>
                      <p className="text-xl mb-8 max-w-2xl text-white/90 font-body leading-relaxed">
                        {slide.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/browse">
                          <Button size="lg" variant="outline" className="px-8 btn-hover font-body font-medium bg-white text-primary hover:bg-primary hover:text-white">
                            Browse Profiles
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                        {slide.cta ? (
                          <Link href={`/${slide.cta.toLowerCase().replace(/\s+/g, '-')}`}>
                            <Button
                              size="lg"
                              variant="outline"
                              className="px-8 btn-hover font-body font-medium bg-white text-primary hover:bg-primary hover:text-white"
                            >
                              {slide.cta}
                            </Button>
                          </Link>
                        ) : (
                          <Link href="/about">
                            <Button
                              size="lg"
                              variant="outline"
                              className="px-8 btn-hover font-body font-medium bg-white text-primary hover:text-white"
                            >
                              About Us
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Registration Form */}
            <div className="lg:mt-0">
              <div>
                <HeroRegistrationForm />
              </div>
            </div>
          </div>

          {/* Slider Navigation - Repositioned to be under the left content */}
          <div className="absolute bottom-8 left-4 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/50"
                } hover:bg-white`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section with enhanced design */}
      <section className="py-20 bg-gradient-primary-light relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/islamic-pattern-light.png')] opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block">
              <Badge className="mb-6 bg-white/20 text-primary border-primary/30 backdrop-blur-sm">
                ✨ Trusted by 50,000+ Muslims Worldwide
              </Badge>
            </div>
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold mb-4 font-heading`}>Why Choose Nikah Sufiyana?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-body">
              Your journey to finding a blessed marriage partner begins here. We combine Islamic values with modern technology to help you find your perfect match.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 gradient-primary rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`${playfair.className} font-semibold mb-4 text-lg font-heading`}>{value.title}</h3>
                  <p className="text-muted-foreground font-body leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Profiles Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold mb-4 font-heading`}>Premium Profiles</h2>
            <p className="text-xl text-muted-foreground font-body">
              Connect with our verified premium members
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumProfiles.map((profile) => (
              <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-2">
                    {profile.verified && <Badge className="bg-green-500 text-white">✓ Verified</Badge>}
                    <Badge className="bg-yellow-500 text-white">⭐ Premium</Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-primary text-white">
                      {profile.match}% Match
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`${playfair.className} font-semibold text-lg`}>{profile.name}</h3>
                      <p className="text-sm text-muted-foreground">{profile.age} years old</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.education}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.profession}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Badge variant="outline">{profile.sect}</Badge>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Interest
                    </Button>
                    <Link href={`/profile/${profile.id}`}>
                      <Button variant="outline" className="flex-1">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/browse">
              <Button className="gradient-primary text-white btn-hover font-body">
                View All Profiles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-950 dark:to-rose-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/islamic-pattern-light.png')] opacity-5"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold mb-4 font-heading`}>Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              Alhamdulillah, countless couples have found their soulmates through Nikah Sufiyana
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {successStories.map((story, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={story.image}
                    alt={story.couple}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div className="text-white">
                      <h3 className={`${playfair.className} text-lg font-semibold`}>{story.couple}</h3>
                      <p className="text-sm opacity-90">{story.location}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4 italic">"{story.story}"</p>
                  <p className="text-sm text-primary font-semibold">{story.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/success-stories">
              <Button className="gradient-primary text-white btn-hover font-body">
                Read More Success Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Nikah Sufiyana with enhanced design */}
      <section className="py-20 bg-[url('/islamic-pattern-bg.png')] bg-cover bg-center bg-fixed relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/90 dark:from-black/95 dark:to-black/90"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold mb-6 font-heading`}>About Nikah Sufiyana</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 mb-8">
                <p className="text-xl text-muted-foreground font-body italic">
                  "And among His Signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts." - Ar-Rum 30:21
                </p>
              </div>
            </div>
            <div className="space-y-6 text-center max-w-3xl mx-auto">
              <p className="text-lg leading-relaxed">
                Nikah Sufiyana is more than just a matrimonial platform - we're a community dedicated to helping Muslims find their life partners in accordance with Islamic principles. Our name combines "Nikah," the sacred union in Islam, with "Sufiyana," representing the pure, spiritual approach to life and love.
              </p>
              <p className="text-lg leading-relaxed">
                Founded with the vision of making the search for a spouse both meaningful and accessible, we understand that marriage in Islam is half of one's deen. Our platform provides a safe, respectful environment where practicing Muslims can connect with potential spouses while maintaining their values and traditions.
              </p>
              <p className="text-lg leading-relaxed">
                What sets us apart is our deep commitment to Islamic values, our thorough verification process, and our understanding of the cultural nuances within the Muslim community. We're here to support you in every step of your journey towards a blessed union.
              </p>
              <div className="pt-8">
                <Link href="/about">
                  <Button className="gradient-primary text-white btn-hover font-body">
                    Learn More About Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
                <p className="text-muted-foreground">Registered Members</p>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
                <p className="text-muted-foreground">Successful Marriages</p>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <p className="text-muted-foreground">Profile Verification</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/islamic-pattern-light.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold mb-4 font-heading`}>Ready to Find Your Life Partner?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto font-body">
              Join thousands of Muslims who have found their perfect match through Nikah Sufiyana
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="px-8 btn-hover font-body font-medium">
                  Start Your Journey Today
                  <Heart className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/premium">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 border-white text-primary hover:bg-white hover:text-primary btn-hover font-body"
                >
                  View Premium Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppChat />
    </div>
  )
}
