"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Lock, 
  Eye, 
  UserCheck, 
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  ArrowRight,
  Heart,
  MessageSquare,
  Camera,
  Clock,
  Star,
  Users
} from "lucide-react"
import { elMessiri } from "../lib/fonts"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const safetyFeatures = [
  {
    id: 1,
    title: "Profile Verification",
    description: "Multi-level verification system including document verification, phone verification, and family background checks to ensure authentic profiles.",
    icon: UserCheck,
    benefits: [
      "Document verification for premium members",
      "Phone and email verification for all users",
      "Family background verification",
      "Photo verification process"
    ]
  },
  {
    id: 2,
    title: "Privacy Controls",
    description: "Advanced privacy settings that give you complete control over who can see your information and contact you.",
    icon: Lock,
    benefits: [
      "Control photo visibility",
      "Manage contact information access",
      "Set communication preferences",
      "Block unwanted contacts"
    ]
  },
  {
    id: 3,
    title: "Secure Communication",
    description: "Safe messaging platform with encryption and monitoring to ensure respectful and secure conversations.",
    icon: MessageSquare,
    benefits: [
      "Encrypted messaging system",
      "Report inappropriate behavior",
      "Moderated communication channels",
      "Family involvement features"
    ]
  },
  {
    id: 4,
    title: "Photo Protection",
    description: "Advanced photo protection features that prevent unauthorized downloads and misuse of your pictures.",
    icon: Camera,
    benefits: [
      "Watermarked photos",
      "Screenshot protection",
      "Time-limited photo access",
      "Report photo misuse"
    ]
  }
]

const safetyTips = [
  {
    category: "Profile Safety",
    tips: [
      "Use recent and authentic photos",
      "Provide accurate information about yourself",
      "Don't share your exact address initially",
      "Keep your contact details private until you're comfortable"
    ]
  },
  {
    category: "Communication Safety", 
    tips: [
      "Keep conversations within the platform initially",
      "Involve family members in important discussions",
      "Report any inappropriate behavior immediately",
      "Don't share financial information or send money"
    ]
  },
  {
    category: "Meeting Safety",
    tips: [
      "Meet in public places for initial meetings",
      "Involve family members or friends",
      "Inform someone about your meeting plans",
      "Trust your instincts if something feels wrong"
    ]
  },
  {
    category: "Information Safety",
    tips: [
      "Don't share passwords or account details",
      "Verify information through multiple sources",
      "Be cautious about sharing personal documents",
      "Use our platform's secure communication features"
    ]
  }
]

const reportingProcess = [
  {
    step: 1,
    title: "Identify the Issue",
    description: "Document any inappropriate behavior, suspicious profiles, or safety concerns you encounter."
  },
  {
    step: 2,
    title: "Use Report Feature",
    description: "Click the report button on profiles or messages to report issues directly through our platform."
  },
  {
    step: 3,
    title: "Provide Details",
    description: "Give specific information about the incident to help our moderation team take appropriate action."
  },
  {
    step: 4,
    title: "Follow Up",
    description: "Our team will investigate and respond within 24 hours with appropriate action taken."
  }
]

export default function SafetyPage() {
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

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <Badge className="bg-royal-primary/10 text-royal-primary border-royal-primary/20 px-4 py-2 text-sm font-medium mb-6">
              <Shield className="h-4 w-4 mr-2" />
              Safety & Security
            </Badge>
            <h1 className={`${elMessiri.className} text-5xl md:text-6xl font-bold text-royal-primary mb-6`}>
              Your Safety is Our Priority
            </h1>
            <div className="flex justify-center mb-8">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={300}
                height={12}
                className="opacity-60"
              />
            </div>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              At Nikah Sufiyana, we've built comprehensive safety measures to protect our community and ensure your matrimonial journey remains secure, respectful, and blessed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-20 bg-gradient-to-br from-cream-light/30 to-cream-dark/20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-4xl md:text-5xl font-bold text-royal-primary mb-6`}>
              Advanced Safety Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our multi-layered security approach ensures every aspect of your experience is protected and secure.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >            {safetyFeatures.map((feature, index) => (
              <motion.div key={feature.id} variants={fadeInUp}>
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full relative">
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
                  
                  <CardContent className="p-8 relative">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-royal-primary/20 to-royal-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-8 w-8 text-royal-primary" />
                      </div>
                      <div>
                        <h3 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-3`}>
                          {feature.title}
                        </h3>
                        
                        {/* Text Bottom Border */}
                        <div className="flex justify-start mb-4">
                          <Image
                            src="/text-bottom-border.svg"
                            alt="Text Bottom Border"
                            width={130}
                            height={13}
                            className="opacity-60"
                          />
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-4xl md:text-5xl font-bold text-royal-primary mb-6`}>
              Essential Safety Guidelines
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these important guidelines to ensure your safety and have a positive experience on our platform.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >            {safetyTips.map((category, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg h-full relative">
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
                  
                  <CardContent className="p-8 relative">
                    <h3 className={`${elMessiri.className} text-2xl font-bold text-royal-primary mb-6`}>
                      {category.category}
                    </h3>
                    
                    {/* Text Bottom Border */}
                    <div className="flex justify-start mb-6">
                      <Image
                        src="/text-bottom-border.svg"
                        alt="Text Bottom Border"
                        width={130}
                        height={13}
                        className="opacity-60"
                      />
                    </div>
                    <div className="space-y-4">
                      {category.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-royal-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-4 w-4 text-royal-primary" />
                          </div>
                          <span className="text-gray-700 leading-relaxed">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Reporting Process */}
      <section className="py-20 bg-gradient-to-br from-cream-light/30 to-cream-dark/20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-4xl md:text-5xl font-bold text-royal-primary mb-6`}>
              How to Report Issues
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              If you encounter any suspicious behavior or safety concerns, follow these steps to report them.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >              {reportingProcess.map((step, index) => (
                <motion.div key={step.step} variants={fadeInUp}>
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg text-center h-full relative">
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
                    
                    <CardContent className="p-6 relative">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-royal-primary to-royal-primary/80 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{step.step}</span>
                      </div>
                      <h3 className={`${elMessiri.className} text-lg font-bold text-royal-primary mb-3`}>
                        {step.title}
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
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Verification */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-4xl md:text-5xl font-bold text-royal-primary mb-6`}>
              Building Trust Through Verification
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive verification system ensures you connect with genuine, serious individuals seeking blessed matrimonial relationships.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg text-center h-full relative">
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
                
                <CardContent className="p-8 relative">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-red-500/10 flex items-center justify-center">
                    <UserCheck className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className={`${elMessiri.className} text-xl font-bold text-royal-primary mb-4`}>
                    Identity Verification
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
                  <p className="text-gray-600 leading-relaxed">
                    Government ID verification, address proof, and background checks ensure authentic profiles on our platform.
                  </p>
                </CardContent>
              </Card>
            </motion.div>            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg text-center h-full relative">
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
                
                <CardContent className="p-8 relative">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-red-500/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className={`${elMessiri.className} text-xl font-bold text-royal-primary mb-4`}>
                    Family Verification
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
                  <p className="text-gray-600 leading-relaxed">
                    Family involvement and verification adds an extra layer of authenticity and traditional values to the process.
                  </p>
                </CardContent>
              </Card>
            </motion.div>            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg text-center h-full relative">
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
                
                <CardContent className="p-8 relative">                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-red-500/10 flex items-center justify-center">
                    <Star className="h-8 w-8 text-red-600" />
                  </div>                  <h3 className={`${elMessiri.className} text-xl font-bold text-royal-primary mb-4`}>
                    Premium Verification
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
                  <p className="text-gray-600 leading-relaxed">
                    Enhanced verification for premium members includes professional and educational background checks.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div 
            className="text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
              <CheckCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className={`${elMessiri.className} text-2xl font-bold text-red-800 mb-4`}>
                99.2% Verified Profiles
              </h3>
              <p className="text-red-700 leading-relaxed">
                Our rigorous verification process ensures that over 99% of profiles on Nikah Sufiyana are authentic and genuine, giving you confidence in every connection.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 bg-gradient-to-br from-royal-primary to-royal-primary/80 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-red-300" />
            <h2 className={`${elMessiri.className} text-4xl md:text-5xl font-bold mb-6`}>
              Need Immediate Help?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              If you're facing any safety concerns or emergency situations, contact our support team immediately. We're here 24/7 to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-red-600 text-white hover:bg-red-700 border-0 px-8 py-4 text-lg font-semibold"
                onClick={() => window.open('tel:+919014633411')}
              >
                <Phone className="mr-2 h-5 w-5" />
                Emergency: +91-9876543210
              </Button>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-royal-primary px-8 py-4 text-lg font-semibold">
                  <Mail className="mr-2 h-5 w-5" />
                  Report Incident
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-20 bg-gradient-to-br from-cream-light/50 to-cream-dark/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-4xl md:text-5xl font-bold text-royal-primary mb-6`}>
              Additional Safety Resources
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Learn more about staying safe and making the most of your matrimonial journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/faq">
                <Button size="lg" className="bg-royal-primary hover:bg-royal-primary/90 text-white px-8 py-4 text-lg font-semibold">
                  Safety FAQ
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/privacy">
                <Button size="lg" variant="outline" className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white px-8 py-4 text-lg font-semibold">
                  Privacy Policy
                  <Shield className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/help">
                <Button size="lg" variant="outline" className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white px-8 py-4 text-lg font-semibold">
                  Help Center
                  <Heart className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
