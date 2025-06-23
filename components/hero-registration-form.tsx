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
    <div className="relative w-full">
      <Card className="w-full bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
        <CardHeader className="text-center pb-4 pt-6 px-4 sm:px-6 lg:px-8">
          <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-royal-primary to-royal-primary/80 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <CardTitle className={`${elMessiri.className} text-2xl lg:text-3xl font-bold text-gray-800`}>
            Quick Registration
          </CardTitle>
          <p className="text-base text-gray-600">Find your perfect match today</p>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 lg:px-8 pb-8 w-full">
          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            {/* Row 1: Full Name & Looking For side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <Label htmlFor="fullName" className="text-base font-medium text-gray-700">
                  Full Name
                </Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Your full name"
                    className="pl-11 py-3 text-base"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lookingFor" className="text-base font-medium text-gray-700">
                  Looking for
                </Label>
                <Select
                  value={formData.lookingFor}
                  onValueChange={(value) => setFormData({ ...formData, lookingFor: value })}
                >
                  <SelectTrigger className="mt-2 py-3 text-base">
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
              <Label htmlFor="mobile" className="text-base font-medium text-gray-700">
                WhatsApp Number
              </Label>
              <div className="flex mt-2 space-x-3">
                <Select
                  value={formData.countryCode}
                  onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
                >
                  <SelectTrigger className="w-24 py-3 text-sm">
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
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="mobile"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    placeholder="WhatsApp number"
                    className="pl-11 py-3 text-base"
                    required
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full gradient-primary text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <Heart className="mr-2 h-5 w-5" />
              Register Free Today
            </Button>
          </form>
          <p className={`text-sm text-center text-gray-500 mt-4 ${elMessiri.className}`}>
            By registering, you agree to our Terms & Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}