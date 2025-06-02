"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Menu, Moon, Sun, Heart, MessageCircle, User, Home, Search, Globe } from "lucide-react"
import { useTheme } from "next-themes"
import { MarqueeBanner } from "@/components/marquee-banner"
import Image from "next/image"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState("en")
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Apply RTL styling for Urdu
    if (language === "ur") {
      document.documentElement.dir = "rtl"
      document.documentElement.classList.add("rtl")
    } else {
      document.documentElement.dir = "ltr"
      document.documentElement.classList.remove("rtl")
    }
  }, [language])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Browse Profiles", href: "/browse" },
    { name: "Our Services", href: "/services" },
    { name: "Premium", href: "/premium" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
  }

  if (!mounted) return null

  return (
    <>
      <MarqueeBanner />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="http://suficreations.com/wp-content/uploads/2021/03/Nikah-Sufiyana-Logo-01.png"
                alt="Nikah Sufiyana" 
                width={130} 
                height={30} 
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary font-body"
                >
                  {language === "en" ? item.name : (
                    <span className="font-arabic" style={{ fontFamily: "Jameel Noori Nastaleeq, serif" }}>
                      {item.name === "Home" ? "ہوم" : 
                       item.name === "Browse Profiles" ? "پروفائل دیکھیں" :
                       item.name === "Our Services" ? "ہماری خدمات" : 
                       item.name === "Premium" ? "پریمیم" :
                       item.name === "About Us" ? "ہمارے بارے میں" : "رابطہ کریں"}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Selector */}
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-24 h-9">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-xs">{language === "en" ? "EN" : "اردو"}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="ur">Urdu اردو</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <Link href="/login">
                <Button variant="outline" className="font-body">
                  {language === "en" ? "Sign In" : <span className="font-arabic">لاگ ان</span>}
                </Button>
              </Link>
              <Link href="/register">
                <Button className="gradient-primary text-white btn-hover font-body">
                  {language === "en" ? "Register Now" : <span className="font-arabic">رجسٹر کریں</span>}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary font-body"
                      onClick={() => setIsOpen(false)}
                    >
                      {language === "en" ? item.name : (
                        <span className="font-arabic" style={{ fontFamily: "Jameel Noori Nastaleeq, serif" }}>
                          {item.name === "Home" ? "ہوم" : 
                           item.name === "Browse Profiles" ? "پروفائل دیکھیں" :
                           item.name === "Our Services" ? "ہماری خدمات" : 
                           item.name === "Premium" ? "پریمیم" :
                           item.name === "About Us" ? "ہمارے بارے میں" : "رابطہ کریں"}
                        </span>
                      )}
                    </Link>
                  ))}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center justify-between mb-4">
                      <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-32">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span className="text-xs">{language === "en" ? "English" : "اردو"}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                          <SelectItem value="ur">🇵🇰 اردو</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      </Button>
                    </div>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full font-body">
                        {language === "en" ? "Sign In" : <span className="font-arabic">لاگ ان</span>}
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full gradient-primary text-white font-body">
                        {language === "en" ? "Register Now" : <span className="font-arabic">رجسٹر کریں</span>}
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
          <div className="grid grid-cols-5 h-16">
            <Link href="/" className="flex flex-col items-center justify-center space-y-1">
              <Home className="h-5 w-5" />
              <span className="text-xs font-body">Home</span>
            </Link>
            <Link href="/browse" className="flex flex-col items-center justify-center space-y-1">
              <Search className="h-5 w-5" />
              <span className="text-xs font-body">Browse</span>
            </Link>
            <Link href="/dashboard" className="flex flex-col items-center justify-center space-y-1">
              <User className="h-5 w-5" />
              <span className="text-xs font-body">Profile</span>
            </Link>
            <Link href="/messages" className="flex flex-col items-center justify-center space-y-1">
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs font-body">Messages</span>
            </Link>
            <Link href="/menu" className="flex flex-col items-center justify-center space-y-1">
              <Menu className="h-5 w-5" />
              <span className="text-xs font-body">Menu</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}