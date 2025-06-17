import Link from "next/link"
import Image from "next/image"
import { Heart, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Download, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { playfair } from "@/app/lib/fonts"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-muted/50 to-muted/30 border-t relative overflow-hidden">
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 bg-[url('/islamic-pattern-light.png')] opacity-5"></div>
      
      {/* Newsletter Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className={`${playfair.className} text-2xl font-semibold mb-4`}>Join Our Newsletter</h3>
            <p className="text-muted-foreground mb-6">
              Stay updated with new profiles and success stories from our community
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Enter your email" className="flex-1" />
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                alt="Nikah Sufiyana"
                height="48"
                width="215"
                src="/Nikah-Sufiyana-Logo.svg"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-s">
              Nikah Sufiyana is India's premier Islamic matrimonial platform, dedicated to helping Muslims find their perfect life partner. We combine traditional Islamic values with modern technology to create meaningful connections. Our platform ensures a safe, secure, and halal environment for marriage-seeking individuals and their families. With thorough profile verification and dedicated support, we're committed to making your journey to finding a spouse both blessed and successful.
            </p>
            <div className="flex gap-4">
              <Link href="https://facebook.com" target="_blank" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" target="_blank" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" target="_blank" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://youtube.com" target="_blank" className="hover:text-primary">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className={`${playfair.className} font-semibold`}>Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/browse" className="hover:text-primary">
                  Browse Profiles
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="hover:text-primary">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-primary">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary">
                  Islamic Marriage Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className={`${playfair.className} font-semibold`}>Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-primary">
                  Safety Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className={`${playfair.className} font-semibold`}>Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@nikahsufiyana.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Mumbai, India</span>
              </div>
              <div className="pt-2">
                <p className="text-muted-foreground">
                  Office Hours:<br />
                  Mon - Sat: 9:00 AM - 7:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="text-center md:text-left">
              &copy; {new Date().getFullYear()} Nikah Sufiyana. All rights reserved.
            </div>
            <div className="text-center md:text-right">
              Made with ❤️ for the Muslim Ummah | <Link href="/sitemap" className="hover:text-primary">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
