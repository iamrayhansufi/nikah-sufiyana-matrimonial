"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send } from "lucide-react"
import { playfair } from "../lib/fonts"

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className={`${playfair.className} text-2xl font-semibold text-center mb-8`}>Messages</h1>
          
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
                {/* Contacts List */}
                <div className="border-r">
                  <div className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search messages..."
                        className="pl-9"
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
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className={`${playfair.className} font-medium truncate`}>Aisha Khan</h3>
                              <p className="text-sm text-muted-foreground truncate">
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
                <div className="col-span-2 flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <img
                        src="/placeholder.svg?height=50&width=50"
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h2 className={`${playfair.className} font-medium`}>Aisha Khan</h2>
                        <p className="text-sm text-muted-foreground">Online</p>
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
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                          <p>Walaikum assalam, thank you for your interest. I would be happy to connect.</p>
                          <div className="text-xs opacity-70 mt-1">10:32 AM</div>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                          <p>Could you tell me more about your work and family background?</p>
                          <div className="text-xs text-muted-foreground mt-1">10:35 AM</div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input placeholder="Type your message..." />
                      <Button>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
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