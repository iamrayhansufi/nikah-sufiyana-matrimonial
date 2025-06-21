"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Heart, Sparkles } from "lucide-react"
import { elMessiri } from "../lib/fonts"
import { motion } from "framer-motion"
import Image from "next/image"

export default function MessagesPage() {
  return (    <div className="min-h-screen bg-royal-gradient">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className={`${elMessiri.className} text-4xl md:text-5xl font-bold text-royal-primary text-center mb-8`}>
            Sacred Sufiyana Messages
          </h1>
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
                {/* Contacts List */}
                <div className="border-r border-royal-primary/20">
                  <div className="p-4 bg-gradient-to-r from-royal-primary/5 to-royal-primary/10">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-royal-primary" />
                      <Input
                        placeholder="Search blessed conversations..."
                        className="pl-9 border-royal-primary/30 focus:border-royal-primary"
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-[528px]">
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`p-4 hover:bg-muted cursor-pointer ${
                            i === 1 ? "bg-muted" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src="/placeholder.svg?height=50&width=50"
                              alt="Profile"
                              className="w-12 h-12 rounded-full"
                            />                            <div className="flex-1 min-w-0">
                              <h3 className={`${elMessiri.className} font-semibold text-royal-primary truncate`}>Aisha Khan</h3>
                              <p className="text-sm text-gray-600 truncate">
                                Thank you for your interest...
                              </p>
                            </div>
                            <div className="text-xs text-muted-foreground">2m ago</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Chat Area */}
                <div className="col-span-2 flex flex-col">                  {/* Chat Header */}
                  <div className="p-4 border-b border-royal-primary/20 bg-gradient-to-r from-royal-primary/5 to-royal-primary/10">
                    <div className="flex items-center gap-3">
                      <img
                        src="/placeholder.svg?height=50&width=50"
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-royal-primary/30"
                      />
                      <div>
                        <h2 className={`${elMessiri.className} font-semibold text-royal-primary`}>Aisha Khan</h2>
                        <p className="text-sm text-emerald-600 font-medium">Online - Blessed to Connect</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                          <p>Assalamu alaikum, I liked your profile and would like to know more about you.</p>
                          <div className="text-xs text-muted-foreground mt-1">10:30 AM</div>
                        </div>
                      </div>                      <div className="flex justify-end">
                        <div className="bg-gradient-to-r from-royal-primary to-royal-primary/90 text-white rounded-lg p-3 max-w-[80%] shadow-lg">
                          <p>Walaikum assalam, thank you for your blessed interest. I would be honored to connect through this sacred platform.</p>
                          <div className="text-xs opacity-80 mt-1">10:32 AM</div>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                          <p>Could you tell me more about your work and family background?</p>
                          <div className="text-xs text-muted-foreground mt-1">10:35 AM</div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>                  {/* Message Input */}
                  <div className="p-4 border-t border-royal-primary/20 bg-gradient-to-r from-royal-primary/5 to-royal-primary/10">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Type your blessed message with respect and kindness..." 
                        className="border-royal-primary/30 focus:border-royal-primary"
                      />
                      <Button className="bg-royal-primary hover:bg-royal-primary/90 text-white">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      🤲 Remember: Communicate with respect and follow Islamic principles of conversation
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
} 