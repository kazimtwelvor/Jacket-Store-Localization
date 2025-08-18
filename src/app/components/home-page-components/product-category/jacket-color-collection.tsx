
"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { avertaBlack } from "@/src/lib/fonts"

interface Collection {
  id: string
  title: string
  subtitle: string
  imageUrl: string
}

const colorCollections: Collection[] = [
  {
    id: "black-leather",
    title: "BLACK LEATHER JACKETS",
    subtitle: "Durable and stylish outerwear reimagined for the next generation.",
    imageUrl: "https://jacket.us.com/uploads/2025/Black_Leather_Jacket.jpg",
  },
  {
    id: "brown-leather",
    title: "BROWN LEATHER JACKETS",
    subtitle: "Warm and comfortable winter essentials.",
    imageUrl: "https://jacket.us.com/uploads/2025/Brown_Leather_Jacket.jpg",
  },
  {
    id: "tan-leather",
    title: "TAN LEATHER JACKETS",
    subtitle: "Luxurious texture meets contemporary design.",
    imageUrl: "https://jacket.us.com/uploads/2025/Tan_Leather_Jacket.jpg",
  },
  {
    id: "red-leather",
    title: "RED LEATHER JACKETS",
    subtitle: "Classic American style with modern touches.",
    imageUrl: "https://jacket.us.com/uploads/2025/Red_Leather_Jacket.jpg",
  },
]

export default function JacketColorCollection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [visibleItems, setVisibleItems] = useState(4)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [mouseStart, setMouseStart] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [hasDragged, setHasDragged] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [scrollAmount, setScrollAmount] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    const calculateLayout = () => {
      setTimeout(() => {
        if (carouselRef.current) {
          const viewport = carouselRef.current.querySelector(
            ".overflow-hidden",
          ) as HTMLElement | null
          const itemElement = viewport?.querySelector(
            ".group",
          ) as HTMLElement | null
          const motionDiv = itemElement?.parentElement as HTMLElement | null

          if (viewport && itemElement && motionDiv) {
            const viewportWidth = viewport.offsetWidth
            const itemWidth = itemElement.offsetWidth
            const motionDivStyle = window.getComputedStyle(motionDiv)
            const gap = parseFloat(motionDivStyle.gap) || 0
            const totalItemWidth = itemWidth + gap

            if (totalItemWidth > 0) {
              setScrollAmount(totalItemWidth)
              const newVisibleItems = Math.max(1, Math.floor(viewportWidth / totalItemWidth))
              setVisibleItems(newVisibleItems)
            }
          }
        }
      }, 50)
    }

    calculateLayout()
    window.addEventListener("resize", calculateLayout)
    return () => window.removeEventListener("resize", calculateLayout)
  }, [])

  useEffect(() => {
    const maxIndex = Math.max(0, colorCollections.length - visibleItems)
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex)
    }
  }, [colorCollections.length, visibleItems, currentIndex])

  const handleNext = () => {
    if (isAnimating || currentIndex + visibleItems >= colorCollections.length) return
    setIsAnimating(true)
    setCurrentIndex((prev) => prev + 1)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handlePrev = () => {
    if (isAnimating || currentIndex <= 0) return
    setIsAnimating(true)
    setCurrentIndex((prev) => prev - 1)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleDotClick = (index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex(index)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX)
    setTouchStartY(e.targetTouches[0].clientY)
    setIsScrolling(false)
    e.stopPropagation()
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStart === null || touchStartY === null) return
    
    const touchEndX = e.targetTouches[0].clientX
    const touchEndY = e.targetTouches[0].clientY
    const distanceX = Math.abs(touchStart - touchEndX)
    const distanceY = Math.abs(touchStartY - touchEndY)
    
    if (distanceX > distanceY && distanceX > 10) {
      setIsScrolling(true)
      e.preventDefault()
    }
    
    setTouchEnd(touchEndX)
    e.stopPropagation()
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!touchStart || !touchEnd || !touchStartY) return

    const distanceX = touchStart - touchEnd
    const distanceY = Math.abs(touchStartY - e.changedTouches[0].clientY)
    const isLeftSwipe = distanceX > 50
    const isRightSwipe = distanceX < -50

    if (Math.abs(distanceX) > distanceY && (isLeftSwipe || isRightSwipe)) {
      if (isLeftSwipe) {
        handleNext()
      } else if (isRightSwipe) {
        handlePrev()
      }
    }

    setTouchStart(null)
    setTouchStartY(null)
    setTouchEnd(null)
    setTimeout(() => setIsScrolling(false), 100)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setMouseStart(e.clientX)
    setIsDragging(true)
    setDragOffset(0)
    setHasDragged(false)
  }

  const handleMouseUp = () => {
    if (!isDragging) {
      return
    }

    setIsDragging(false)

    const isLeftDrag = dragOffset < -50
    const isRightDrag = dragOffset > 50

    if (isLeftDrag && currentIndex + visibleItems < colorCollections.length) {
      handleNext()
    } else if (isRightDrag && currentIndex > 0) {
      handlePrev()
    }

    setDragOffset(0)
    setMouseStart(null)
  }

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !mouseStart) return
      e.preventDefault()
      const currentOffset = e.clientX - mouseStart
      setDragOffset(currentOffset)
      if (Math.abs(currentOffset) > 5) {
        setHasDragged(true)
      }
    }

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp()
      }
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
      document.body.style.userSelect = ""
    }
  }, [isDragging, mouseStart, currentIndex, visibleItems, colorCollections.length, handleMouseUp])

  return (
    <section className="bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>
      <div className="container mx-auto px-4 pt-10 pb-12 md:pb-20 relative z-10">
        <div className="text-center mb-20">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl mb-6 tracking-tight leading-tight ${avertaBlack.className}`}>
            OUR COLOR COLLECTION
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed ">
            Discover our exclusive range of premium jackets across different styles.
          </p>
        </div>

        <div className="w-full bg-transparent flex justify-end overflow-hidden">
          <div className="w-full max-w-[1896px]  py-0 m-0 pl-4 md:pl-8 lg:pl-12">
            <div
              className="relative"
              ref={carouselRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: 'pan-y' }}
            >
              <div className="overflow-hidden">
                <motion.div
                  className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 cursor-grab active:cursor-grabbing"
                  animate={{
                    x: -currentIndex * scrollAmount + dragOffset,
                  }}
                  transition={isDragging ? { duration: 0, type: "tween" } : { type: "spring", stiffness: 300, damping: 30 }}
                  onMouseDown={handleMouseDown}
                  onWheel={(e) => {
                    e.preventDefault()
                    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                      if (e.deltaX > 0) {
                        handleNext()
                      } else {
                        handlePrev()
                      }
                    }
                  }}
                  style={{ cursor: isDragging ? "grabbing" : "grab" }}
                >
                  {colorCollections.map((item) => (
                    <div
                      key={item.id}
                      className="group flex-shrink-0"
                      style={{ userSelect: "none" }}
                      onMouseUp={handleMouseUp}
                      onContextMenu={(e) => hasDragged && e.preventDefault()}
                    >
                      <div 
                        className="relative overflow-hidden bg-white shadow-md w-[270px] h-[390px] sm:w-[270px] sm:h-[420px] md:w-[320px] md:h-[500px] lg:w-[340px] lg:h-[530px] xl:w-[360px] xl:h-[560px]"
                        onClick={(e) => {
                          if (isScrolling) {
                            e.preventDefault()
                            e.stopPropagation()
                          }
                        }}
                      >
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none select-none"
                          draggable={false}
                          onDragStart={(e) => e.preventDefault()}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                        <div className="absolute inset-x-0 bottom-0 p-4 group">
                          <div className="transition-all duration-500 ease-in-out group-hover:-translate-y-8">
                            <div className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300 mb-5">
                              <h3
                                className={`text-white text-lg md:text-xl lg:text-2xl font-bold text-left transition-all duration-500 ${avertaBlack.className}`}
                                dangerouslySetInnerHTML={{
                                  __html: item.title.replace(' JACKETS', '<br />JACKETS')
                                }}
                              />
                              <svg className="h-4 w-4 md:h-5 md:w-5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>

                          <div className="absolute left-0 right-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                            <p className="text-white/90 text-sm md:text-base">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}