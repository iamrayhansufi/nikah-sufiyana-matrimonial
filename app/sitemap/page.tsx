'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Star, Globe, Settings, Shield, MessageCircle, Calendar, CreditCard, Bell, HelpCircle, FileText, Mail } from 'lucide-react';

export default function SitemapPage() {
  const siteMapSections = [
    {
      title: "Main Pages",
      icon: <Globe className="w-5 h-5" />,
      pages: [
        { name: "Home", href: "/", description: "Welcome to Nikah Sufiyana" },
        { name: "About Us", href: "/about", description: "Our story and mission" },
        { name: "Contact", href: "/contact", description: "Get in touch with us" },
        { name: "Success Stories", href: "/success-stories", description: "Real love stories from our members" },
        { name: "Blog", href: "/blog", description: "Articles and insights on matrimony" },
      ]
    },
    {
      title: "Browse & Search",
      icon: <Users className="w-5 h-5" />,
      pages: [
        { name: "Browse Profiles", href: "/browse", description: "Discover potential matches" },
        { name: "Profile View", href: "/profile", description: "View detailed profiles" },
        { name: "Shortlist", href: "/shortlist", description: "Your saved profiles" },
        { name: "Interests", href: "/interests", description: "Manage interest requests" },
      ]
    },
    {
      title: "Account Management",
      icon: <Settings className="w-5 h-5" />,
      pages: [
        { name: "Register", href: "/register", description: "Create your account" },
        { name: "Login", href: "/login", description: "Access your account" },
        { name: "Dashboard", href: "/dashboard", description: "Your personal dashboard" },
        { name: "Edit Profile", href: "/edit-profile", description: "Update your information" },
        { name: "Settings", href: "/settings", description: "Account preferences" },
        { name: "Reset Password", href: "/reset-password", description: "Change your password" },
        { name: "Forgot Password", href: "/forgot-password", description: "Recover your account" },
        { name: "Verify Email", href: "/verify-email", description: "Email verification" },
      ]
    },
    {
      title: "Communication",
      icon: <MessageCircle className="w-5 h-5" />,
      pages: [
        { name: "Messages", href: "/messages", description: "Private conversations" },
        { name: "Notifications", href: "/notifications", description: "Stay updated" },
      ]
    },
    {
      title: "Services",
      icon: <Star className="w-5 h-5" />,
      pages: [
        { name: "Services", href: "/services", description: "Our matrimonial services" },
        { name: "Wedding Services", href: "/wedding-services", description: "Complete wedding solutions" },
        { name: "Premium", href: "/premium", description: "Premium membership benefits" },
        { name: "Events", href: "/events", description: "Matrimonial events and gatherings" },
      ]
    },
    {
      title: "Payment & Billing",
      icon: <CreditCard className="w-5 h-5" />,
      pages: [
        { name: "Payment", href: "/payment", description: "Secure payment processing" },
        { name: "Success", href: "/success", description: "Payment confirmation" },
      ]
    },
    {
      title: "Support & Legal",
      icon: <Shield className="w-5 h-5" />,
      pages: [
        { name: "Help Center", href: "/help", description: "Get assistance and support" },
        { name: "FAQ", href: "/faq", description: "Frequently asked questions" },
        { name: "Safety Guidelines", href: "/safety", description: "Stay safe while connecting" },
        { name: "Privacy Policy", href: "/privacy", description: "How we protect your data" },
        { name: "Privacy Features", href: "/privacy-features", description: "Control your privacy" },
        { name: "Terms of Service", href: "/terms", description: "Terms and conditions" },
      ]
    },
    {
      title: "Admin",
      icon: <Settings className="w-5 h-5" />,
      pages: [
        { name: "Admin Dashboard", href: "/admin", description: "Administrative access" },
        { name: "Admin Login", href: "/admin/login", description: "Admin authentication" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Royal Header */}
      <div className="bg-gradient-to-r from-purple-900 via-red-900 to-pink-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <Globe className="w-12 h-12 text-gold-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gold-400 to-rose-400 bg-clip-text text-transparent">
            Sacred Sitemap
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Navigate through all pages of Nikah Sufiyana with ease. Find exactly what you're looking for.
          </p>
        </div>
      </div>

      {/* Sitemap Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteMapSections.map((section, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-purple-900 group-hover:text-purple-700 transition-colors">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg group-hover:from-purple-200 group-hover:to-pink-200 transition-all">
                    {section.icon}
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.pages.map((page, pageIndex) => (
                    <div key={pageIndex} className="group/item">
                      <Link 
                        href={page.href}
                        className="block p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-100 hover:border-purple-200 transition-all duration-200 hover:shadow-md"
                      >
                        <div className="font-semibold text-purple-800 group-hover/item:text-purple-900 mb-1">
                          {page.name}
                        </div>
                        <div className="text-sm text-purple-600 group-hover/item:text-purple-700">
                          {page.description}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Links Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900 to-pink-900 text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                <Heart className="w-6 h-6 text-rose-400" />
                Quick Actions
                <Heart className="w-6 h-6 text-rose-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link 
                  href="/register"
                  className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 hover:shadow-lg backdrop-blur-sm border border-white/20"
                >
                  <Users className="w-8 h-8 mx-auto mb-2 text-rose-400" />
                  <div className="font-semibold">Join Now</div>
                </Link>
                <Link 
                  href="/browse"
                  className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 hover:shadow-lg backdrop-blur-sm border border-white/20"
                >
                  <Heart className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                  <div className="font-semibold">Find Love</div>
                </Link>
                <Link 
                  href="/contact"
                  className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 hover:shadow-lg backdrop-blur-sm border border-white/20"
                >
                  <Mail className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <div className="font-semibold">Contact Us</div>
                </Link>
                <Link 
                  href="/help"
                  className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 hover:shadow-lg backdrop-blur-sm border border-white/20"
                >
                  <HelpCircle className="w-8 h-8 mx-auto mb-2 text-gold-400" />
                  <div className="font-semibold">Get Help</div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 border border-purple-200">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-purple-700 mb-6 max-w-2xl mx-auto">
              Our support team is here to help you navigate your journey to finding your perfect match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                Contact Support
              </Link>
              <Link 
                href="/help"
                className="inline-flex items-center gap-2 bg-white border-2 border-purple-300 hover:border-purple-400 text-purple-700 hover:text-purple-800 px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:shadow-lg"
              >
                <HelpCircle className="w-5 h-5" />
                Visit Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
