"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, UserCheck, Bell, MessageSquare, CheckCircle } from "lucide-react"
import { playfair } from "../lib/fonts"

export default function PrivacyFeaturesPage() {
  const features = [
    {
      icon: Shield,
      title: "Profile Privacy Controls",
      description: "Control who can view your profile information and photos",
      details: [
        "Hide contact information",
        "Blur profile photos",
        "Control profile visibility",
        "Manage who can message you",
      ],
    },
    {
      icon: Lock,
      title: "Data Protection",
      description: "Your personal information is securely stored and protected",
      details: [
        "End-to-end encryption",
        "Secure data storage",
        "Regular security audits",
        "GDPR compliance",
      ],
    },
    {
      icon: Eye,
      title: "Photo Privacy",
      description: "Advanced photo privacy settings for your security",      details: [
        "Watermarking options",
        "Photo access control",
        "Selective photo sharing",
        "Privacy controls",
      ],
    },
    {
      icon: UserCheck,
      title: "Profile Verification",
      description: "Verified profiles for enhanced security and trust",
      details: [
        "ID verification",
        "Document validation",
        "Profile authenticity check",
        "Verified badge display",
      ],
    },
    {
      icon: Bell,
      title: "Privacy Notifications",
      description: "Stay informed about your privacy settings and profile views",
      details: [
        "Profile view alerts",
        "Privacy setting reminders",
        "Unauthorized access alerts",
        "Regular privacy reports",
      ],
    },
    {
      icon: MessageSquare,
      title: "Secure Communication",
      description: "Safe and private communication channels",
      details: [
        "Private messaging",
        "Contact info protection",
        "Spam prevention",
        "Block unwanted contacts",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-royal-gradient dark:from-gray-950 dark:to-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className={`${playfair.className} text-4xl font-bold text-center mb-4`}>Privacy Features</h1>
          <p className="text-center text-muted-foreground mb-12">
            Your privacy and security are our top priority. Explore our comprehensive privacy features designed to protect your personal information.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h2 className={`${playfair.className} text-2xl font-semibold mb-4`}>{feature.title}</h2>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-red-500" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 