"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Lock, 
  Eye, 
  UserCheck, 
  Database, 
  Clock, 
  Mail, 
  FileText,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { elMessiri } from "../lib/fonts"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  const privacyHighlights = [
    {
      icon: Shield,
      title: "Data Protection",
      description: "Your personal information is encrypted and securely stored"
    },
    {
      icon: Eye,
      title: "Privacy Controls",
      description: "You control who can see your profile and contact details"
    },
    {
      icon: Lock,
      title: "Secure Communication",
      description: "All messages and communications are encrypted"
    },
    {
      icon: UserCheck,
      title: "Verified Profiles",
      description: "We verify user identities to maintain authenticity"
    }
  ]

  const privacySections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal details: Name, age, contact information, location",
        "Profile information: Photos, preferences, family details", 
        "Communication: Messages and interactions with other users",
        "Usage data: How you use our platform for better experience"
      ]
    },
    {
      icon: FileText,
      title: "How We Use Your Information",
      content: [
        "Create and manage your matrimonial profile",
        "Provide compatible match suggestions",
        "Facilitate secure communication between users",
        "Improve our services and user experience",
        "Send important updates and notifications"
      ]
    },
    {
      icon: Eye,
      title: "Your Privacy Choices",
      content: [
        "Control profile visibility and who can contact you",
        "Manage photo privacy and access permissions",
        "Update or delete your information anytime",
        "Choose your communication preferences",
        "Block or report inappropriate users"
      ]
    },
    {
      icon: Shield,
      title: "Data Security",
      content: [
        "Industry-standard encryption for all data",
        "Secure servers with regular security updates",
        "Limited access to personal information",
        "Regular security audits and monitoring",
        "Compliance with data protection regulations"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-amber-600/10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className={`${elMessiri.className} text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent mb-6`}>
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Your privacy and security are our top priorities. Learn how we protect your personal information and give you control over your data.
          </p>
          <Badge className="bg-gradient-to-r from-emerald-500 to-amber-500 text-white px-4 py-2">
            Last Updated: June 22, 2025
          </Badge>
        </div>
      </section>

      {/* Privacy Highlights */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-amber-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {privacyHighlights.map((highlight, index) => (
              <div key={index} className="text-center text-white">
                <div className="inline-flex p-3 rounded-full bg-white/20 mb-4">
                  <highlight.icon className="h-8 w-8" />
                </div>
                <h3 className={`${elMessiri.className} text-xl font-bold mb-2`}>{highlight.title}</h3>
                <p className="text-emerald-100 text-sm">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8">
            {privacySections.map((section, index) => (
              <Card key={index} className="border-0 bg-white/90 dark:bg-gray-800/90 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500 to-amber-500">
                      <section.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className={`${elMessiri.className} text-2xl font-bold text-gray-800 dark:text-gray-200`}>
                      {section.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Privacy Policy */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 bg-white/90 dark:bg-gray-800/90">
            <CardHeader className="text-center">
              <CardTitle className={`${elMessiri.className} text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4`}>
                Detailed Privacy Policy
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Complete information about how we handle your data
              </p>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3 className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                1. Introduction
              </h3>
              <p>
                Nikah Sufiyana Matrimonial Services is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, protect, and handle your information when you use our matrimonial platform.
              </p>
              
              <Separator className="my-6" />
              
              <h3 className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                2. Information Collection
              </h3>
              <p>We collect information that you provide directly, including:</p>
              <ul>
                <li><strong>Profile Information:</strong> Personal details, photos, preferences, family information</li>
                <li><strong>Contact Information:</strong> Email, phone number, address</li>
                <li><strong>Authentication Data:</strong> Login credentials (passwords are encrypted)</li>
                <li><strong>Communication Data:</strong> Messages and interactions with other users</li>
                <li><strong>Usage Information:</strong> How you interact with our platform</li>
              </ul>
              
              <Separator className="my-6" />
              
              <h3 className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                3. Information Usage
              </h3>
              <p>Your information is used to:</p>
              <ul>
                <li>Create and maintain your matrimonial profile</li>
                <li>Provide compatible match suggestions</li>
                <li>Facilitate communication between members</li>
                <li>Process payments and subscriptions</li>
                <li>Improve our services and user experience</li>
                <li>Send important notifications and updates</li>
                <li>Ensure platform safety and security</li>
              </ul>
              
              <Separator className="my-6" />
              
              <h3 className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                4. Information Sharing
              </h3>
              <p>We share your information only in these circumstances:</p>
              <ul>
                <li><strong>With Other Users:</strong> Profile information you choose to make visible</li>
                <li><strong>Service Providers:</strong> Trusted partners who help us operate our platform</li>
                <li><strong>Legal Requirements:</strong> When required by law or legal processes</li>
                <li><strong>Safety Purposes:</strong> To protect our users from fraud or harm</li>
              </ul>
              
              <Separator className="my-6" />
              
              <h3 className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                5. Your Rights and Choices
              </h3>
              <ul>
                <li><strong>Profile Control:</strong> Manage visibility and privacy settings</li>
                <li><strong>Communication:</strong> Control who can contact you</li>
                <li><strong>Data Access:</strong> Request a copy of your personal data</li>
                <li><strong>Data Correction:</strong> Update or correct your information</li>
                <li><strong>Account Deletion:</strong> Request permanent account deletion</li>
                <li><strong>Marketing Communications:</strong> Opt-out of promotional emails</li>
              </ul>
              
              <Separator className="my-6" />
              
              <h3 className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                6. Data Security
              </h3>
              <p>
                We implement comprehensive security measures including encryption, secure servers, access controls, and regular security audits. While we strive to protect your information, no method of transmission or storage is completely secure.
              </p>
              
              <Separator className="my-6" />
              
              <h3 className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                7. Data Retention
              </h3>
              <p>
                We retain your information as long as your account is active or as needed to provide services. Even after account deletion, we may retain certain information for legal, safety, or legitimate business purposes for up to 7 years.
              </p>
              
              <Separator className="my-6" />
              
              <h3 className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                8. Age Restrictions
              </h3>
              <p>
                Our services are intended for individuals 18 years and older. We do not knowingly collect information from minors under 18.
              </p>
              
              <Separator className="my-6" />
              
              <h3 className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                9. Policy Updates
              </h3>
              <p>
                We may update this Privacy Policy periodically. Significant changes will be communicated through email or platform notifications. Your continued use of our services constitutes acceptance of the updated policy.
              </p>
              
              <Separator className="my-6" />
              
              <h3 className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                10. Contact Information
              </h3>
              <p>
                For privacy-related questions or concerns, contact our Data Protection Officer at:
              </p>
              <ul>
                <li><strong>Email:</strong> privacy@nikahsufiyana.com</li>
                <li><strong>Phone:</strong> +91-9876543210</li>
                <li><strong>Address:</strong> Hyderabad, Telangana, India</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-amber-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className={`${elMessiri.className} text-4xl font-bold mb-6`}>
            Questions About Your Privacy?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Our privacy team is here to help. Contact us anytime for clarifications about how we protect your information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg">
              <Mail className="mr-2 h-5 w-5" />
              Contact Privacy Team
            </Button>
            <Link href="/privacy-features">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg">
                <Shield className="mr-2 h-5 w-5" />
                View Privacy Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
