"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, Calendar, MapPin, Users, Quote, Sparkles, ArrowRight } from "lucide-react"
import { elMessiri } from "../lib/fonts"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const successStories = [
  {
    id: 1,
    couple: "Ahmed & Fatima",
    location: "Hyderabad, Telangana",
    marriageDate: "June 2024",
    story: "Alhamdulillah! We found each other through Nikah Sufiyana after 6 months of searching. The platform's emphasis on Islamic values and family involvement made our journey so much easier. Our families connected beautifully, and we had a blessed nikah ceremony.",
    image: "/success-stories/couple1.jpg",
    testimonial: "Nikah Sufiyana helped us find our perfect match with complete respect for our religious values. The verification process gave our families confidence.",
    children: "Expecting our first child - InshAllah",
    featured: true
  },
  {
    id: 2,
    couple: "Omar & Ayesha",
    location: "Pune, Maharashtra",
    marriageDate: "March 2024",
    story: "MashaAllah! Our story began when we both were looking for someone who understood our Islamic values. Nikah Sufiyana's compatibility matching helped us connect based on our shared goals and beliefs.",
    image: "/success-stories/couple2.jpg",
    testimonial: "The royal treatment we received from the support team made our matrimonial journey smooth and blessed.",
    children: "Blessed with daughter Zara",
    featured: true
  },
  {
    id: 3,
    couple: "Yusuf & Zainab",
    location: "Chennai, Tamil Nadu",
    marriageDate: "December 2023",
    story: "Alhamdulillah! We are grateful to Nikah Sufiyana for bringing us together. The platform's focus on genuine relationships and family values aligned perfectly with what we were looking for.",
    image: "/success-stories/couple3.jpg",
    testimonial: "We appreciated the privacy controls and the way the platform honored Islamic courtship principles.",
    children: "Blessed with son Abdullah",
    featured: false
  },
  {
    id: 4,
    couple: "Khalid & Maryam",
    location: "Secunderabad, Telangana",
    marriageDate: "October 2023",
    story: "SubhanAllah! Our families were looking for suitable matches for us, and Nikah Sufiyana made the process so much easier. The detailed profiles and family involvement features were exactly what we needed.",
    image: "/success-stories/couple4.jpg",
    testimonial: "The premium matchmaking service provided personalized support throughout our journey.",
    children: "Blessed with twins - Masha'Allah",
    featured: false
  },
  {
    id: 5,
    couple: "Ibrahim & Aisha",
    location: "Bangalore, Karnataka",
    marriageDate: "August 2023",
    story: "Alhamdulillah! We connected through Nikah Sufiyana's advanced matching system. The platform's emphasis on Islamic values and genuine connections made our journey blessed.",
    image: "/success-stories/couple5.jpg",
    testimonial: "The security and privacy features gave us complete confidence in sharing our information.",
    children: "Expecting our second child",
    featured: false
  },
  {
    id: 6,
    couple: "Hassan & Khadija",
    location: "Delhi, NCR",
    marriageDate: "May 2023",
    story: "MashaAllah! Our story is a testament to the power of dua and the right platform. Nikah Sufiyana connected us based on our shared Islamic values and life goals.",
    image: "/success-stories/couple6.jpg",
    testimonial: "The family-centric approach and Islamic guidance made our matrimonial journey truly blessed.",
    children: "Blessed with son Omar",
    featured: false
  }
]

export default function SuccessStoriesPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-royal-gradient">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <Badge className="bg-royal-primary/10 text-royal-primary border-royal-primary/20 px-4 py-2 text-sm font-medium mb-6">
              <Heart className="h-4 w-4 mr-2" />
              Blessed Success Stories
            </Badge>
            <h1 className={`${elMessiri.className} text-5xl md:text-6xl font-bold text-royal-primary mb-6`}>
              Sufiyana Love Stories
            </h1>
            <div className="flex justify-center mb-8">
              <Image
                src="/sufiyana-border-ui.svg"
                alt="Decorative Border"
                width={300}
                height={12}
                className="opacity-60"
              />
            </div>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              Discover the beautiful journeys of couples who found their soulmates through Nikah Sufiyana. Each story is a testament to the power of faith, family, and divine guidance in bringing hearts together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-20 bg-gradient-to-br from-cream-light/30 to-cream-dark/20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-4xl md:text-5xl font-bold text-royal-primary mb-6`}>
              Featured Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These blessed couples share their journey of finding love through Islamic values and family blessings.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-12 mb-16"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >            {successStories.filter(story => story.featured).map((story, index) => (
              <motion.div key={story.id} variants={fadeInUp}>
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden relative">
                  {/* SVG Borders */}
                  <>
                    {/* Bottom Left Border */}
                    <div className="absolute bottom-0 left-0 w-10 h-20 opacity-70 z-10">
                      <Image
                        src="/bottom-left-border.svg"
                        alt="Bottom Left Border"
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    {/* Top Right Border */}
                    <div className="absolute top-0 right-0 w-10 h-20 opacity-70 z-10">
                      <Image
                        src="/top-right-border.svg"
                        alt="Top Right Border"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </>
                  
                  <div className="relative">
                    <Image
                      src="/Nikah-Sufiyana-box-with-border-01.svg"
                      alt="Decorative Box Border"
                      width={600}
                      height={400}
                      className="absolute inset-0 w-full h-full object-cover opacity-10"
                    />
                    <CardContent className="relative p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-royal-primary/20 to-royal-primary/10 flex items-center justify-center">
                          <Heart className="h-8 w-8 text-royal-primary" />
                        </div>
                        <div>
                          <h3 className={`${elMessiri.className} text-2xl font-bold text-royal-primary`}>
                            {story.couple}
                          </h3>
                          <div className="flex items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {story.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {story.marriageDate}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <Quote className="h-8 w-8 text-royal-primary/30 mb-4" />
                        <p className="text-gray-700 leading-relaxed italic text-lg mb-4">
                          "{story.story}"
                        </p>
                        <p className="text-royal-primary font-medium">
                          "{story.testimonial}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium text-sm">{story.children}</span>
                        </div>
                        <Badge className="bg-royal-primary/10 text-royal-primary">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* All Stories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-4xl md:text-5xl font-bold text-royal-primary mb-6`}>
              More Blessed Unions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every story is unique, but they all share the common thread of faith, family, and finding the right match through Islamic values.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >            {successStories.map((story, index) => (
              <motion.div key={story.id} variants={fadeInUp}>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full relative">
                  {/* SVG Borders */}
                  <>
                    {/* Bottom Left Border */}
                    <div className="absolute bottom-0 left-0 w-10 h-20 opacity-70">
                      <Image
                        src="/bottom-left-border.svg"
                        alt="Bottom Left Border"
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    {/* Top Right Border */}
                    <div className="absolute top-0 right-0 w-10 h-20 opacity-70">
                      <Image
                        src="/top-right-border.svg"
                        alt="Top Right Border"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </>
                  
                  <CardContent className="p-6 relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-royal-primary/20 to-royal-primary/10 flex items-center justify-center">
                        <Heart className="h-6 w-6 text-royal-primary" />
                      </div>
                      <div>
                        <h3 className={`${elMessiri.className} text-lg font-bold text-royal-primary`}>
                          {story.couple}
                        </h3>
                        
                        {/* Text Bottom Border */}
                        <div className="flex justify-start mb-2">
                          <Image
                            src="/text-bottom-border.svg"
                            alt="Text Bottom Border"
                            width={100}
                            height={10}
                            className="opacity-60"
                          />
                        </div>
                        <p className="text-sm text-gray-600">{story.location}</p>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                      {story.story.substring(0, 120)}...
                    </p>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-royal-primary" />
                        <span className="text-royal-primary font-medium">{story.marriageDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-green-600" />
                        <span className="text-green-600 font-medium">{story.children}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-royal-primary to-royal-primary/80 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`${elMessiri.className} text-4xl md:text-5xl font-bold mb-6`}>
              Our Success in Numbers
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              These blessed statistics reflect the divine success of our matrimonial platform.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div 
              className="group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-4xl md:text-5xl font-bold mb-2">15K+</div>
                <div className="text-white/90 font-medium">Happy Couples</div>
                <div className="text-sm text-white/70">Blessed Marriages</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
                <div className="text-white/90 font-medium">Success Rate</div>
                <div className="text-sm text-white/70">Divine Matches</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-4xl md:text-5xl font-bold mb-2">100K+</div>
                <div className="text-white/90 font-medium">Active Members</div>
                <div className="text-sm text-white/70">Seeking Partners</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                <div className="text-white/90 font-medium">Cities</div>
                <div className="text-sm text-white/70">Across India</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cream-light/50 to-cream-dark/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-4xl md:text-5xl font-bold text-royal-primary mb-6`}>
              Your Success Story Awaits
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of happy couples who found their perfect match through Nikah Sufiyana. Begin your blessed journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-royal-primary hover:bg-royal-primary/90 text-white px-8 py-4 text-lg font-semibold">
                  Create Your Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/browse">
                <Button size="lg" variant="outline" className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white px-8 py-4 text-lg font-semibold">
                  Browse Profiles
                  <Users className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
