import Link from "next/link"
import Image from "next/image"
import { Heart, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Download, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { elMessiri } from "@/app/lib/fonts"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-royal-primary to-royal-primary/90 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[url('/islamic-pattern-light.png')] opacity-10"></div>
            
      {/* Newsletter Section */}
      <div className="border-b border-white/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <Image
                src="/Nikah-Sufiyana-Icon-white-01.svg"
                alt="Nikah Sufiyana Icon"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </div>
            <h3 className={`${elMessiri.className} text-3xl font-bold mb-4`}>
              Join Our Royal Newsletter
            </h3>
            <p className="text-white/90 mb-6 text-lg">
              Receive blessed updates on new profiles, success stories, and exclusive matrimonial events
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email for blessings" 
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30" 
              />
              <Button className="bg-white text-royal-primary hover:bg-white/90 font-semibold">
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2 hover-lift">
              <Image
                alt="Nikah Sufiyana"
                height="48"
                width="215"
                src="/Nikah-Sufiyana-Logo.svg"
                className="h-12 w-auto filter brightness-0 invert"
              />
            </Link>
            <p className="text-lg text-white/90 max-w-md leading-relaxed">
              <strong className={`${elMessiri.className} text-lg`}>Nikah Sufiyana</strong> - India's most trusted Islamic matrimonial platform, where hearts unite through divine blessing. We combine sacred Islamic values with modern technology to create meaningful, halal connections that lead to blessed marriages.
            </p>
            
            {/* SVG Border */}
            <div className="flex justify-start">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={150}
                height={8}
                className="opacity-60 filter brightness-0 invert"
              />
            </div>
            
            <div className="flex gap-4">
              <Link href="https://facebook.com" target="_blank" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" target="_blank" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" target="_blank" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://youtube.com" target="_blank" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Sacred Links */}
          <div className="space-y-4">
            <h3 className={`${elMessiri.className} font-bold text-lg flex items-center gap-2`}>
              <Sparkles className="h-5 w-5" />
              Sacred Links
            </h3>
            <ul className="space-y-3 text-lg">
              <li>
                <Link href="/browse" className="hover:text-white/70 transition-colors duration-300 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Browse Blessed Profiles
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white/70 transition-colors duration-300">
                  About Our Sacred Mission
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white/70 transition-colors duration-300">
                  Royal Services
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

          {/* Blessed Support */}
          <div className="space-y-4">
            <h3 className={`${elMessiri.className} font-bold text-lg flex items-center gap-2`}>
              <Heart className="h-5 w-5" />
              Blessed Support
            </h3>
            <ul className="space-y-3 text-lg">
              <li>
                <Link href="/contact" className="hover:text-white/70 transition-colors duration-300">
                  Contact Sacred Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white/70 transition-colors duration-300">
                  Divine Guidance (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white/70 transition-colors duration-300">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white/70 transition-colors duration-300">
                  Privacy & Sacred Trust
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white/70 transition-colors duration-300">
                  Terms of Sacred Service
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-white/70 transition-colors duration-300">
                  Safety & Protection
                </Link>
              </li>
            </ul>
          </div>

          {/* Royal Contact */}
          <div className="space-y-4">
            <h3 className={`${elMessiri.className} font-bold text-lg flex items-center gap-2`}>
              <Image
                src="/Nikah-Sufiyana-Icon-white-01.svg"
                alt="Nikah Sufiyana Icon"
                width={20}
                height={20}
                className="h-5 w-5"
              />
              Royal Contact
            </h3>
            <div className="space-y-4 text-lg">
              <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg">
                <Phone className="h-5 w-5 text-white" />
                <div>
                  <span className="font-semibold">+91 98765 43210</span>
                  <p className="text-white/80 text-xs">24/7 Sacred Helpline</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg">
                <Mail className="h-5 w-5 text-white" />
                <div>
                  <span className="font-semibold">blessings@nikahsufiyana.com</span>
                  <p className="text-white/80 text-xs">Royal Support Email</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
                <div>
                  <span className="font-semibold">Mumbai, India</span>
                  <p className="text-white/80 text-xs">Sacred Headquarters</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={200}
                height={8}
                className="opacity-60 filter brightness-0 invert"
              />
            </div>
            <p className={`${elMessiri.className} text-lg mb-2`}>
              <strong>© {new Date().getFullYear()} Nikah Sufiyana</strong> - Where Sacred Hearts Unite
            </p>
            <p className="text-white/80 text-lg mb-4">
              Made with <Heart className="inline h-4 w-4 text-red-300" /> for the blessed Muslim Ummah | 
              <Link href="/sitemap" className="hover:text-white/70 ml-1">Sacred Sitemap</Link>
            </p>
            <p className="text-white/60 text-xs">
              "And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them" - Quran 30:21
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
