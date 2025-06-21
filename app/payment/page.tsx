"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Heart } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { playfair } from "../lib/fonts"

export default function PaymentPage() {
  const plans = [
    {
      name: "Basic",
      price: "₹1,999",
      duration: "3 months",
      popular: false,
      features: [
        "View up to 50 profiles",
        "Send 10 interests per month",
        "Basic profile visibility",
        "Email support",
        "Profile verification",
        "Basic search filters",
      ],
    },
    {
      name: "Premium",
      price: "₹4,499",
      duration: "6 months",
      popular: true,
      features: [
        "Unlimited profile views",
        "Unlimited interests",
        "Priority profile visibility",
        "See who viewed your profile",
        "Advanced search filters",
        "WhatsApp & phone support",
        "Profile highlighting",
        "Video call feature",
        "Dedicated relationship manager",
        "Success guarantee*",
      ],
    },
  ]

  const additionalServices = [
    {
      name: "Wedding Photography",
      price: "₹25,000 - ₹75,000",
      description: "Professional wedding photography packages",
    },
    {
      name: "Wedding Invitations",
      price: "₹5,000 - ₹15,000",
      description: "Custom Islamic wedding invitation designs",
    },
    {
      name: "Event Planning",
      price: "₹50,000 - ₹2,00,000",
      description: "Complete wedding and nikah ceremony planning",
    },
    {
      name: "Catering Services",
      price: "₹500 - ₹1,500 per person",
      description: "Halal catering for wedding events",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`${playfair.className} text-4xl font-bold mb-4`}>Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find your perfect match with our premium matrimonial services. Choose the plan that best suits your needs.
            </p>
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="mb-4">
                    {plan.name === "Premium" ? (
                      <Image
                        src="/Nikah-Sufiyana-Icon-white-01.svg"
                        alt="Nikah Sufiyana Icon"
                        width={48}
                        height={48}
                        className="h-12 w-12 mx-auto"
                      />
                    ) : (
                      <Heart className="h-12 w-12 mx-auto text-primary" />
                    )}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-primary mb-2">{plan.price}</div>
                  <p className="text-muted-foreground">for {plan.duration}</p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <span className="text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.popular ? "gradient-emerald text-white" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    Choose {plan.name}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    {plan.name === "Premium" && "* Success guarantee: Get 6 months free if you don't find a match"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Methods */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center">Secure Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <span className="text-lg">Visa</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    MC
                  </div>
                  <span className="text-lg">Mastercard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    UPI
                  </div>
                  <span className="text-lg">UPI</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    GPay
                  </div>
                  <span className="text-lg">Google Pay</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-8 bg-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                    PPay
                  </div>
                  <span className="text-lg">PhonePe</span>
                </div>
              </div>
              <p className="text-center text-lg text-muted-foreground mt-4">
                All payments are secured with 256-bit SSL encryption
              </p>
            </CardContent>
          </Card>

          {/* Additional Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Additional Wedding Services</CardTitle>
              <p className="text-center text-muted-foreground">
                Complete your wedding journey with our trusted partners
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {additionalServices.map((service, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{service.name}</h4>
                    <p className="text-lg text-muted-foreground mb-2">{service.description}</p>
                    <p className="font-semibold text-primary">{service.price}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Learn More
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold mb-2">Is my payment secure?</h4>
                <p className="text-lg text-muted-foreground">
                  Yes, all payments are processed through secure payment gateways with 256-bit SSL encryption.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Can I cancel my subscription?</h4>
                <p className="text-lg text-muted-foreground">
                  Yes, you can cancel anytime. Refunds are available as per our refund policy.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">What if I don't find a match?</h4>
                <p className="text-lg text-muted-foreground">
                  Premium members get our success guarantee - 6 months free if you don't find a suitable match.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">How do I upgrade my plan?</h4>
                <p className="text-lg text-muted-foreground">
                  You can upgrade anytime from your dashboard. The price difference will be adjusted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
