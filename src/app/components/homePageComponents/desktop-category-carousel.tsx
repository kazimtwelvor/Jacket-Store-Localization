
"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"

interface Category {
  id: string
  name: string
  imageUrl: string
  href: string
}

const menCategories: Category[] = [
  {
    id: "leather-men",
    name: "LEATHER JACKETS",
    imageUrl: "/images/leather.webp",
    href: "/collections/leather",
  },
  {
    id: "puffer-men",
    name: "PUFFER JACKETS",
    imageUrl: "/images/puffer.webp",
    href: "/collections/puffer",
  },
  {
    id: "denim-men",
    name: "DENIM JACKETS",
    imageUrl: "/images/denim.webp",
    href: "/collections/denim",
  },
  {
    id: "suede-men",
    name: "SUEDE JACKETS",
    imageUrl: "/images/suede.webp",
    href: "/collections/suede",
  },
  {
    id: "aviator-men",
    name: "AVIATOR JACKETS",
    imageUrl: "/images/aviator.webp",
    href: "/collections/aviator",
  },
  {
    id: "biker-men",
    name: "BIKER JACKETS",
    imageUrl: "/images/leather.webp",
    href: "/collections/biker",
  },
  {
    id: "varsity-men",
    name: "VARSITY JACKETS",
    imageUrl: "/images/varsity.webp",
    href: "/collections/varsity",
  },
  {
    id: "letterman-men",
    name: "LETTERMAN JACKETS",
    imageUrl: "/images/letterman.webp",
    href: "/collections/letterman",
  },
]

const womenCategories: Category[] = [
  {
    id: "leather-women",
    name: "LEATHER JACKETS",
    imageUrl: "/images/women-leather.webp",
    href: "/collections/leather",
  },
  {
    id: "puffer-women",
    name: "PUFFER JACKETS",
    imageUrl: "/images/women-puffer.webp",
    href: "/collections/puffer",
  },
  {
    id: "denim-women",
    name: "DENIM JACKETS",
    imageUrl: "/images/women-denim.webp",
    href: "/collections/denim",
  },
  {
    id: "suede-women",
    name: "SUEDE JACKETS",
    imageUrl: "/images/women-suede.webp",
    href: "/collections/suede",
  },
  {
    id: "aviator-women",
    name: "AVIATOR JACKETS",
    imageUrl: "/images/women-aviator.webp",
    href: "/collections/aviator",
  },
  {
    id: "biker-women",
    name: "BIKER JACKETS",
    imageUrl: "/images/women-biker.webp",
    href: "/collections/biker",
  },
  {
    id: "varsity-women",
    name: "VARSITY JACKETS",
    imageUrl: "/images/women-varsity.webp",
    href: "/collections/varsity",
  },
  {
    id: "letterman-women",
    name: "LETTERMAN JACKETS",
    imageUrl: "/images/women-letterman.webp",
    href: "/collections/letterman",
  },
]

export default function DesktopCategoryCarousel() {
  const [activeTab, setActiveTab] = useState<"men" | "women">("men")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [visibleItems, setVisibleItems] = useState(5)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [mouseStart, setMouseStart] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [hasDragged, setHasDragged] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [scrollAmount, setScrollAmount] = useState(0)

  const categories = activeTab === "men" ? menCategories : womenCategories

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
  }, [activeTab])

  useEffect(() => {
    const maxIndex = Math.max(0, categories.length - visibleItems)
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex)
    }
  }, [categories.length, visibleItems, currentIndex])


  const handleNext = () => {
    if (isAnimating || currentIndex + visibleItems >= categories.length) return
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
    e.stopPropagation()
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX)
    e.stopPropagation()
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }

    setTouchStart(null)
    setTouchEnd(null)
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

    if (isLeftDrag && currentIndex + visibleItems < categories.length) {
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
  }, [isDragging, mouseStart, currentIndex, visibleItems, categories.length, handleMouseUp])

  return (
    <div className="w-full bg-white flex justify-end overflow-hidden">
      <div className="w-full max-w-[1896px] py-0 m-0 pl-4 md:pl-8 lg:pl-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-0"
        >
        </motion.div>

        <div className="w-full flex justify-center items-center -mt-1 mb-3 md:mb-4 -ml-4 md:-ml-8 lg:-ml-12">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("men")}
              className={cn(
                "px-3 pb-1 text-base font-medium transition-colors border-b-2 text-center",
                activeTab === "men"
                  ? "border-[#2b2b2b] text-[#2b2b2b]"
                  : "border-transparent text-gray-700 hover:text-[#2b2b2b]",
              )}
            >
              MEN
            </button>
            <button
              onClick={() => setActiveTab("women")}
              className={cn(
                "px-3 pb-1 text-base font-medium transition-colors border-b-2 text-center",
                activeTab === "women"
                  ? "border-[#2b2b2b] text-[#2b2b2b]"
                  : "border-transparent text-gray-700 hover:text-[#2b2b2b]",
              )}
            >
              WOMEN
            </button>
          </div>
        </div>
        <div
          className="relative"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6 cursor-grab active:cursor-grabbing"
              animate={{
                x: -currentIndex * scrollAmount + dragOffset,
              }}
              transition={isDragging ? { duration: 0, type: "tween" } : { type: "spring", stiffness: 300, damping: 30 }}
              onMouseDown={handleMouseDown}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              {categories.map((item) => (
                <div
                  key={item.id}
                  className="group flex-shrink-0"
                  style={{ userSelect: "none" }}
                  onMouseUp={handleMouseUp}
                  onContextMenu={(e) => hasDragged && e.preventDefault()}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (hasDragged) {
                        e.preventDefault()
                      }
                    }}
                    draggable="false"
                  >
                    <div className="relative overflow-hidden bg-white shadow-md w-[270px] h-[390px] sm:w-[270px] sm:h-[420px] md:w-[320px] md:h-[500px] lg:w-[340px] lg:h-[530px] xl:w-[360px] xl:h-[560px]">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none select-none"
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                      <div className="absolute inset-x-0 bottom-0 p-4 group">
                        <div className="transition-all duration-500 ease-in-out group-hover:-translate-y-12">
                          <div className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                            <h3
                              className="text-white text-lg md:text-xl lg:text-2xl font-bold text-left transition-all duration-500"
                              style={{ fontFamily: "AvertaPe" }}
                            >
                              {item.name}
                            </h3>
                            <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                          </div>
                        </div>

                        <div className="absolute left-0 right-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                          <p className="text-white/90 text-sm md:text-base">
                            Durable and stylish outerwear reimagined for the next generation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
