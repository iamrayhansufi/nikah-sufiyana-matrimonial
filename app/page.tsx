"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WhatsAppChat } from "@/components/whatsapp-chat"
import { HeroRegistrationForm } from "@/components/hero-registration-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Heart, Shield, Star, ArrowRight, ChurchIcon as Mosque, UserCheck, CheckCircle, MapPin, GraduationCap, Briefcase, MessageSquare, UserPlus, Search, HeartHandshake, Crown, Sparkles, Users, Award, Verified, Quote, Calendar, Phone, Mail } from "lucide-react"
import { elMessiri } from "./lib/fonts"
import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { motion } from "framer-motion"

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
      title: "Nikah Sufi​yana - Where Sacred Hearts Unite in Divine Grace",      
      description: "Experience the mystical journey of finding your destined companion through our blessed Sufi-inspired platform, where every connection flows through divine will and Islamic values of pure love, creating eternal bonds in this sacred matrimonial space.",
      image: "/placeholder.svg",
      badge: "✨ Blessed by 100,000+ Faithful Souls in Divine Harmony"
    },
    {
      title: "The Royal Sufiyana Way of Sacred Union",
      subtitle: "Divine Matrimonial Conference 2024 - Where Souls Meet",
      description: "Join our sacred gathering with renowned Islamic scholars, Sufi masters, and blessed couples who've discovered eternal happiness through the mystical path of halal matrimony, guided by centuries of Sufi wisdom and spiritual enlightenment.",
      image: "/events-bg.jpg",
      badge: "🕌 Register for Spiritual Guidance & Divine Connection",
      cta: "Enter the Sacred Circle of Love"
    },
    {
      title: "Royal Sufiyana Matchmaking Excellence",
      subtitle: "Mystical Journey to Your Divinely Ordained Soulmate",
      description: "Experience our exclusive Sufiyana treatment with dedicated spiritual consultants who understand the mystical art of nikah and guide you toward your divinely ordained destiny, ensuring every match flows through divine grace and eternal blessing.",
      image: "/premium-bg.jpg",
      badge: "👑 Royal Sufiyana Blessing & Premium Service",
      cta: "Begin Your Sacred Mystical Journey"
    }
  ]
  const values = [
    {
      icon: Mosque,
      title: "Sufiyana Islamic Values & Divine Grace",
      description: "Rooted in the mystical tradition of Sufism and pure Islamic principles, every connection flows through divine guidance and spiritual awakening, creating eternal bliss and sacred matrimonial space where hearts find their destined place.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Shield,
      title: "Sacred Sufiyana Privacy & Divine Trust",
      description: "Your spiritual journey remains protected in our sacred trust with advanced security that ensures your path to love stays blessed and divinely guarded, honoring the Sufi tradition of protecting the sacred and the hearts that are most cherished.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Crown,
      title: "Royal Sufiyana Treatment & Mystical Excellence",
      description: "Experience matrimonial services inspired by Sufi royalty, with personalized spiritual consultation and mystical matchmaking excellence that honors your soul, ensuring every interaction reflects the divine nobility of your sacred search for love.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Heart,
      title: "Blessed Sufiyana Connections & Eternal Love",
      description: "Every match flows through the mystical Sufiyana way, creating soul-deep relationships that transcend ordinary love and lead to divine companionship, where two hearts become one in the sacred dance of eternal matrimonial romance.",
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
              <Badge className="bg-royal-primary/10 text-royal-primary border-royal-primary/20 px-4 py-2 text-sm font-medium">
                {slides[currentSlide].badge}
              </Badge>                  <h1 className={`${elMessiri.className} text-6xl md:text-8xl lg:text-9xl font-bold text-royal-primary leading-tight`}>
                {slides[currentSlide].title}
              </h1>
                {slides[currentSlide].subtitle && (
                <h2 className={`${elMessiri.className} text-4xl md:text-5xl text-royal-primary font-semibold`}>
                  {slides[currentSlide].subtitle}
                </h2>
              )}
              
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl font-medium">
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
              </Button>
              <Button variant="outline" size="lg" className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white px-8 py-4 text-lg font-semibold">
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
            whileInView="animate"
            viewport={{ once: true }}
          >            <h2 className={`${elMessiri.className} text-6xl md:text-7xl font-bold text-royal-primary mb-6`}>
              The Sacred Sufiyana Values
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
              Built upon the mystical principles of Sufism and pure Islamic teachings, Nikah Sufiyana serves as a divine bridge connecting souls destined for eternal love through the sacred path of matrimony.
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
          </motion.div>        </div>
      </section>

      {/* Brand Story Section - The Sufiyana Legacy */}
      <section className="py-20 bg-gradient-to-br from-cream-light/30 to-cream-dark/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/islamic-pattern-light.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="max-w-6xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">              <h2 className={`${elMessiri.className} text-6xl md:text-7xl font-bold text-royal-primary mb-6`}>
                The Mystical Legacy of Nikah Sufiyana
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
                    <div className="space-y-6 text-gray-700 leading-relaxed">
                      <p className="text-lg">
                        <strong>Nikah Sufiyana</strong> draws its essence from the mystical traditions of Sufism, where love transcends the material world to touch the divine. Our name embodies the sacred journey of two souls finding their spiritual completion through matrimony.
                      </p>
                      <p className="text-lg">
                        In the <em>Sufi tradition</em>, marriage is not merely a contract but a mystical union that mirrors the soul's relationship with the Divine. We honor this sacred philosophy by creating connections that nurture both earthly happiness and spiritual growth.
                      </p>
                      <p className="text-lg">
                        Every profile on our platform is blessed with the intention of finding not just a life partner, but a <strong>companion for the spiritual journey</strong> - someone who will walk alongside you in this world and the hereafter.
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
              >
                <div className="bg-gradient-to-br from-royal-primary/10 to-royal-primary/5 p-6 rounded-xl border border-royal-primary/20">
                  <h4 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4 flex items-center gap-3`}>
                    <Sparkles className="h-6 w-6" />
                    The Sacred Promise
                  </h4>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    We promise to honor your search for love with the same reverence Sufis show for their spiritual path - with patience, wisdom, and divine guidance.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-royal-primary/10 to-royal-primary/5 p-6 rounded-xl border border-royal-primary/20">
                  <h4 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4 flex items-center gap-3`}>
                    <Heart className="h-6 w-6" />
                    Mystical Matchmaking
                  </h4>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Our approach combines modern technology with ancient wisdom, ensuring that every connection flows through divine will and spiritual compatibility.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-royal-primary/10 to-royal-primary/5 p-6 rounded-xl border border-royal-primary/20">
                  <h4 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4 flex items-center gap-3`}>
                    <Crown className="h-6 w-6" />
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
          >
            <Badge className="bg-royal-primary/10 text-royal-primary border-royal-primary/20 px-4 py-2 text-sm font-medium mb-4">
              <Crown className="h-4 w-4 mr-2" />
              Premium Verified Profiles
            </Badge>            <h2 className={`${elMessiri.className} text-6xl md:text-7xl font-bold text-royal-primary mb-6`}>
              Meet Your Sufiyana Soulmate
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
                      )}
                      {profile.premium && (
                        <Badge className="bg-royal-primary text-white border-0">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className={`${elMessiri.className} text-xl font-bold text-gray-800 mb-2`}>
                      {profile.name}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
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
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-royal-primary hover:bg-royal-primary/90 text-white">
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

          <div className="text-center">
            <Button size="lg" variant="outline" className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white px-8 py-4 text-lg font-semibold">
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
            whileInView="animate"
            viewport={{ once: true }}
          >            <h2 className={`${elMessiri.className} text-6xl md:text-7xl font-bold text-royal-primary mb-6`}>
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
                          <p className="text-sm text-gray-600">{story.location}</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <Quote className="h-8 w-8 text-royal-primary/30 mb-4" />
                        <p className="text-gray-700 leading-relaxed italic">
                          "{story.story}"
                        </p>
                      </div>
                      
                      <div className="space-y-2 text-sm">
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
          </div>        </div>
      </section>

      {/* Sufiyana Philosophy & Community Section */}
      <section className="py-20 bg-gradient-to-br from-cream-light/40 to-cream-dark/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/islamic-pattern-light.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-6xl md:text-7xl font-bold text-royal-primary mb-6`}>
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
            <p className="text-xl md:text-2xl text-gray-700 max-w-5xl mx-auto font-medium leading-relaxed">
              In the mystical realm of Nikah Sufiyana, every connection flows like poetry in motion, where sacred hearts discover their eternal destination through divine intervention and spiritual celebration.
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
                  </div>
                  <h3 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4`}>
                    سُفیانہ محبت - Sufiyana Love
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Love that transcends the material realm, connecting souls through divine wisdom and spiritual understanding - the Sufiyana way of eternal companionship.
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
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4`}>
                    روحانی برادری - Sacred Brotherhood
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    A blessed community of 100,000+ faithful souls, united in the pursuit of halal love and guided by Islamic principles in every matrimonial connection.
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
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
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
                <div className="text-sm text-gray-500">Active Members</div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="group cursor-pointer">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="text-4xl md:text-5xl font-bold text-royal-primary mb-2">15K+</div>
                <div className="text-gray-700 font-medium">Sacred Unions</div>
                <div className="text-sm text-gray-500">Successful Matches</div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="group cursor-pointer">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="text-4xl md:text-5xl font-bold text-royal-primary mb-2">95%</div>
                <div className="text-gray-700 font-medium">Divine Success</div>
                <div className="text-sm text-gray-500">Match Success Rate</div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="group cursor-pointer">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="text-4xl md:text-5xl font-bold text-royal-primary mb-2">24/7</div>
                <div className="text-gray-700 font-medium">Royal Support</div>
                <div className="text-sm text-gray-500">Always Available</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sufiyana Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-6xl md:text-7xl font-bold text-royal-primary mb-6`}>
              Royal Sufiyana Features - Where Technology Meets Spirituality
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
              className="group"
            >
              <Card className="h-full group-hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-royal-primary to-royal-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4`}>
                    Mystical Match Algorithm
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Our AI-powered matching system combines spiritual compatibility with personal preferences, ensuring every suggestion feels divinely guided.
                  </p>
                  <Button variant="outline" className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white">
                    Explore Matches
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full group-hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4`}>
                    Sacred Privacy Protection
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Advanced security measures ensure your personal information remains as protected as the secrets of the Sufi masters.
                  </p>
                  <Button variant="outline" className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white">
                    Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full group-hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-4`}>
                    Blessed Communication
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Connect with potential matches through our secure messaging system, designed to honor Islamic principles of respectful courtship.
                  </p>
                  <Button variant="outline" className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white">
                    Start Chatting
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
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
            whileInView="animate"
            viewport={{ once: true }}
          >            <h2 className={`${elMessiri.className} text-6xl md:text-7xl font-bold mb-6`}>
              Begin Your Sacred Sufiyana Journey Today
            </h2>
            <div className="flex justify-center mb-8">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={250}
                height={12}
                className="opacity-60 filter brightness-0 invert"
              />
            </div>            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Join thousands of blessed souls who have found their destined companions through our royal Sufiyana platform. Your perfect match awaits with Allah's blessing in this sacred space where hearts unite through divine will and mystical matrimonial grace.
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
