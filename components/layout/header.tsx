"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Menu, Moon, Sun, Heart, MessageCircle, User, Home, Search, Globe, Bell, Star } from "lucide-react"
import { useTheme } from "next-themes"
import { MarqueeBanner } from "@/components/marquee-banner"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useNotifications } from "@/hooks/notification-provider"
import { elMessiri } from "@/app/lib/fonts"
import { useLanguage, SUPPORTED_LANGUAGES } from "@/lib/language-context"
import { LanguageSelector } from "@/components/language-selector"

interface UserNotification {
  id: string | number;
  type: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { currentLanguage, setLanguage: changeLanguage, isTranslating } = useLanguage()
  // Use the new notifications hook
  const { notifications, unreadCount, markAsRead, enableAudio } = useNotifications()

  const isLoggedIn = status === "authenticated" && !!session
  const user = session?.user
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Browse Profiles", href: "/browse" },
    { name: "Our Services", href: "/services" },
    { name: "Premium", href: "/premium" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const handleLanguageChange = (value: string) => {
    changeLanguage(value as keyof typeof SUPPORTED_LANGUAGES)
  }
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }
    const handleOpenNotifications = (open: boolean) => {
    setNotificationsOpen(open);
    // Enable audio when user interacts with notifications
    if (open) {
      enableAudio();
    }
  };    const handleNotificationClick = async (notification: UserNotification) => {
    try {
      console.log('Notification clicked:', {
        id: notification.id,
        type: notification.type,
        link: notification.link,
        message: notification.message
      });
      
      // Mark the notification as read using the hook
      await markAsRead(notification.id);
      
      // Close the notification popover first
      setNotificationsOpen(false);
      
      // Navigate to the relevant page if there's a link
      if (notification.link) {
        console.log('Navigating to:', notification.link);
          // Use a small delay to ensure the popover closes first
        setTimeout(() => {
          router.push(notification.link!);
        }, 100);
      } else {
        console.log('No link found in notification');
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  if (!mounted) return null
  return (
    <>
      <MarqueeBanner />
      <header className="sticky top-0 z-50 w-full border-b border-royal-primary/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-md">        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 hover-lift logo-shine">
              <Image 
                src="/Nikah-Sufiyana-Logo.svg"
                alt="Nikah Sufiyana" 
                width={220} 
                height={60}
                className="h-14 w-auto transition-transform duration-300"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${elMessiri.className} nav-menu-item font-medium transition-all duration-300 hover:text-royal-primary relative group`}
                >
                  <span className="relative z-10">
                    {currentLanguage === "en" ? item.name : (
                      <span className="font-arabic" style={{ fontFamily: "Jameel Noori Nastaleeq, serif" }}>
                        {item.name === "Home" ? "ہوم" : 
                         item.name === "Browse Profiles" ? "پروفائل دیکھیں" :
                         item.name === "Our Services" ? "ہماری خدمات" : 
                         item.name === "Premium" ? "پریمیم" :
                         item.name === "About Us" ? "ہمارے بارے میں" : "رابطہ کریں"}
                      </span>
                    )}
                  </span>
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-royal-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Selector */}
              <LanguageSelector variant="desktop" />              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Notifications */}
              {isLoggedIn && (
                <Popover open={notificationsOpen} onOpenChange={handleOpenNotifications}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80 p-0">
                    <div className="p-3 border-b">
                      <h4 className="font-medium">Notifications</h4>
                    </div>                    <div className="max-h-[300px] overflow-auto">                      {notifications.slice(0, 10).length > 0 ? (
                        notifications.slice(0, 10).map((notification, index: number) => (
                          <div 
                            key={notification.id || index}
                            className={`p-3 border-b text-lg cursor-pointer hover:bg-muted transition-colors ${!notification.read ? 'bg-muted/50' : ''}`}
                            onClick={() => handleNotificationClick(notification)}
                          >                            <div className="flex items-start">
                              {notification.type === 'interest' && (
                                <Heart className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                              )}                              {notification.type === 'interest_accepted' && (
                                <Heart className="h-4 w-4 text-red-500 mt-0.5 mr-2 fill-red-500 flex-shrink-0" />
                              )}
                              {notification.type === 'interest_declined' && (
                                <Heart className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                              )}                              {notification.type === 'match' && (
                                <Heart className="h-4 w-4 text-red-500 mt-0.5 mr-2 fill-red-500 flex-shrink-0" />
                              )}                              {notification.type === 'message' && (
                                <MessageCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                              )}
                              {notification.type === 'premium' && (
                                <Star className="h-4 w-4 text-red-500 mt-0.5 mr-2 fill-red-500 flex-shrink-0" />
                              )}
                              <div>
                                <p className="text-muted-foreground">{notification.message}</p>                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(notification.createdAt).toLocaleString()}
                                  {(notification as any).link && <span className="ml-2 text-red-500">• Click to view</span>}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center">
                          <p className="text-muted-foreground">No notifications</p>
                        </div>
                      )}
                    </div>
                    <div className="p-2 border-t text-center">
                      <Link href="/notifications" className="text-xs text-primary hover:underline" onClick={() => setNotificationsOpen(false)}>
                        View all notifications
                      </Link>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="font-body flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {user?.name || "My Account"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/edit-profile">Edit Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="font-body">
                      {currentLanguage === "en" ? "Sign In" : <span className="font-arabic">لاگ ان</span>}
                    </Button>
                  </Link>                  <Link href="/register">
                    <Button className="royal-shine-button text-white btn-hover font-body">
                      {currentLanguage === "en" ? "Register Now" : <span className="font-arabic">رجسٹر کریں</span>}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                  <div className="py-4 flex flex-col h-full">
                    <div className="flex items-center mb-6">                      <Image 
                        src="/Nikah-Sufiyana-Logo.svg" 
                        alt="Nikah Sufiyana" 
                        width={156} 
                        height={45}
                        className="h-10 w-auto"
                      />
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-2 py-2 text-base font-medium rounded-md hover:bg-muted transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {currentLanguage === "en" ? item.name : (
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
                    </div>
                    
                    {/* Language Selector */}
                    <div className="mb-6 px-2">
                      <p className="text-lg mb-2 font-medium">Language</p>
                      <LanguageSelector variant="mobile" />
                    </div>
                    
                    {/* Theme Toggle */}
                    <div className="mb-6 px-2">
                      <p className="text-lg mb-2 font-medium">Theme</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      >
                        {theme === "dark" ? (
                          <>
                            <Sun className="h-4 w-4" />
                            <span>Light Mode</span>
                          </>
                        ) : (
                          <>
                            <Moon className="h-4 w-4" />
                            <span>Dark Mode</span>
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* Authentication */}
                    <div className="mt-auto px-2">
                      {isLoggedIn ? (
                        <div className="space-y-3">
                          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full justify-start gap-2">
                              <User className="h-4 w-4" />
                              Dashboard
                            </Button>
                          </Link>                          <Button 
                            variant="default" 
                            className="w-full royal-shine-button text-white" 
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full font-body">
                              {currentLanguage === "en" ? "Sign In" : <span className="font-arabic">لاگ ان</span>}
                            </Button>
                          </Link>                          <Link href="/register" onClick={() => setIsOpen(false)}>
                            <Button className="w-full royal-shine-button text-white font-body">
                              {currentLanguage === "en" ? "Register Now" : <span className="font-arabic">رجسٹر کریں</span>}
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
