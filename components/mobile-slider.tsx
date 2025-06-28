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
    }, 5000) // Change slide every 5 seconds

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
    <div className="relative w-full h-[65vh] sm:h-[75vh] overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/15 to-black/30"></div>
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-start items-center px-4 py-8 text-center">
            {/* Slide 1 Content */}
            {currentSlide === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-4 sm:space-y-6 max-w-xs sm:max-w-sm mt-8 sm:mt-12"
              >
                {/* Title */}
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-2xl"
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
                      width={160}
                      height={32}
                      className="drop-shadow-lg sm:w-[200px] sm:h-[40px]"
                    />
                  </motion.div>
                )}

                {/* Description */}
                {mobileSlides[currentSlide].content.description && (
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-xs sm:text-sm text-white/95 leading-relaxed drop-shadow-lg px-2"
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
                className="flex justify-center items-start mt-8 sm:mt-12"
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
                      width={250}
                      height={125}
                      className="drop-shadow-2xl sm:w-[300px] sm:h-[150px]"
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

      {/* Slide Indicators - Pointer Style */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
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
              className={`w-0 h-0 transition-all duration-300 ${
                index === currentSlide
                  ? "border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-white shadow-lg"
                  : "border-l-[6px] border-r-[6px] border-b-[9px] border-l-transparent border-r-transparent border-b-white/50 hover:border-b-white/75"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
