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
    <div className="relative">
      {/* Decorative SVG Border */}
      
      
      <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0 royal-shadow card-royal-shine">
        <CardHeader className="text-center pb-4 pt-8">
          <div className="w-16 h-16 mx-auto mb-4 royal-glow-effect rounded-full flex items-center justify-center shadow-lg">
            <Image
              src="/Nikah-Sufiyana-Icon-white-01.svg"
              alt="Nikah Sufiyana Icon"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </div>
          <CardTitle className={`${elMessiri.className} text-2xl font-bold text-gray-800 royal-text-shiny`}>
            Start Your Journey Today
          </CardTitle>
          <p className="text-lg text-gray-600">Find your perfect life partner with Islamic values</p>
          
          {/* SVG Border Under Title */}
          <div className="flex justify-center mt-3">
            <Image
              src="/sufiyana-border-ui.svg"
              alt="Decorative Border"
              width={250}
              height={20}
              className="opacity-40"
            />
          </div>
        </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-lg font-medium text-gray-700 font-body">
              Full Name
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="pl-10 font-body"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lookingFor" className="text-lg font-medium text-gray-700 font-body">
              Looking for
            </Label>
            <Select
              value={formData.lookingFor}
              onValueChange={(value) => setFormData({ ...formData, lookingFor: value })}
            >
              <SelectTrigger className="mt-1 font-body">
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bride">Bride</SelectItem>
                <SelectItem value="groom">Groom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="mobile" className="text-lg font-medium text-gray-700 font-body">
              WhatsApp Mobile Number
            </Label>
            <div className="flex mt-1 space-x-2">
              <Select
                value={formData.countryCode}
                onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
              >
                <SelectTrigger className="w-20 font-body">
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
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="mobile"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  placeholder="Enter WhatsApp number"
                  className="pl-10 font-body"
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full royal-shine-button text-white font-semibold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            <Image
              src="/Nikah-Sufiyana-Icon-white-01.svg"
              alt="Nikah Sufiyana Icon"
              width={20}
              height={20}
              className="mr-2 h-5 w-5"
            />
            Register Free Today
          </Button>
        </form>

        <p className={`text-xs text-center text-gray-500 mt-4 ${elMessiri.className}`}>
          By registering, you agree to our Terms & Privacy Policy
        </p>
      </CardContent>
    </Card>
    </div>
  )
}