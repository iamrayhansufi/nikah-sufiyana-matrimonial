"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileSlide {
  id: number
  image: string
  content: {
    title?: string
    borderSvg?: string
    description?: string
    urduTextSvg?: string
  }
}

const mobileSlides: MobileSlide[] = [
  {
    id: 1,
    image: "https://res.cloudinary.com/ddneah55w/image/upload/v1751073077/mobile-slide-1_jtk1zt.jpg",
    content: {
      title: "Most Trusted Islamic Matrimonial",
      borderSvg: "/sufiyana-border-ui.svg",
      description: "Join India's most trusted Islamic matrimonial platform. Connect with verified profiles and find your soulmate with complete Islamic values and family traditions."
    }
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/ddneah55w/image/upload/v1751073084/mobile-slide-2_gqg9ho.jpg",
    content: {
      urduTextSvg: "/slider-urdu-text.svg"
    }
  }
]

export function MobileSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mobileSlides.length)
    }, 8000) // Change slide every 8 seconds (increased from 5)

    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + mobileSlides.length) % mobileSlides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % mobileSlides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="relative w-full h-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={mobileSlides[currentSlide].image}
              alt={`Mobile slide ${currentSlide + 1}`}
              fill
              className="object-cover object-center"
              priority={currentSlide === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40"></div>
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-start items-center px-6 py-16 text-center">
            {/* Slide 1 Content */}
            {currentSlide === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-6 sm:space-y-8 max-w-sm sm:max-w-md mt-16 sm:mt-20"
              >
                {/* Title */}
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-2xl"
                >
                  {mobileSlides[currentSlide].content.title}
                </motion.h1>

                {/* Border SVG */}
                {mobileSlides[currentSlide].content.borderSvg && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex justify-center"
                  >
                    <Image
                      src={mobileSlides[currentSlide].content.borderSvg}
                      alt="Decorative border"
                      width={220}
                      height={44}
                      className="drop-shadow-lg sm:w-[280px] sm:h-[56px]"
                    />
                  </motion.div>
                )}

                {/* Description */}
                {mobileSlides[currentSlide].content.description && (
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-sm sm:text-base md:text-lg text-white/95 leading-relaxed drop-shadow-lg px-4"
                  >
                    {mobileSlides[currentSlide].content.description}
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* Slide 2 Content */}
            {currentSlide === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex justify-center items-start mt-16 sm:mt-20"
              >
                {/* Urdu Text SVG */}
                {mobileSlides[currentSlide].content.urduTextSvg && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <Image
                      src={mobileSlides[currentSlide].content.urduTextSvg}
                      alt="Urdu text"
                      width={320}
                      height={160}
                      className="drop-shadow-2xl sm:w-[400px] sm:h-[200px]"
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm transition-all duration-300"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm transition-all duration-300"
        onClick={goToNext}
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      {/* Slide Indicators - Circle Style */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-4">
        {mobileSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative transition-all duration-300 ${
              index === currentSlide
                ? "scale-125"
                : "hover:scale-110"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-4 h-4 bg-white shadow-lg ring-2 ring-white/50"
                  : "w-3 h-3 bg-white/60 hover:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
