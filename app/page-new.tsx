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
      title: "Where Hearts Unite in Sacred Bond",      
      description: "Discover your destined companion through our blessed platform, where every connection is guided by divine will and Islamic values of love, respect, and harmony.",
      image: "/placeholder.svg",
      badge: "✨ Blessed by 100,000+ Faithful Hearts"
    },
    {
      title: "Sacred Matrimonial Gathering",
      subtitle: "Islamic Marriage Conference 2024",
      description: "Join us for an enlightening journey with renowned Islamic scholars, relationship experts, and blessed couples who've found eternal happiness through halal unions.",
      image: "/events-bg.jpg",
      badge: "🕌 Register for Divine Guidance",
      cta: "Secure Your Sacred Spot"
    },
    {
      title: "Royal Matchmaking Experience",
      subtitle: "Personalized Sacred Journey",
      description: "Experience our exclusive royal treatment with dedicated marriage consultants who understand the sanctity of nikah and guide you toward your blessed destiny.",
      image: "/premium-bg.jpg",
      badge: "👑 Royal Ramadan Blessing",
      cta: "Begin Your Sacred Journey"
    }
  ]

  const values = [
    {
      icon: Mosque,
      title: "Islamic Values",
      description: "Built on pure Islamic principles with complete respect for halal relationships and sacred matrimonial traditions.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Shield,
      title: "Sacred Privacy",
      description: "Your privacy is our sacred trust. Advanced security ensures your personal journey remains blessed and protected.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: NikahSufiyanaIcon,
      title: "Royal Treatment",
      description: "Experience matrimonial services fit for royalty, with personalized consultation and premium matchmaking excellence.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Heart,
      title: "Blessed Connections",
      description: "Every match is blessed with divine intervention, creating meaningful relationships that lead to lifelong happiness.",
      color: "from-rose-500 to-red-600"
    }
  ]

  const successStories = [
    {
      couple: "Brother Ahmed & Sister Fatima",
      location: "Mumbai - Allah's Blessing",
      image: "/success-stories/couple1.jpg",
      story: "Alhamdulillah! Through Nikah Sufiyana's blessed platform, we found not just a life partner but a soul mate. The journey was filled with divine guidance and pure intentions. May Allah bless this sacred platform!",
      date: "Nikah Ceremony - 2024",
      blessing: "Blessed with their first child - Masha'Allah"
    },
    {
      couple: "Brother Omar & Sister Ayesha",
      location: "Delhi - Divine Intervention",
      image: "/success-stories/couple2.jpg",
      story: "SubhanAllah! What touched our hearts about Nikah Sufiyana was their deep respect for Islamic principles while making our sacred search effortless and dignified. Truly blessed!",
      date: "Sacred Union - 2023",
      blessing: "Expecting their first blessing - InshAllah"
    },
    {
      couple: "Brother Yusuf & Sister Zainab",
      location: "Hyderabad - Divine Intervention",
      image: "/success-stories/couple3.jpg",
      story: "MashaAllah! The royal treatment and spiritual guidance from Nikah Sufiyana's blessed team was extraordinary. They understood our hearts and guided us to eternal happiness.",
      date: "Heavenly Marriage - 2022",
      blessing: "Blessed with son Muhammad Abdullah"
    },
  ]

  const premiumProfiles = [
    {
      name: "Sister Maryam A.",
      age: 26,
      profession: "Software Engineer",
      location: "Bangalore, Karnataka",
      education: "B.Tech Computer Science",
      image: "/profiles/sister1.jpg",
      verified: true,
      premium: true
    },
    {
      name: "Brother Khalid M.",
      age: 29,
      profession: "Business Analyst",
      location: "Pune, Maharashtra",
      education: "MBA Finance",
      image: "/profiles/brother1.jpg",
      verified: true,
      premium: true
    },
    {
      name: "Sister Aisha R.",
      age: 24,
      profession: "Doctor",
      location: "Chennai, Tamil Nadu",
      education: "MBBS",
      image: "/profiles/sister2.jpg",
      verified: true,
      premium: true
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
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
      <Header />

      {/* Royal Hero Section with Divine Slider */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-primary/5 to-transparent"></div>
        
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="text-center lg:text-left space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <Badge className="bg-royal-primary/10 text-royal-primary border-royal-primary/20 px-4 py-2 text-lg font-medium">
                {slides[currentSlide].badge}
              </Badge>
              
              <h1 className={`${elMessiri.className} text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 leading-tight`}>
                {slides[currentSlide].title}
              </h1>
              
              {slides[currentSlide].subtitle && (
                <h2 className={`${elMessiri.className} text-2xl md:text-3xl text-royal-primary font-semibold`}>
                  {slides[currentSlide].subtitle}
                </h2>
              )}
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                {slides[currentSlide].description}
              </p>
            </div>

            {/* SVG Border Under Title */}
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={200}
                height={12}
                className="opacity-60"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-royal-primary hover:bg-royal-primary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                {slides[currentSlide].cta || "Begin Your Sacred Journey"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>              <Button variant="outline" size="lg" className="border-royal-primary text-royal-primary hover:royal-shine-button hover:text-white px-8 py-4 text-lg font-semibold">
                Watch Success Stories
                <Heart className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center lg:justify-start gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-royal-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Right Content - Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HeroRegistrationForm />
          </motion.div>
        </div>
      </section>

      {/* Sacred Values Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-3xl md:text-4xl font-bold text-gray-800 mb-6`}>
              Our Sacred Values
            </h2>
            <div className="flex justify-center mb-6">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={250}
                height={12}
                className="opacity-60"
              />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built upon the divine principles of Islam, our platform serves as a sacred bridge connecting hearts destined for eternal happiness and blessed unions.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className={`${elMessiri.className} text-xl font-bold text-gray-800 mb-4`}>
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Premium Profiles Section */}
      <section className="py-20 bg-gradient-to-br from-cream-light/50 to-cream-dark/30 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >            <Badge className="bg-royal-primary/10 text-royal-primary border-royal-primary/20 px-4 py-2 text-lg font-medium mb-4">
              <Image
                src="/Nikah-Sufiyana-Icon-white-01.svg"
                alt="Nikah Sufiyana Icon"
                width={16}
                height={16}
                className="h-4 w-4 mr-2"
              />              Premium Verified Profiles
            </Badge>
            <h2 className={`${elMessiri.className} text-3xl md:text-4xl font-bold text-gray-800 mb-6`}>
              Meet Your Royal Match
            </h2>
            <div className="flex justify-center mb-6">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={250}
                height={12}
                className="opacity-60"
              />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover verified premium profiles of accomplished individuals seeking blessed companionship through sacred matrimony.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {premiumProfiles.map((profile, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                  <div className="relative">
                    <div className="h-64 bg-gradient-to-br from-royal-primary/10 to-royal-primary/5 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-royal-primary/20 to-royal-primary/10 flex items-center justify-center">
                        <UserCheck className="h-16 w-16 text-royal-primary" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      {profile.verified && (
                        <Badge className="bg-green-500 text-white border-0">
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
                    <div className="space-y-2 text-lg text-gray-600 mb-4">
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
                    </div>                    <div className="flex gap-2">
                      <Button className="flex-1 royal-shine-button text-white">
                        View Profile
                      </Button>
                      <Button variant="outline" className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">            <Button size="lg" variant="outline" className="border-royal-primary text-royal-primary hover:royal-shine-button hover:text-white px-8 py-4 text-lg font-semibold">
              View All Premium Profiles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-3xl md:text-4xl font-bold text-gray-800 mb-6`}>
              Blessed Success Stories
            </h2>
            <div className="flex justify-center mb-6">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={250}
                height={12}
                className="opacity-60"
              />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real couples sharing their blessed journey of finding eternal love and happiness through our sacred platform.
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
                      
                      <div className="space-y-2 text-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-royal-primary" />
                          <span className="font-medium text-royal-primary">{story.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium">{story.blessing}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-royal-primary hover:bg-royal-primary/90 text-white px-8 py-4 text-lg font-semibold">
              Read More Success Stories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-royal-primary to-royal-primary/80 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/islamic-pattern-light.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-3xl md:text-5xl font-bold mb-6`}>
              Begin Your Sacred Journey Today
            </h2>
            <div className="flex justify-center mb-8">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={250}
                height={12}
                className="opacity-60 filter brightness-0 invert"
              />
            </div>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Join thousands of blessed souls who have found their destined companions through our royal matrimonial platform. Your perfect match awaits with Allah's blessing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-royal-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Create Free Profile
                <UserPlus className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-royal-primary px-8 py-4 text-lg font-semibold">
                <Phone className="mr-2 h-5 w-5" />
                Call: +91 9876543210
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
