"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Mail, 
  MessageSquare,
  ArrowRight,
  Shield,
  Heart,
  Users,
  Settings,
  CreditCard,
  Lock
} from "lucide-react"
import { elMessiri } from "../lib/fonts"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"

const faqCategories = [
  { id: "general", name: "General", icon: HelpCircle },
  { id: "account", name: "Account & Profile", icon: Users },
  { id: "privacy", name: "Privacy & Safety", icon: Shield },
  { id: "matching", name: "Matching & Communication", icon: Heart },
  { id: "premium", name: "Premium Features", icon: CreditCard },
  { id: "technical", name: "Technical Support", icon: Settings }
]

const faqs = [
  {
    id: 1,
    category: "general",
    question: "What is Nikah Sufiyana and how does it work?",
    answer: "Nikah Sufiyana is India's premier Islamic matrimonial platform that helps Muslim families find suitable life partners for their children. We combine traditional Islamic values with modern technology to facilitate blessed connections. Our platform allows you to create detailed profiles, search for compatible matches based on Islamic principles, and communicate safely with potential partners and their families."
  },
  {
    id: 2,
    category: "general",
    question: "Is Nikah Sufiyana only for people from specific regions?",
    answer: "No, Nikah Sufiyana welcomes Muslim singles from across India and around the world. While we have a strong presence in Hyderabad and South India, our platform serves the global Muslim community seeking matrimonial connections that honor Islamic values."
  },
  {
    id: 3,
    category: "general",
    question: "How much does it cost to use Nikah Sufiyana?",
    answer: "We offer both free and premium membership options. Free members can create profiles, browse matches, and send limited messages. Premium membership provides unlimited communication, advanced search filters, priority customer support, and enhanced privacy controls. Check our pricing page for current rates."
  },
  {
    id: 4,
    category: "account",
    question: "How do I create a profile on Nikah Sufiyana?",
    answer: "Creating a profile is simple: 1) Click 'Register Now' on our homepage, 2) Fill in your basic information including religious preferences, 3) Add photos and detailed personal information, 4) Complete your family details and partner preferences, 5) Verify your account through email/phone. Our guided process ensures your profile represents you authentically."
  },
  {
    id: 5,
    category: "account",
    question: "What information should I include in my profile?",
    answer: "Include accurate information about your education, profession, family background, religious practices, and what you're looking for in a life partner. Add recent photos that represent you well. The more complete and honest your profile, the better matches you'll receive. Remember to highlight your Islamic values and family traditions."
  },
  {
    id: 6,
    category: "account",
    question: "Can I edit my profile after creating it?",
    answer: "Yes, you can edit most sections of your profile at any time through your dashboard. Some information like age and location may require verification if changed significantly. We encourage keeping your profile updated as your preferences or circumstances change."
  },
  {
    id: 7,
    category: "privacy",
    question: "How do you protect my privacy and personal information?",
    answer: "Privacy is our top priority. We use advanced encryption, secure servers, and strict privacy controls. You can control who sees your photos, contact information, and profile details. We never share your information with third parties without consent. Our platform includes features like photo protection and gradual information disclosure."
  },
  {
    id: 8,
    category: "privacy",
    question: "Who can see my profile and photos?",
    answer: "You have complete control over your privacy settings. You can choose to show your profile to all members, only premium members, or specific individuals. Photo visibility can be controlled separately - you can make them visible to everyone, only after interest exchange, or grant access individually."
  },
  {
    id: 9,
    category: "privacy",
    question: "How do you verify profiles to prevent fake accounts?",
    answer: "We have a comprehensive verification process including email verification, phone verification, and document verification for premium members. Our team manually reviews profiles for authenticity. We also encourage family involvement in the process, which adds an additional layer of verification."
  },
  {
    id: 10,
    category: "matching",
    question: "How does your matching algorithm work?",
    answer: "Our algorithm considers multiple factors: religious compatibility, family background, education, profession, location preferences, lifestyle choices, and specific requirements you've mentioned. We prioritize Islamic values and family preferences in our matching logic to suggest truly compatible partners."
  },
  {
    id: 11,
    category: "matching",
    question: "How do I communicate with potential matches?",
    answer: "After finding a potential match, you can express interest. If both parties express mutual interest, you can start messaging through our secure platform. Premium members have unlimited messaging, while free members have message limits. We also facilitate family introductions when both parties are ready."
  },
  {
    id: 12,
    category: "matching",
    question: "What if I'm not satisfied with my matches?",
    answer: "You can refine your search criteria, update your preferences, or contact our customer support for personalized assistance. Premium members get dedicated relationship managers who help optimize match suggestions. Remember, finding the right partner takes time and patience (Sabr)."
  },
  {
    id: 13,
    category: "premium",
    question: "What are the benefits of premium membership?",
    answer: "Premium members enjoy unlimited messaging, advanced search filters, priority customer support, enhanced privacy controls, read receipts, and access to premium profiles. You also get a dedicated relationship manager and priority placement in search results."
  },
  {
    id: 14,
    category: "premium",
    question: "Can I cancel my premium membership?",
    answer: "Yes, you can cancel your premium membership at any time through your account settings. Your premium benefits will continue until the end of your current billing period. We also offer refunds under specific circumstances as outlined in our terms of service."
  },
  {
    id: 15,
    category: "premium",
    question: "Do you offer family packages or discounts?",
    answer: "Yes, we offer special family packages for parents registering multiple children and loyalty discounts for long-term memberships. Contact our customer support for customized family plans and current promotional offers."
  },
  {
    id: 16,
    category: "technical",
    question: "Is the website mobile-friendly?",
    answer: "Yes, Nikah Sufiyana is fully responsive and works seamlessly on all devices - smartphones, tablets, and desktops. We also have mobile apps available for iOS and Android for an even better mobile experience."
  },
  {
    id: 17,
    category: "technical",
    question: "I'm having trouble logging in. What should I do?",
    answer: "First, ensure you're using the correct email and password. Try resetting your password using the 'Forgot Password' link. Clear your browser cache and cookies, or try a different browser. If problems persist, contact our technical support team immediately."
  },
  {
    id: 18,
    category: "technical",
    question: "How do I report a suspicious profile or behavior?",
    answer: "Click the 'Report' button on any profile or message that seems suspicious. Our moderation team reviews all reports promptly. We take safety seriously and will take appropriate action including profile suspension or removal if necessary."
  }
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("general")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    const matchesSearch = searchTerm === "" || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleExpanded = (faqId: number) => {
    setExpandedItems(prev => 
      prev.includes(faqId) 
        ? prev.filter(id => id !== faqId)
        : [...prev, faqId]
    )
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
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
              Frequently Asked Questions
            </Badge>
            <h1 className={`${elMessiri.className} text-5xl md:text-6xl font-bold text-royal-primary mb-6`}>
              How Can We Help You?
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
              Find answers to common questions about Nikah Sufiyana, our Islamic matrimonial services, and how to make the most of your blessed journey.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white/80 border-royal-primary/20 focus:border-royal-primary"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories and FAQ Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg sticky top-20">
                <CardContent className="p-6">
                  <h3 className={`${elMessiri.className} text-xl font-bold text-royal-primary mb-4`}>
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === "all" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        selectedCategory === "all" 
                          ? "bg-royal-primary text-white" 
                          : "hover:bg-royal-primary/10 text-gray-700"
                      }`}
                      onClick={() => setSelectedCategory("all")}
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      All Categories
                    </Button>
                    {faqCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          selectedCategory === category.id 
                            ? "bg-royal-primary text-white" 
                            : "hover:bg-royal-primary/10 text-gray-700"
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <category.icon className="h-4 w-4 mr-2" />
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              <motion.div 
                className="space-y-4"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {filteredFAQs.map((faq, index) => (
                  <Card key={faq.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full p-6 text-left hover:bg-royal-primary/5 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className={`${elMessiri.className} text-lg font-semibold text-royal-primary pr-4`}>
                            {faq.question}
                          </h3>
                          {expandedItems.includes(faq.id) ? (
                            <ChevronUp className="h-5 w-5 text-royal-primary flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-royal-primary flex-shrink-0" />
                          )}
                        </div>
                      </button>
                      
                      {expandedItems.includes(faq.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-6"
                        >
                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-gray-700 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {filteredFAQs.length === 0 && (
                  <div className="text-center py-12">
                    <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
                    <p className="text-gray-500">Try adjusting your search terms or browse different categories.</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Section */}
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
              Quick Help & Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Can't find what you're looking for? Here are some quick resources to help you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-royal-primary/20 to-royal-primary/10 flex items-center justify-center">
                    <Phone className="h-8 w-8 text-royal-primary" />
                  </div>
                  <h3 className={`${elMessiri.className} text-xl font-bold text-royal-primary mb-4`}>
                    Call Support
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Speak directly with our customer support team for personalized assistance.
                  </p>
                  <Button 
                    className="w-full bg-royal-primary hover:bg-royal-primary/90 text-white"                    onClick={() => window.open('tel:+919014633411')}
                  >
                    Call +91-90146 33411
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/10 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className={`${elMessiri.className} text-xl font-bold text-royal-primary mb-4`}>
                    Email Support
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Send us your questions and we'll respond within 24 hours.
                  </p>
                  <Link href="/contact">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      Send Email
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-500/10 flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className={`${elMessiri.className} text-xl font-bold text-royal-primary mb-4`}>
                    Live Chat
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Chat with our support team for instant help and guidance.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              Still Have Questions?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Our dedicated support team is here to help you every step of the way in your matrimonial journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="bg-white text-royal-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  Contact Support
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/help">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-royal-primary px-8 py-4 text-lg font-semibold">
                  Visit Help Center
                  <HelpCircle className="ml-2 h-5 w-5" />
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
