"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, MapPin, Clock, Heart, Book, Handshake, Coffee } from "lucide-react"
import { playfair } from "../lib/fonts"

export default function EventsPage() {
  const upcomingEvents = [
    {
      title: "Muslim Matrimonial Meet",
      date: "June 15, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Grand Hyatt, Mumbai",
      description: "Join us for a carefully curated matrimonial meet where like-minded Muslim families can connect in a respectful environment.",
      category: "Matrimonial",
      registrationFee: "₹1,000",
      icon: Heart,
    },
    {
      title: "Islamic Marriage Seminar",
      date: "June 22, 2024",
      time: "2:00 PM - 6:00 PM",
      location: "Islamic Center, Delhi",
      description: "Learn about marriage in Islam from renowned scholars and experts. Perfect for those preparing for marriage.",
      category: "Education",
      registrationFee: "Free",
      icon: Book,
    },
    {
      title: "Family Counseling Workshop",
      date: "June 29, 2024",
      time: "11:00 AM - 3:00 PM",
      location: "Community Center, Bangalore",
      description: "Professional counselors will discuss important aspects of family life and marriage preparation.",
      category: "Workshop",
      registrationFee: "₹500",
      icon: Handshake,
    },
    {
      title: "Muslim Professionals Meetup",
      date: "July 6, 2024",
      time: "4:00 PM - 8:00 PM",
      location: "Tech Hub, Hyderabad",
      description: "Networking event for Muslim professionals looking to connect with potential life partners in a casual setting.",
      category: "Networking",
      registrationFee: "₹750",
      icon: Coffee,
    },
  ]

  const eventCategories = [
    {
      name: "Matrimonial Meets",
      description: "Organized events for families to meet potential matches",
      icon: Users,
      features: [
        "Pre-screened profiles",
        "Professional event management",
        "Private meeting spaces",
        "On-site registration verification",
      ],
    },
    {
      name: "Islamic Seminars",
      description: "Educational sessions on marriage in Islam",
      icon: Book,
      features: [
        "Expert speakers",
        "Interactive Q&A sessions",
        "Marriage preparation guidance",
        "Islamic perspective on relationships",
      ],
    },
    {
      name: "Counseling Services",
      description: "Professional guidance for marriage and family life",
      icon: Handshake,
      features: [
        "Pre-marriage counseling",
        "Family therapy sessions",
        "Conflict resolution workshops",
        "Relationship building programs",
      ],
    },
    {
      name: "Networking Events",
      description: "Casual meetups for young professionals",
      icon: Coffee,
      features: [
        "Structured networking activities",
        "Professional environment",
        "Common interest groups",
        "Halal social interaction",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className={`${playfair.className} text-4xl font-bold text-center mb-4`}>Community Events</h1>
          <p className="text-center text-muted-foreground mb-12">
            Join our community events designed to help you find your perfect match while maintaining Islamic values
          </p>

          {/* Upcoming Events */}
          <h2 className={`${playfair.className} text-3xl font-semibold mb-8`}>Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <event.icon className="h-10 w-10 text-primary" />
                    <Badge variant={event.registrationFee === "Free" ? "secondary" : "default"}>
                      {event.registrationFee}
                    </Badge>
                  </div>
                  <h3 className={`${playfair.className} text-2xl font-semibold mb-2`}>{event.title}</h3>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6">Register Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Event Categories */}
          <h2 className={`${playfair.className} text-3xl font-semibold mb-8`}>Event Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {eventCategories.map((category, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <category.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className={`${playfair.className} text-2xl font-semibold mb-2`}>{category.name}</h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <ul className="space-y-2">
                    {category.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 