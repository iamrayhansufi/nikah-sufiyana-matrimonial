"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WhatsAppChat } from "@/components/whatsapp-chat"
import { HeroRegistrationForm } from "@/components/hero-registration-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Heart, Shield, Star, ArrowRight, ChurchIcon as Mosque, UserCheck, CheckCircle, MapPin, GraduationCap, Briefcase, MessageSquare, UserPlus, Search, HeartHandshake, Sparkles, Users, Award, Verified, Quote, Calendar, Phone, Mail } from "lucide-react"
import { elMessiri } from "./lib/fonts"
import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { motion } from "framer-motion"

// Profile interface for type safety
interface Profile {
  id: string
  name: string
  age: number
  profession: string
  location: string
  education: string
  verified: boolean
  premium: boolean
  profilePhoto?: string
}

// Custom Nikah Sufiyana Icon Component
const NikahSufiyanaIcon = ({ className }: { className?: string }) => (
  <Image
    src="/Nikah-Sufiyana-Icon-white-01.svg"
    alt="Nikah Sufiyana Icon"
    width={24}
    height={24}
    className={className}
  />
)

// Static data arrays moved outside component to prevent re-creation
const slidesData = [
  {
    title: "Nikah Sufiyana - India's Most Trusted Muslim Matrimonial Platform",      
    description: "Connect with thousands of verified Muslim profiles across India. Find your perfect life partner through our secure and reliable Islamic matrimonial service designed for modern Muslim families.",
    image: "/placeholder.svg",
    badge: "✨ Trusted by 100,000+ Muslim Families Across India"
  },
  {
    title: "Your Perfect Match Awaits in Hyderabad",
    subtitle: "Special Focus on Hyderabad Muslim Community",
    description: "Join hundreds of successful couples from Hyderabad who found their life partners through Nikah Sufiyana. Connect with verified profiles from your city and surrounding areas with complete family support.",
    image: "/events-bg.jpg",
    badge: "🕌 Hyderabad's #1 Choice for Muslim Matrimony",
    cta: "Find Hyderabad Matches"
  },
  {
    title: "Premium Matchmaking Service",
    subtitle: "Personalized Support for Serious Marriage Seekers",
    description: "Get dedicated relationship manager support, verified profiles, and personalized matchmaking assistance. Our premium service ensures you connect with genuine, marriage-minded Muslim singles.",
    image: "/premium-bg.jpg",
    badge: "👑 Premium Matrimonial Service",      
    cta: "Explore Premium Features"
  }
]

const valuesData = [
  {
    icon: Mosque,
    title: "Islamic Values & Principles",
    description: "Built on authentic Islamic principles with complete respect for halal relationships and Islamic matrimonial traditions. Every connection is guided by Islamic values and family involvement.",
    color: "from-red-600 to-red-700"
  },
  {
    icon: Shield,
    title: "Safe & Secure Platform",      
    description: "Your privacy and security are our top priorities. Advanced verification processes and secure communication ensure your matrimonial journey remains safe and protected.",
    color: "from-red-500 to-red-600"
  },    
  {
    icon: NikahSufiyanaIcon,
    title: "Premium Matchmaking Service",
    description: "Get personalized support from our experienced relationship managers who understand Indian Muslim families. Premium features help you find the perfect match faster.",
    color: "from-red-500 to-red-600"
  },
  {
    icon: Heart,
    title: "Successful Marriages",
    description: "Join thousands of happy couples who found their life partners through Nikah Sufiyana. Our success stories speak for the quality of matches and genuine connections we facilitate.",
    color: "from-red-500 to-red-600"
  }
]

const successStoriesData = [
  {
    couple: "Ahmed & Fatima",
    location: "Hyderabad",
    image: "/success-stories/couple1.jpg",
    story: "Alhamdulillah! We found each other through Nikah Sufiyana. The platform made it easy to connect with genuine profiles from Hyderabad. Our families are very happy with the match!",
    date: "Married in 2024",
    blessing: "Blessed with their first child - Masha'Allah"
  },
  {
    couple: "Omar & Ayesha",
    location: "Secunderabad",
    image: "/success-stories/couple2.jpg",      
    story: "Alhamdulillah! Nikah Sufiyana helped us find each other with complete respect for our Islamic values. The verification process gave our families confidence, and we're very grateful!",
    date: "Married in 2023",
    blessing: "Expecting their first child - InshAllah"
  },
  {
    couple: "Yusuf & Zainab",
    location: "Old City, Hyderabad",
    image: "/success-stories/couple3.jpg",
    story: "MashaAllah! The team at Nikah Sufiyana was very supportive throughout our journey. They helped us connect with compatible families and made the process smooth and respectful.",
    date: "Married in 2022",
    blessing: "Blessed with son Muhammad Abdullah"
  },
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [premiumProfiles, setPremiumProfiles] = useState<Profile[]>([])
  const [profilesLoading, setProfilesLoading] = useState(true)
  const [filters, setFilters] = useState({
    ageRange: [18, 60],
    ageMin: "18",    
    ageMax: "60",
    height: ""
  })
  
  // Use the static data
  const slides = slidesData
  const values = valuesData
  const successStories = successStoriesData
  const premiumProfilesFallback: Profile[] = [
    {
      id: "fallback-1",
      name: "Sister Maryam A.",
      age: 26,
      profession: "Software Engineer",
      location: "Hyderabad, Telangana",
      education: "B.Tech Computer Science",
      verified: true,
      premium: true
    },
    {
      id: "fallback-2",
      name: "Brother Khalid M.",
      age: 29,
      profession: "Business Analyst",
      location: "Pune, Maharashtra",
      education: "MBA Finance",
      verified: true,
      premium: true
    },
    {
      id: "fallback-3",
      name: "Sister Aisha R.",
      age: 24,
      profession: "Doctor",
      location: "Chennai, Tamil Nadu",
      education: "MBBS",
      verified: true,
      premium: true
    }
  ]

  // Fetch real profiles from database
  useEffect(() => {
    const fetchFeaturedProfiles = async () => {
      try {
        setProfilesLoading(true)
        const response = await fetch('/api/profiles/featured?limit=3')
        const data = await response.json()
        
        if (response.ok && data.profiles && data.profiles.length > 0) {
          setPremiumProfiles(data.profiles)
        } else {
          // Use fallback profiles if no real profiles available
          setPremiumProfiles(premiumProfilesFallback)
        }
      } catch (error) {
        console.error('Error fetching featured profiles:', error)
        // Use fallback profiles on error
        setPremiumProfiles(premiumProfilesFallback)
      } finally {
        setProfilesLoading(false)
      }
    }

    fetchFeaturedProfiles()
  }, []) // Remove premiumProfilesFallback from dependencies as it's defined in the same component

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev: number) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }
  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-royal-gradient">
      <Header />      {/* Hero Section with Content Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Full Background Image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/ddneah55w/image/upload/v1750678274/WEB-SLIDE_1_pgkyfc.jpg')`
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30 lg:bg-black/20"></div>
        </div>
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10 py-12">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center min-h-[calc(100vh-6rem)]">
            {/* Left Content - Title & Description (3 columns) */}
            <motion.div 
              className="lg:col-span-3 text-center lg:text-left space-y-6 lg:space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4 lg:space-y-6">
                <Badge className="bg-white/20 text-white border-white/30 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium inline-flex items-center gap-2 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  Premium Islamic Matrimonial Service
                </Badge>
                
                <h1 className={`${elMessiri.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-2xl`}>
                  Find Your Perfect Life Partner
                </h1>
                
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-white/95 leading-relaxed max-w-2xl drop-shadow-lg">
                  Join India's most trusted Islamic matrimonial platform. Connect with verified profiles and find your soulmate with complete Islamic values and family traditions.
                </p>
              </div>
            </motion.div>

            {/* Right Content - Registration Form (2 columns) */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <HeroRegistrationForm />
            </motion.div>
          </div>
        </div>
      </section>      {/* Sacred Values Section */}
      <section className="section-spacing relative">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-12 lg:mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-3xl md:text-4xl lg:text-5xl font-bold text-royal-primary mb-4 lg:mb-6`}>
              Why Choose Nikah Sufiyana?
            </h2>
            <div className="flex justify-center mb-4 lg:mb-6">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={300}
                height={12}
                className="opacity-60"
              />
            </div>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              India's most trusted Islamic matrimonial platform, dedicated to helping Muslim families find the perfect life partners with complete Islamic values and modern convenience.
            </p>
          </motion.div>          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >            {values.map((value, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm relative">
                  {/* SVG Borders - for all cards */}
                  <>
                    {/* Bottom Left Border */}
                    <div className="absolute bottom-0 left-0 w-10 h-20 opacity-70">
                      <Image
                        src="/bottom-left-border.svg"
                        alt="Bottom Left Border"
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    {/* Top Right Border */}
                    <div className="absolute top-0 right-0 w-10 h-20 opacity-70">
                      <Image
                        src="/top-right-border.svg"
                        alt="Top Right Border"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </>
                  
                  <CardContent className="p-8 text-center relative">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className={`${elMessiri.className} text-xl font-bold text-gray-800 mb-4`}>
                      {value.title}
                    </h3>                    {/* Text Bottom Border - for all cards */}
                    <div className="flex justify-center mb-4">
                      <Image
                        src="/text-bottom-border.svg"
                        alt="Text Bottom Border"
                        width={130}
                        height={13}
                        className="opacity-60"
                      />
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>        </div>
      </section>      {/* Brand Story Section - The Sufiyana Legacy */}
      <section className="section-spacing bg-gradient-to-br from-cream-light/30 to-cream-dark/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/islamic-pattern-light.png')] opacity-5"></div>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 relative">
          <motion.div 
            className="max-w-6xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <h2 className={`${elMessiri.className} text-3xl md:text-4xl lg:text-5xl font-bold text-royal-primary mb-4 lg:mb-6`}>
                About Nikah Sufiyana
              </h2>
              <div className="flex justify-center mb-6 lg:mb-8">
                <Image
                  src="/sufiyana-border-ui.svg"
                  alt="Decorative Border"
                  width={300}
                  height={12}
                  className="opacity-60"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  <Image
                    src="/Nikah-Sufiyana-box-with-border-01.svg"
                    alt="Decorative Box Border"
                    width={500}
                    height={300}
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                  <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
                    <h3 className={`${elMessiri.className} text-3xl font-bold text-royal-primary mb-6`}>
                      روحانی شادی - The Spiritual Union
                    </h3>
                    <div className="space-y-6 text-gray-700 leading-relaxed">                      <p className="text-lg">
                        <strong>Nikah Sufiyana</strong> represents the beautiful harmony between spiritual devotion and matrimonial bliss. Our platform celebrates the Sufiyana bond of marriage as a divine blessing that brings two hearts together in eternal companionship and shared faith.
                      </p>                      <p className="text-lg">
                        We believe that every marriage is a sacred bond blessed by Allah (SWT), uniting not just two individuals, but two families with shared values and aspirations. Our mission is to facilitate these blessed unions with complete respect for Islamic principles and Indian family traditions.
                      </p>
                      <p className="text-lg">
                        Every profile on our platform represents a genuine person seeking a <strong>life partner for this world and the hereafter</strong> - someone who shares your values, understands your culture, and complements your personality.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-8"
              >                <div className="bg-gradient-to-br from-royal-primary/10 to-royal-primary/5 p-6 rounded-xl border border-royal-primary/20">
                  <h4 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4 flex items-center gap-3`}>
                    <Sparkles className="h-6 w-6" />
                    Our Commitment
                  </h4>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    We are committed to providing a safe, secure, and respectful platform where Muslim families can find suitable matches with complete confidence and peace of mind.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-royal-primary/10 to-royal-primary/5 p-6 rounded-xl border border-royal-primary/20">
                  <h4 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4 flex items-center gap-3`}>
                    <Heart className="h-6 w-6" />
                    Smart Matchmaking
                  </h4>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Our advanced algorithms and personalized approach help you connect with compatible profiles based on your preferences, values, and lifestyle choices.
                  </p>
                </div><div className="bg-gradient-to-br from-royal-primary/10 to-royal-primary/5 p-6 rounded-xl border border-royal-primary/20">
                  <h4 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4 flex items-center gap-3`}>
                    <Image
                      src="/Nikah-Sufiyana-Icon-white-01.svg"
                      alt="Nikah Sufiyana Icon"
                      width={24}
                      height={24}
                      className="h-6 w-6"
                    />
                    Royal Sufi Service
                  </h4>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Experience matrimonial service inspired by the noble tradition of Sufi hospitality - where every soul is treated with royal dignity and spiritual respect.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>      {/* Premium Profiles Section */}
      <section className="section-spacing bg-gradient-to-br from-cream-light/50 to-cream-dark/30 relative">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-12 lg:mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Badge className="bg-royal-primary/10 text-royal-primary border-royal-primary/20 px-4 py-2 text-sm font-medium mb-4 inline-flex items-center gap-2">
              <Image
                src="/Nikah-Sufiyana-Icon-white-01.svg"
                alt="Nikah Sufiyana Icon"
                width={16}
                height={16}
                className="h-4 w-4"
              />
              Premium Verified Profiles
            </Badge>
            <h2 className={`${elMessiri.className} text-3xl md:text-4xl lg:text-5xl font-bold text-royal-primary mb-4 lg:mb-6`}>
              Featured Profiles from Hyderabad
            </h2>
            <div className="flex justify-center mb-4 lg:mb-6">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={250}
                height={12}
                className="opacity-60"
              />
            </div>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover verified premium profiles of accomplished individuals seeking blessed companionship through Sufiyana Matrimony.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 lg:mb-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {profilesLoading ? (
              // Loading skeleton
              [1, 2, 3].map((index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                    <div className="relative">
                      <div className="h-64 bg-gradient-to-br from-royal-primary/10 to-royal-primary/5 flex items-center justify-center animate-pulse">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-royal-primary/20 to-royal-primary/10"></div>
                      </div>
                    </div>
                    <CardContent className="p-6">                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-red-100 rounded w-3/4"></div>
                        <div className="h-3 bg-red-100 rounded w-1/2"></div>
                        <div className="h-3 bg-red-100 rounded w-2/3"></div>
                        <div className="h-3 bg-red-100 rounded w-1/2"></div>
                        <div className="h-8 bg-red-100 rounded w-full mt-4"></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              premiumProfiles.map((profile, index) => (
                <motion.div key={profile.id || index} variants={fadeInUp}>
                  <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                    <div className="relative">
                      {profile.profilePhoto ? (
                        <div className="h-64 relative">
                          <Image
                            src={profile.profilePhoto}
                            alt={profile.name}
                            fill
                            className="object-cover"                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              const target = e.currentTarget as HTMLImageElement
                              const fallbackDiv = target.nextElementSibling as HTMLElement
                              target.style.display = 'none'
                              if (fallbackDiv) {
                                fallbackDiv.style.display = 'flex'
                              }
                            }}
                          />
                          <div className="hidden h-64 bg-gradient-to-br from-royal-primary/10 to-royal-primary/5 items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-royal-primary/20 to-royal-primary/10 flex items-center justify-center">
                              <UserCheck className="h-16 w-16 text-royal-primary" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-64 bg-gradient-to-br from-royal-primary/10 to-royal-primary/5 flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-royal-primary/20 to-royal-primary/10 flex items-center justify-center">
                            <UserCheck className="h-16 w-16 text-royal-primary" />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 flex gap-2">
                        {profile.verified && (
                          <Badge className="bg-red-500 text-white border-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}                      {profile.premium && (
                          <Badge className="bg-royal-primary text-white border-0">
                            <Image
                              src="/Nikah-Sufiyana-Icon-white-01.svg"
                              alt="Nikah Sufiyana Icon"
                              width={12}
                              height={12}
                              className="h-3 w-3 mr-1"
                            />
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className={`${elMessiri.className} text-xl font-bold text-gray-800 mb-2`}>
                        {profile.name}
                      </h3>
                      <div className="space-y-2 text-custom-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {profile.age} years old
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {profile.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          {profile.education}
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {profile.profession}
                        </div>
                      </div>                      <div className="flex gap-2">
                        <Link href={`/profile/${profile.id}`}>
                          <Button className="flex-1 gradient-primary text-white">
                            View Profile
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white active:bg-royal-primary/90 active:text-white focus:bg-royal-primary focus:text-white transition-all duration-300"
                          onClick={() => {
                            // Handle shortlist functionality
                            console.log('Shortlisted:', profile.id)
                          }}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>          <div className="text-center">
            <Link href="/browse">
              <Button size="lg" variant="outline" className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white active:bg-royal-primary/90 active:text-white focus:bg-royal-primary focus:text-white px-8 py-4 text-lg font-semibold transition-all duration-300">
                View All Premium Profiles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>      {/* Success Stories Section */}
      <section className="section-spacing relative">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >            <h2 className={`${elMessiri.className} text-5xl md:text-6xl font-bold text-royal-primary mb-6`}>
              Blessed Sufiyana Love Stories
            </h2>
            <div className="flex justify-center mb-6">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={300}
                height={12}
                className="opacity-60"
              />
            </div>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto font-medium leading-relaxed">
              Real couples sharing their mystical journey of discovering eternal love and spiritual companionship through the blessed Nikah Sufiyana path.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {successStories.map((story, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <div className="relative">
                  <Image
                    src="/Nikah-Sufiyana-box-with-border-01.svg"
                    alt="Decorative Box Border"
                    width={400}
                    height={200}
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                  <Card className="relative bg-white/95 backdrop-blur-sm border-0 h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-royal-primary/20 to-royal-primary/10 flex items-center justify-center">
                          <Heart className="h-8 w-8 text-royal-primary" />
                        </div>
                        <div>
                          <h3 className={`${elMessiri.className} text-lg font-bold text-gray-800`}>
                            {story.couple}
                          </h3>
                          <p className="text-lg text-gray-600">{story.location}</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <Quote className="h-8 w-8 text-royal-primary/30 mb-4" />
                        <p className="text-gray-700 leading-relaxed italic">
                          "{story.story}"
                        </p>
                      </div>
                      
                      <div className="space-y-2 text-custom-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-royal-primary" />
                          <span className="font-medium text-royal-primary">{story.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-red-600" />
                          <span className="text-red-600 font-medium">{story.blessing}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </motion.div>          <div className="text-center mt-12">
            <Link href="/about#success-stories">
              <Button size="lg" className="gradient-primary text-white px-8 py-4 text-lg font-semibold">
                Read More Success Stories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div></div>
      </section>      {/* Sufiyana Philosophy & Community Section */}
      <section className="section-spacing bg-gradient-to-br from-cream-light/40 to-cream-dark/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/islamic-pattern-light.png')] opacity-5"></div>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 relative">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-5xl md:text-6xl font-bold text-royal-primary mb-6`}>
              The Sufiyana Way - Where Hearts Unite in Divine Harmony
            </h2>
            <div className="flex justify-center mb-8">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={300}
                height={12}
                className="opacity-60"
              />
            </div>
            <p className="text-xl md:text-2xl text-gray-700 max-w-5xl mx-auto font-medium leading-relaxed">              Find your perfect match among thousands of verified Muslim profiles with complete family support and Islamic guidance throughout your matrimonial journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative mb-8">
                <Image
                  src="/Nikah-Sufiyana-box-with-border-01.svg"
                  alt="Decorative Box Border"
                  width={300}
                  height={200}
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-royal-primary to-royal-primary/80 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-white" />
                  </div>                  <h3 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4`}>
                    Verified Profiles
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Every profile is thoroughly verified with document checks and family verification to ensure authenticity and build trust for meaningful connections.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative mb-8">
                <Image
                  src="/Nikah-Sufiyana-box-with-border-01.svg"
                  alt="Decorative Box Border"
                  width={300}
                  height={200}
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>                  <h3 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4`}>
                    Trusted Community
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Join 100,000+ Muslim families who trust Nikah Sufiyana for finding compatible matches with shared Islamic values and family traditions.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative mb-8">
                <Image
                  src="/Nikah-Sufiyana-box-with-border-01.svg"
                  alt="Decorative Box"
                  width={300}
                  height={200}
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4`}>
                    شاہانہ خدمت - Royal Service
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Experience matchmaking excellence that honors the nobility of your search - where every member receives royal treatment worthy of their spiritual journey.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Interactive Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="group cursor-pointer">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="text-4xl md:text-5xl font-bold text-royal-primary mb-2">100K+</div>
                <div className="text-gray-700 font-medium">Blessed Souls</div>
                <div className="text-lg text-gray-500">Active Members</div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="group cursor-pointer">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="text-4xl md:text-5xl font-bold text-royal-primary mb-2">15K+</div>
                <div className="text-gray-700 font-medium">Sufiyana Unions</div>
                <div className="text-lg text-gray-500">Successful Matches</div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="group cursor-pointer">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="text-4xl md:text-5xl font-bold text-royal-primary mb-2">95%</div>
                <div className="text-gray-700 font-medium">Divine Success</div>
                <div className="text-lg text-gray-500">Match Success Rate</div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="group cursor-pointer">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="text-4xl md:text-5xl font-bold text-royal-primary mb-2">24/7</div>
                <div className="text-gray-700 font-medium">Royal Support</div>
                <div className="text-lg text-gray-500">Always Available</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>      {/* Sufiyana Features Section */}
      <section className="section-spacing relative">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >            <h2 className={`${elMessiri.className} text-5xl md:text-6xl font-bold text-royal-primary mb-6`}>
              Premium Sufiyana Features - Where Technology Meets Spirituality
            </h2>
            <div className="flex justify-center mb-8">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={300}
                height={12}
                className="opacity-60"
              />
            </div>
            <p className="text-xl md:text-2xl text-gray-700 max-w-5xl mx-auto font-medium leading-relaxed">
              Discover advanced features designed with Sufi wisdom, ensuring your journey to finding your soulmate is blessed with convenience, privacy, and divine guidance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="group"            >
              <Card className="h-full group-hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden relative">
                {/* SVG Borders */}
                <>
                  {/* Bottom Left Border */}
                  <div className="absolute bottom-0 left-0 w-10 h-20 opacity-70">
                    <Image
                      src="/bottom-left-border.svg"
                      alt="Bottom Left Border"
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  {/* Top Right Border */}
                  <div className="absolute top-0 right-0 w-10 h-20 opacity-70">
                    <Image
                      src="/top-right-border.svg"
                      alt="Top Right Border"
                      fill
                      className="object-contain"
                    />
                  </div>
                </>
                
                <CardContent className="p-8 text-center relative">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-royal-primary to-royal-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4`}>
                    Mystical Match Algorithm
                  </h3>
                  
                  {/* Text Bottom Border */}
                  <div className="flex justify-center mb-4">
                    <Image
                      src="/text-bottom-border.svg"
                      alt="Text Bottom Border"
                      width={130}
                      height={13}
                      className="opacity-60"
                    />
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Our AI-powered matching system combines spiritual compatibility with personal preferences, ensuring every suggestion feels divinely guided.
                  </p>                  <Button variant="outline" className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white active:bg-royal-primary/90 active:text-white focus:bg-royal-primary focus:text-white transition-all duration-300">
                    Explore Matches
                  </Button>
                </CardContent>
              </Card>
            </motion.div>            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full group-hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden relative">
                {/* SVG Borders */}
                <>
                  {/* Bottom Left Border */}
                  <div className="absolute bottom-0 left-0 w-10 h-20 opacity-70">
                    <Image
                      src="/bottom-left-border.svg"
                      alt="Bottom Left Border"
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  {/* Top Right Border */}
                  <div className="absolute top-0 right-0 w-10 h-20 opacity-70">
                    <Image
                      src="/top-right-border.svg"
                      alt="Top Right Border"
                      fill
                      className="object-contain"
                    />
                  </div>
                </>
                
                <CardContent className="p-8 text-center relative">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4`}>
                    Privacy Protection
                  </h3>
                  
                  {/* Text Bottom Border */}
                  <div className="flex justify-center mb-4">
                    <Image
                      src="/text-bottom-border.svg"
                      alt="Text Bottom Border"
                      width={130}
                      height={13}
                      className="opacity-60"
                    />
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Advanced security measures ensure your personal information remains as protected as the secrets of the Sufi masters.
                  </p>                  <Link href="/privacy-features">
                    <Button variant="outline" className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white active:bg-royal-primary/90 active:text-white focus:bg-royal-primary focus:text-white transition-all duration-300">
                      Privacy Settings
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full group-hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden relative">
                {/* SVG Borders */}
                <>
                  {/* Bottom Left Border */}
                  <div className="absolute bottom-0 left-0 w-10 h-20 opacity-70">
                    <Image
                      src="/bottom-left-border.svg"
                      alt="Bottom Left Border"
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  {/* Top Right Border */}
                  <div className="absolute top-0 right-0 w-10 h-20 opacity-70">
                    <Image
                      src="/top-right-border.svg"
                      alt="Top Right Border"
                      fill
                      className="object-contain"
                    />
                  </div>
                </>
                
                <CardContent className="p-8 text-center relative">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4`}>
                    Blessed Communication
                  </h3>
                  
                  {/* Text Bottom Border */}
                  <div className="flex justify-center mb-4">
                    <Image
                      src="/text-bottom-border.svg"
                      alt="Text Bottom Border"
                      width={130}
                      height={13}
                      className="opacity-60"
                    />
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Connect with potential matches through our secure messaging system, designed to honor Islamic principles of respectful courtship.
                  </p>                  <Link href="/messages">
                    <Button variant="outline" className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white active:bg-royal-primary/90 active:text-white focus:bg-royal-primary focus:text-white transition-all duration-300">
                      Start Chatting
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>      {/* Call to Action Section */}
      <section className="section-spacing bg-gradient-to-br from-royal-primary to-royal-primary/80 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/islamic-pattern-light.png')] opacity-10"></div>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 relative">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}          >            <h2 className={`${elMessiri.className} text-5xl md:text-6xl font-bold mb-6 text-white`}>
              Find Your Life Partner Today
            </h2>
            <div className="flex justify-center mb-8">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={250}
                height={12}
                className="opacity-60 filter brightness-0 invert"
              />            </div>            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Join thousands of happy couples who found their life partners through Nikah Sufiyana. Start your journey today and connect with verified Muslim profiles from Hyderabad and across India with complete family support.
            </p>            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="bg-white text-royal-primary hover:bg-red-50 active:bg-red-100 focus:bg-red-50 px-8 py-4 text-lg font-semibold transition-all duration-300">
                  Create Free Profile
                  <UserPlus className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-royal-primary active:bg-red-50 active:text-royal-primary focus:bg-white focus:text-royal-primary px-8 py-4 text-lg font-semibold transition-all duration-300"                onClick={() => window.open('tel:+919014633411')}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call: +91 90146 33411
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppChat />
    </div>
  )
}
