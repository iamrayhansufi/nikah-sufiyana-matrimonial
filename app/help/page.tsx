"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageSquare,
  ArrowRight,
  BookOpen,
  Users,
  Shield,
  Headphones,
  Clock,
  CheckCircle,
  FileText,
  Search
} from "lucide-react"
import { elMessiri } from "../lib/fonts"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of using Nikah Sufiyana",
    icon: BookOpen,
    articles: [
      "How to create your perfect profile",
      "Understanding our matching system",
      "Setting up your preferences",
      "Adding photos and information"
    ]
  },
  {
    id: "profile-management",
    title: "Profile Management",
    description: "Managing and optimizing your profile",
    icon: Users,
    articles: [
      "Editing your profile information",
      "Photo management and privacy",
      "Verification process",
      "Deactivating or deleting account"
    ]
  },
  {
    id: "privacy-safety",
    title: "Privacy & Safety",
    description: "Keeping your information safe and secure",
    icon: Shield,
    articles: [
      "Privacy controls and settings",
      "Reporting suspicious profiles",
      "Photo protection features",
      "Safe communication guidelines"
    ]
  },
  {
    id: "communication",
    title: "Communication",
    description: "Connecting with potential matches",
    icon: MessageSquare,
    articles: [
      "Sending and receiving messages",
      "Interest management",
      "Family introduction process",
      "Video call guidelines"
    ]
  },
  {
    id: "technical-support",
    title: "Technical Support",
    description: "Troubleshooting and technical help",
    icon: Headphones,
    articles: [
      "Login and password issues",
      "Mobile app troubleshooting",
      "Browser compatibility",
      "Payment and billing support"
    ]
  },
  {
    id: "premium-features",
    title: "Premium Features",
    description: "Making the most of premium membership",
    icon: CheckCircle,
    articles: [
      "Premium membership benefits",
      "Advanced search options",
      "Priority customer support",
      "Relationship manager services"
    ]
  }
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const { toast } = useToast()

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Support Request Sent",
      description: "We'll get back to you within 24 hours.",
    })
    setSupportForm({
      name: "",
      email: "",
      subject: "",
      message: ""
    })
  }

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.articles.some(article => article.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
              <HelpCircle className="h-4 w-4 mr-2" />
              Help Center
            </Badge>
            <h1 className={`${elMessiri.className} text-5xl md:text-6xl font-bold text-royal-primary mb-6`}>
              We're Here to Help
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
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
              Get the support you need for your blessed matrimonial journey. Our comprehensive help center and dedicated support team are always ready to assist you.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white/80 border-royal-primary/20 focus:border-royal-primary"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact Options */}
      <section className="py-20 bg-gradient-to-br from-cream-light/30 to-cream-dark/20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-4xl md:text-5xl font-bold text-royal-primary mb-6`}>
              Quick Support Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Need immediate assistance? Choose from our quick support options.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-16"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-royal-primary/20 to-royal-primary/10 flex items-center justify-center">
                    <Phone className="h-8 w-8 text-royal-primary" />
                  </div>
                  <h3 className={`${elMessiri.className} text-xl font-bold text-royal-primary mb-4`}>
                    Phone Support
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Speak directly with our support team
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Mon-Sat: 9 AM - 9 PM</span>
                    </div>
                    <div>Sunday: 10 AM - 6 PM</div>
                  </div>
                  <Button 
                    className="w-full bg-royal-primary hover:bg-royal-primary/90 text-white"
                    onClick={() => window.open('tel:+919876543210')}
                  >
                    Call +91-9876543210
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/10 flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className={`${elMessiri.className} text-xl font-bold text-royal-primary mb-4`}>
                    Live Chat
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Instant chat support available
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>24/7 Available</span>
                    </div>
                    <div>Average response: 2 minutes</div>
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Start Live Chat
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className={`${elMessiri.className} text-xl font-bold text-royal-primary mb-4`}>
                    Email Support
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Detailed support via email
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Response within 24 hours</span>
                    </div>
                    <div>Detailed solutions provided</div>
                  </div>
                  <Link href="/contact">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Send Email
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Help Categories */}
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
              Browse Help Topics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find detailed guidance on all aspects of using Nikah Sufiyana.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {filteredCategories.map((category, index) => (
              <motion.div key={category.id} variants={fadeInUp}>
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-royal-primary/20 to-royal-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <category.icon className="h-6 w-6 text-royal-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`${elMessiri.className} text-xl font-bold text-royal-primary mb-2`}>
                          {category.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {category.articles.slice(0, 3).map((article, articleIndex) => (
                        <div key={articleIndex} className="flex items-center gap-2 text-sm text-gray-600 hover:text-royal-primary transition-colors cursor-pointer">
                          <FileText className="h-3 w-3" />
                          <span>{article}</span>
                        </div>
                      ))}
                      {category.articles.length > 3 && (
                        <div className="text-sm text-royal-primary font-medium">
                          +{category.articles.length - 3} more articles
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <Button variant="outline" className="w-full border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white">
                        Browse Articles
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No help topics found</h3>
              <p className="text-gray-500">Try adjusting your search terms or browse all categories.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-br from-cream-light/30 to-cream-dark/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className={`${elMessiri.className} text-4xl md:text-5xl font-bold text-royal-primary mb-6`}>
                Still Need Help?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Can't find what you're looking for? Send us a message and our support team will get back to you.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  <form onSubmit={handleSupportSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <Input
                          required
                          value={supportForm.name}
                          onChange={(e) => setSupportForm(prev => ({...prev, name: e.target.value}))}
                          placeholder="Enter your full name"
                          className="border-royal-primary/20 focus:border-royal-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          required
                          value={supportForm.email}
                          onChange={(e) => setSupportForm(prev => ({...prev, email: e.target.value}))}
                          placeholder="Enter your email"
                          className="border-royal-primary/20 focus:border-royal-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Input
                        required
                        value={supportForm.subject}
                        onChange={(e) => setSupportForm(prev => ({...prev, subject: e.target.value}))}
                        placeholder="Brief description of your issue"
                        className="border-royal-primary/20 focus:border-royal-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        required
                        value={supportForm.message}
                        onChange={(e) => setSupportForm(prev => ({...prev, message: e.target.value}))}
                        placeholder="Describe your issue in detail..."
                        rows={6}
                        className="border-royal-primary/20 focus:border-royal-primary"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-royal-primary hover:bg-royal-primary/90 text-white">
                      Send Support Request
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="py-20 bg-gradient-to-br from-royal-primary to-royal-primary/80 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-4xl md:text-5xl font-bold mb-6`}>
              Check Our FAQ
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Many questions are already answered in our comprehensive FAQ section.
            </p>
            <Link href="/faq">
              <Button size="lg" variant="secondary" className="bg-white text-royal-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Browse FAQ
                <HelpCircle className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
