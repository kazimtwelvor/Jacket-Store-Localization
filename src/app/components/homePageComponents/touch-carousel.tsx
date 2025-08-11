"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TouchCarouselProps {
  children: React.ReactNode[]
  className?: string
  showArrows?: boolean
  autoplay?: boolean
  autoplayInterval?: number
  loop?: boolean
}

export default function TouchCarousel({
  children,
  className,
  showArrows = true,
  autoplay = true,
  autoplayInterval = 5000,
  loop = true,
}: TouchCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const childrenArray = React.Children.toArray(children)
  const childCount = childrenArray.length

  const resetAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current)
    }
    
    if (autoplay && childCount > 1) {
      autoplayTimerRef.current = setTimeout(() => {
        setActiveIndex((current) => (current === childCount - 1 ? (loop ? 0 : current) : current + 1))
      }, autoplayInterval)
    }
  }, [autoplay, autoplayInterval, childCount, loop])

  useEffect(() => {
    resetAutoplay()
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current)
      }
    }
  }, [activeIndex, resetAutoplay])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setTouchEnd(e.targetTouches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const minSwipeDistance = 50
    
    if (distance > minSwipeDistance) {
      // Swiped left
      if (activeIndex < childCount - 1) {
        setActiveIndex(activeIndex + 1)
      } else if (loop) {
        setActiveIndex(0)
      }
    }
    
    if (distance < -minSwipeDistance) {
      // Swiped right
      if (activeIndex > 0) {
        setActiveIndex(activeIndex - 1)
      } else if (loop) {
        setActiveIndex(childCount - 1)
      }
    }
    
    setIsDragging(false)
    resetAutoplay()
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index)
    resetAutoplay()
  }

  const nextSlide = () => {
    if (activeIndex < childCount - 1) {
      setActiveIndex(activeIndex + 1)
    } else if (loop) {
      setActiveIndex(0)
    }
    resetAutoplay()
  }

  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    } else if (loop) {
      setActiveIndex(childCount - 1)
    }
    resetAutoplay()
  }

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div
        ref={containerRef}
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {childrenArray.map((child, index) => (
          <div key={index} className="min-w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>

      {showArrows && childCount > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 sm:left-4"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 sm:right-4"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
        </>
      )}

      {childCount > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-2">
          {childrenArray.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all sm:h-3 sm:w-3",
                activeIndex === index ? "bg-white" : "bg-white/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}