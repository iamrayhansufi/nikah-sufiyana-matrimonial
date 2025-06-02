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
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0 animate-scale-in">
      <CardHeader className="text-center pb-4">
        <div className="w-12 h-12 mx-auto mb-3 gradient-primary rounded-full flex items-center justify-center">
          <Heart className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl font-heading text-gray-800">Start Your Journey</CardTitle>
        <p className="text-sm text-gray-600 font-body">Find your perfect Islamic match</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 font-body">
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
            <Label htmlFor="lookingFor" className="text-sm font-medium text-gray-700 font-body">
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
            <Label htmlFor="mobile" className="text-sm font-medium text-gray-700 font-body">
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
            className="w-full gradient-primary text-white btn-hover font-body font-medium"
            size="lg"
          >
            Create My Profile
          </Button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-4 font-body">
          By registering, you agree to our Terms & Privacy Policy
        </p>
      </CardContent>
    </Card>
  )
}