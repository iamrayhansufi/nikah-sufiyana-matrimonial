"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Heart, 
  Star, 
  Calendar, 
  Users, 
  BookOpen, 
  MessageSquare, 
  ArrowRight,
  Search,
  Filter,
  Clock,
  Tag,
  Share2,
  ThumbsUp,
  Eye
} from "lucide-react"
import { elMessiri } from "../lib/fonts"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"

const blogPosts = [
  {
    id: 1,
    title: "The Islamic Way of Finding Your Life Partner",
    excerpt: "Discover the beautiful Islamic principles that guide the search for a compatible life partner, emphasizing faith, family involvement, and divine guidance.",
    content: "In Islam, finding a life partner is not just about personal attraction but about finding someone who will be your companion in this world and the hereafter...",
    author: "Dr. Amina Sheikh",
    publishDate: "2024-06-20",
    category: "Islamic Guidance",
    readTime: "5 min read",
    image: "/blog/islamic-marriage.jpg",
    tags: ["Marriage", "Islamic Values", "Faith"],
    likes: 234,
    views: 1250,
    featured: true
  },
  {
    id: 2,
    title: "Modern Muslim Matrimony: Balancing Tradition and Technology",
    excerpt: "How technology can serve as a blessed tool in maintaining Islamic values while helping Muslim families find suitable matches for their children.",
    content: "The digital age has transformed how we connect, but Islamic principles remain timeless. Learn how to navigate modern matrimonial platforms...",
    author: "Imam Mohammad Ali",
    publishDate: "2024-06-18",
    category: "Modern Living",
    readTime: "7 min read",
    image: "/blog/modern-matrimony.jpg",
    tags: ["Technology", "Tradition", "Family"],
    likes: 189,
    views: 980,
    featured: true
  },
  {
    id: 3,
    title: "The Role of Family in Islamic Marriage",
    excerpt: "Understanding the importance of family involvement in Islamic matrimony and how it strengthens the foundation of married life.",
    content: "In Islamic culture, marriage is not just between two individuals but between two families. This approach brings wisdom, support, and blessing...",
    author: "Sister Fatima Zahir",
    publishDate: "2024-06-15",
    category: "Family Values",
    readTime: "4 min read",
    image: "/blog/family-role.jpg",
    tags: ["Family", "Support", "Islamic Culture"],
    likes: 156,
    views: 750,
    featured: false
  },
  {
    id: 4,
    title: "Understanding Compatibility in Islamic Marriage",
    excerpt: "Explore the key factors that determine compatibility between Muslim couples, beyond just attraction and common interests.",
    content: "True compatibility in Islamic marriage encompasses spiritual, intellectual, emotional, and practical harmony between partners...",
    author: "Dr. Ahmed Hassan",
    publishDate: "2024-06-12",
    category: "Relationships",
    readTime: "6 min read",
    image: "/blog/compatibility.jpg",
    tags: ["Compatibility", "Marriage", "Relationships"],
    likes: 203,
    views: 1100,
    featured: false
  },
  {
    id: 5,
    title: "The Blessings of Patience in Finding Your Spouse",
    excerpt: "Why patience (Sabr) is essential in the journey of finding the right life partner and how it leads to blessed outcomes.",
    content: "In the beautiful journey of finding your life partner, patience is not just a virtue but a pathway to divine blessings...",
    author: "Ustadh Omar Malik",
    publishDate: "2024-06-10",
    category: "Spiritual Growth",
    readTime: "5 min read",
    image: "/blog/patience.jpg",
    tags: ["Patience", "Spirituality", "Faith"],
    likes: 167,
    views: 820,
    featured: false
  },
  {
    id: 6,
    title: "Pre-Marriage Counseling in Islamic Perspective",
    excerpt: "The importance of seeking guidance and counseling before marriage to build a strong foundation for your married life.",
    content: "Islamic tradition emphasizes the importance of preparation and guidance before embarking on the blessed journey of marriage...",
    author: "Dr. Khadija Rahman",
    publishDate: "2024-06-08",
    category: "Marriage Preparation",
    readTime: "8 min read",
    image: "/blog/counseling.jpg",
    tags: ["Counseling", "Preparation", "Guidance"],
    likes: 145,
    views: 690,
    featured: false
  }
]

const categories = ["All", "Islamic Guidance", "Modern Living", "Family Values", "Relationships", "Spiritual Growth", "Marriage Preparation"]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

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
              <BookOpen className="h-4 w-4 mr-2" />
              Nikah Sufiyana Blog
            </Badge>
            <h1 className={`${elMessiri.className} text-5xl md:text-6xl font-bold text-royal-primary mb-6`}>
              Wisdom & Modern Guidance
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
              Discover insights, guidance, and wisdom about Islamic matrimony, modern relationships, and building blessed marriages that honor our faith and traditions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-gradient-to-br from-cream-light/30 to-cream-dark/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles, topics, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-royal-primary/20 focus:border-royal-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Filter by:</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-royal-primary text-white" 
                    : "border-royal-primary/20 text-royal-primary hover:bg-royal-primary hover:text-white"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
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
              Featured Articles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential readings for those seeking blessed guidance in their matrimonial journey.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8 mb-16"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {filteredPosts.filter(post => post.featured).map((post, index) => (
              <motion.div key={post.id} variants={fadeInUp}>
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden h-full hover:shadow-3xl transition-all duration-500">
                  <div className="relative h-48 bg-gradient-to-br from-royal-primary/10 to-royal-primary/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-royal-primary/30" />
                    </div>
                    <Badge className="absolute top-4 right-4 bg-royal-primary text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views}
                        </div>
                      </div>
                    </div>

                    <h3 className={`${elMessiri.className} text-xl font-bold text-royal-primary mb-3 line-clamp-2`}>
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-500">
                        By {post.author} • {new Date(post.publishDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {post.likes}
                        </div>
                        <Share2 className="h-3 w-3 cursor-pointer hover:text-royal-primary" />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full bg-royal-primary hover:bg-royal-primary/90 text-white">
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* All Articles Grid */}
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
              All Articles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our complete collection of articles covering all aspects of Islamic matrimony and relationships.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {filteredPosts.map((post, index) => (
              <motion.div key={post.id} variants={fadeInUp}>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                  <div className="relative h-32 bg-gradient-to-br from-royal-primary/10 to-royal-primary/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-royal-primary/30" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>

                    <h3 className={`${elMessiri.className} text-lg font-bold text-royal-primary mb-2 line-clamp-2`}>
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="text-xs text-gray-500 mb-3">
                      By {post.author} • {new Date(post.publishDate).toLocaleDateString()}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {post.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-royal-primary text-royal-primary hover:bg-royal-primary hover:text-white">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-gradient-to-br from-royal-primary to-royal-primary/80 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className={`${elMessiri.className} text-4xl md:text-5xl font-bold mb-6`}>
              Stay Updated
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Subscribe to receive the latest articles, matrimonial guidance, and blessed insights directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30" 
              />
              <Button className="bg-white text-royal-primary hover:bg-white/90 font-semibold">
                <MessageSquare className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </motion.div>
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
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Apply the wisdom you've learned and start your blessed search for the perfect life partner.
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
