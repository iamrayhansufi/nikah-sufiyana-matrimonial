"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WhatsAppChat() {
  const handleWhatsAppClick = () => {
    const phoneNumber = "919876543210" // Replace with actual WhatsApp number
    const message = "Hi! I'm interested in Nikah Sufiyana matrimonial services."
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-4">
      <Button
        onClick={handleWhatsAppClick}
        className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  )
}
