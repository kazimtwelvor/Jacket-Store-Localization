"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/src/app/ui/button"

interface Testimonial {
  id: string
  name: string
  comment: string
  rating: number
  avatar?: string
  title?: string
  date?: string
  featured: boolean
}

interface ReviewsTestimonialProps {
  testimonial: Testimonial
  onNext: () => void
  onPrev: () => void
  totalTestimonials: number
  currentIndex: number
}

export default function ReviewsTestimonial({
  testimonial,
  onNext,
  onPrev,
  totalTestimonials,
  currentIndex,
}: ReviewsTestimonialProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(testimonial)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setCurrentTestimonial(testimonial)
        setIsTransitioning(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [testimonial, isMounted])

  if (!isMounted) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-xl md:text-2xl text-black-700 italic mb-8">
            "The quality exceeded my expectations! The fabric is soft yet durable, and the fit is perfect."
          </p>
          <div className="flex justify-center mb-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <span key={i} className="text-lg text-yellow-400">
                  ★
                </span>
              ))}
          </div>
          <p className="font-bold text-lg">Emma Johnson</p>
          <p className="text-black-500 text-sm">Verified Customer</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-white rounded-xl shadow-sm p-8 max-w-4xl mx-auto">
      <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        <div className="text-center">
          <p className="text-xl md:text-2xl text-black-700 italic mb-8">"{currentTestimonial.comment}"</p>
          <div className="flex justify-center mb-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${i < currentTestimonial.rating ? "text-yellow-400" : "text-black-300"}`}
                >
                  ★
                </span>
              ))}
          </div>
          <p className="font-bold text-lg">{currentTestimonial.name}</p>
          <p className="text-black-500 text-sm">Verified Customer</p>
        </div>
      </div>

      {totalTestimonials > 1 && (
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrev}
            className="h-10 w-10 rounded-full border-black-200 hover:border-black-500 hover:bg-[#eaeaea] transition-colors duration-200"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalTestimonials }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentIndex ? "bg-[#eaeaea]" : "bg-[#eaeaea]"
                } transition-colors duration-200`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            className="h-10 w-10 rounded-full border-black-200 hover:border-black-500 hover:bg-[#eaeaea] transition-colors duration-200"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </Button>
        </div>
      )}
    </div>
  )
}
