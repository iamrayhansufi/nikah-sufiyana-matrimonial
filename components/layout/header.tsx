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
import { useNotifications } from "@/hooks/use-notifications"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState("en")
  const [mounted, setMounted] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
    // Use the new notifications hook
  const { notifications, unreadCount, markAsRead, enableAudio } = useNotifications()

  const isLoggedIn = status === "authenticated" && !!session
  const user = session?.user
  
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
    }  }, [language])
  
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
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }
    const handleOpenNotifications = (open: boolean) => {
    setNotificationsOpen(open);
    // Enable audio when user interacts with notifications
    if (open) {
      enableAudio();
    }
  };
  
  const handleNotificationClick = async (notification: any) => {
    try {
      // Mark the notification as read using the hook
      await markAsRead(notification.id);
      
      // Navigate to the relevant page if there's a link
      if (notification.link) {
        setNotificationsOpen(false);
        router.push(notification.link);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  if (!mounted) return null

  return (
    <>
      <MarqueeBanner />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">              <Image 
                src="/Nikah-Sufiyana-Logo.svg"
                alt="Nikah Sufiyana" 
                width={150} 
                height={40}
                className="h-10 w-auto"
                priority
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
              </Select>              <Button
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
                    </div>                    <div className="max-h-[300px] overflow-auto">
                      {notifications.slice(0, 10).length > 0 ? (
                        notifications.slice(0, 10).map((notification, index) => (
                          <div 
                            key={notification.id || index}
                            className={`p-3 border-b text-sm cursor-pointer hover:bg-muted transition-colors ${!notification.read ? 'bg-muted/50' : ''}`}
                            onClick={() => handleNotificationClick(notification)}
                          >                            <div className="flex items-start">
                              {notification.type === 'interest' && (
                                <Heart className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                              )}                              {notification.type === 'interest_accepted' && (
                                <Heart className="h-4 w-4 text-green-500 mt-0.5 mr-2 fill-green-500 flex-shrink-0" />
                              )}
                              {notification.type === 'interest_declined' && (
                                <Heart className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                              )}
                              {notification.type === 'match' && (
                                <Heart className="h-4 w-4 text-pink-500 mt-0.5 mr-2 fill-pink-500 flex-shrink-0" />
                              )}
                              {notification.type === 'message' && (
                                <MessageCircle className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                              )}
                              {notification.type === 'premium' && (
                                <Star className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 fill-yellow-500 flex-shrink-0" />
                              )}
                              <div>
                                <p className="text-muted-foreground">{notification.message}</p>                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(notification.createdAt).toLocaleString()}
                                  {(notification as any).link && <span className="ml-2 text-blue-500">• Click to view</span>}
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
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
                    <div className="flex items-center mb-6">
                      <Image 
                        src="/Nikah-Sufiyana-Logo.svg" 
                        alt="Nikah Sufiyana" 
                        width={120} 
                        height={35}
                        className="h-8 w-auto"
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
                    </div>
                    
                    {/* Language Selector */}
                    <div className="mb-6 px-2">
                      <p className="text-sm mb-2 font-medium">Language</p>
                      <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-full">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span>{language === "en" ? "English" : "اردو"}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                          <SelectItem value="ur">Urdu اردو</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Theme Toggle */}
                    <div className="mb-6 px-2">
                      <p className="text-sm mb-2 font-medium">Theme</p>
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
                          </Link>
                          <Button 
                            variant="default" 
                            className="w-full gradient-primary text-white" 
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
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
