 "use client"
 
 import { useState } from "react"
 import { useToast } from "@/components/ui/use-toast"
 import { playfair } from "../lib/fonts"
 import { Footer } from "@/components/layout/footer"
 import { Header } from "@/components/layout/header"
 import { Card, CardContent, CardHeader } from "@/components/ui/card"
 import { Input } from "@/components/ui/input"
 import { Button } from "@/components/ui/button"
 import { Label } from "@/components/ui/label"
 import Link from "next/link"
 import Image from "next/image"
 import { Mail, Phone, ArrowRight, Check } from "lucide-react"
 
 export default function ForgotPasswordPage() {
   const { toast } = useToast()
   const [resetMethod, setResetMethod] = useState<"email" | "phone">("email")
   const [formData, setFormData] = useState({
     email: "",
     phone: "",
   })
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [isSubmitted, setIsSubmitted] = useState(false)
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     setIsSubmitting(true)
 
     try {
       // Here you would implement the actual password reset request
       // For now, we'll simulate a successful request
       await new Promise(resolve => setTimeout(resolve, 1500))
       
       setIsSubmitted(true)
       toast({
         title: "Reset Link Sent",
         description: resetMethod === "email" 
           ? "Check your email for instructions to reset your password." 
           : "Check your phone for an SMS with instructions to reset your password.",
       })
     } catch (error) {
       console.error("Password reset error:", error)
       toast({
         title: "Request Failed",
         description: "Something went wrong. Please try again.",
         variant: "destructive",
       })
     } finally {
       setIsSubmitting(false)
     }
   }
 
   return (
     <div className="min-h-screen bg-cream-bg">
       <Header />
       <div className="container mx-auto px-4 py-16">
         <div className="max-w-md mx-auto">
           <Card>
             <CardHeader className="text-center">
               <div className="flex flex-col items-center justify-center mb-4">
                 <Image
                   src="/Nikah-Sufiyana-Logo.svg"
                   alt="Nikah Sufiyana"
                   width={180}
                   height={45}
                   className="mb-4"
                 />
                 <h1 className={`${playfair.className} text-2xl font-semibold`}>Forgot Password</h1>
               </div>
               <p className="text-muted-foreground">
                 {isSubmitted 
                   ? "We've sent you instructions to reset your password." 
                   : "Enter your email or phone number to reset your password"}
               </p>
             </CardHeader>
             
             <CardContent className="p-6">
               {!isSubmitted ? (
                 <form onSubmit={handleSubmit} className="space-y-6">
                   {/* Reset Method Toggle */}
                   <div className="flex rounded-lg border p-1">
                     <Button
                       type="button"
                       variant={resetMethod === "email" ? "default" : "ghost"}
                       className="flex-1"
                       onClick={() => setResetMethod("email")}
                     >
                       <Mail className="h-4 w-4 mr-2" />
                       Email
                     </Button>
                     <Button
                       type="button"
                       variant={resetMethod === "phone" ? "default" : "ghost"}
                       className="flex-1"
                       onClick={() => setResetMethod("phone")}
                     >
                       <Phone className="h-4 w-4 mr-2" />
                       Phone
                     </Button>
                   </div>
 
                   {/* Email/Phone Input */}
                   {resetMethod === "email" ? (
                     <div>
                       <Label htmlFor="email">Email Address</Label>
                       <Input
                         id="email"
                         type="email"
                         value={formData.email}
                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                         placeholder="your@email.com"
                         required
                       />
                     </div>
                   ) : (
                     <div>
                       <Label htmlFor="phone">Phone Number</Label>
                       <Input
                         id="phone"
                         type="tel"
                         value={formData.phone}
                         onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                         placeholder="+91 90146 33411"
                         required
                       />
                     </div>
                   )}
 
                   {/* Submit Button */}
                   <Button 
                     type="submit" 
                     className="w-full gradient-emerald text-white" 
                     size="lg"
                     disabled={isSubmitting}
                   >
                     {isSubmitting ? "Sending..." : "Send Reset Instructions"}
                   </Button>
                 </form>
               ) : (
                 <div className="space-y-6">
                   <div className="flex flex-col items-center justify-center py-6">
                     <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                       <Check className="h-8 w-8 text-green-600" />
                     </div>
                     <p className="text-center text-lg">
                       {resetMethod === "email" 
                         ? `We've sent a password reset link to ${formData.email}` 
                         : `We've sent a password reset code to ${formData.phone}`}
                     </p>
                   </div>
                   
                   <Button 
                     className="w-full" 
                     variant="outline"
                     onClick={() => setIsSubmitted(false)}
                   >
                     Try Another Method
                   </Button>
                 </div>
               )}
               
               <div className="mt-6 text-center">
                 <p className="text-lg text-muted-foreground">
                   Remember your password?{" "}
                   <Link href="/login" className="text-primary hover:underline font-medium">
                     Sign in
                   </Link>
                 </p>
               </div>
             </CardContent>
           </Card>
 
           {/* Help Section */}
           <div className="text-center mt-6">
             <p className="text-lg text-muted-foreground">
               Need help? Contact us at{" "}
               <a href="mailto:support@nikahsufiyana.com" className="text-primary hover:underline">
                 support@nikahsufiyana.com
               </a>
             </p>
           </div>
         </div>
       </div>
       <Footer />
     </div>
   )
 }