"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, User, Phone } from "lucide-react"
import { elMessiri } from "@/app/lib/fonts"
import Image from "next/image"

export function HeroRegistrationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    lookingFor: "",
    countryCode: "+91",
    mobileNumber: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Store in localStorage for pre-filling on the register page
    localStorage.setItem("heroRegistrationData", JSON.stringify(formData))
    // Redirect to register page
    router.push("/register")
  }

  return (
    <div className="relative w-full px-4 sm:px-8 md:px-16 lg:px-24 py-8">
      <Card className="w-full bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-xl lg:rounded-2xl">
        <CardHeader className="text-center pb-3 lg:pb-4 pt-4 lg:pt-6 px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mx-auto mb-3 lg:mb-4 bg-gradient-to-br from-royal-primary to-royal-primary/80 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
          </div>
          <CardTitle className={`${elMessiri.className} text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800`}>
            Quick Registration
          </CardTitle>
          <p className="text-sm sm:text-base text-gray-600">Find your perfect match today</p>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 lg:px-6 xl:px-8 pb-6 lg:pb-8 w-full">
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5 w-full">
            {/* Row 1: Full Name & Looking For side by side on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 w-full">
              <div>
                <Label htmlFor="fullName" className="text-sm sm:text-base font-medium text-gray-700 text-left block">
                  Full Name
                </Label>
                <div className="relative mt-1.5 lg:mt-2">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7 text-gray-400" />
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Your full name"
                    className="pl-9 sm:pl-11 py-2.5 lg:py-3 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lookingFor" className="text-sm sm:text-base font-medium text-gray-700 text-left block">
                  Looking for
                </Label>
                <Select
                  value={formData.lookingFor}
                  onValueChange={(value) => setFormData({ ...formData, lookingFor: value })}
                >
                  <SelectTrigger className="mt-1.5 lg:mt-2 py-2.5 lg:py-3 text-sm sm:text-base">
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bride">Bride</SelectItem>
                    <SelectItem value="groom">Groom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Mobile Number - Full Width */}
            <div>
              <Label htmlFor="mobile" className="text-sm sm:text-base font-medium text-gray-700 text-left block">
                WhatsApp Number
              </Label>
              <div className="flex mt-1.5 lg:mt-2 space-x-2 lg:space-x-3">
                <Select
                  value={formData.countryCode}
                  onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
                >
                  <SelectTrigger className="w-20 sm:w-24 py-2.5 lg:py-3 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    <SelectItem value="+971">🇦🇪 +971</SelectItem>
                    <SelectItem value="+966">🇸🇦 +966</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    id="mobile"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    placeholder="WhatsApp number"
                    className="pl-9 sm:pl-11 py-2.5 lg:py-3 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full gradient-primary text-white font-semibold py-3 lg:py-4 text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <Heart className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
              Register Free Today
            </Button>
          </form>
          <p className={`text-xs sm:text-sm text-center text-gray-500 mt-3 lg:mt-4 ${elMessiri.className}`}>
            By registering, you agree to our Terms & Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}