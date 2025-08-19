
"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion"    
import { cn } from "../../lib/utils"

const carouselItems = [
  {
    id: "gift-cards",
    title: "Gift Cards",
    imageUrl: "/images/mega-carousel-1.jpg",
    href: "/gift-card",
  },
  {
    id: "inspiration",
    title: "Inspiration",
    imageUrl: "/images/mega-carousel-2.jpg",
    href: "/inspiration",
  },
  {
    id: "boss-lines",
    title: "Boss Brand Lines",
    imageUrl: "/images/mega-carousel-3.jpg",
    href: "/shop?brand=boss",
  },
  {
    id: "made-to-order",
    title: "Made to order",
    imageUrl: "/images/mega-carousel-4.jpg",
    href: "/made-to-order",
  },
  {
    id: "new-arrivals",
    title: "New Arrivals",
    imageUrl: "/images/mega-carousel-5.jpg",
    href: "/shop?sort=newest",
  },
  {
    id: "mens-collection",
    title: "Men's Collection",
    imageUrl: "/images/mega-carousel-men.jpg",
    href: "/shop?genders=Male",
  },
]

const ITEM_WIDTH = 374
const GAP = 18

interface MegaMenuCarouselProps {
    theme?: 'light' | 'dark';
    showNavButtons?: boolean;
}

export default function MegaMenuCarousel({ theme = 'dark', showNavButtons = true }: MegaMenuCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const wasDragged = useRef(false)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const getMaxScroll = () => {
    if (!containerRef.current) return 0
    const scrollWidth = (ITEM_WIDTH + GAP) * carouselItems.length - GAP
    const clientWidth = containerRef.current.clientWidth
    return scrollWidth > clientWidth ? scrollWidth - clientWidth : 0
  }

  useEffect(() => {
    const checkScroll = (latestX: number) => {
        if (!containerRef.current) return
        const maxScroll = getMaxScroll()
        setCanScrollLeft(latestX < -1)
        setCanScrollRight(latestX > -maxScroll + 1)
    }

    const unsubscribeX = x.on("change", checkScroll)
    
    const handleResize = () => {
        checkScroll(x.get())
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      unsubscribeX()
      window.removeEventListener('resize', handleResize)
    }
  }, [x])

  const handleNav = (direction: 'prev' | 'next') => {
    if (!containerRef.current) return;
    const currentX = x.get();
    const clientWidth = containerRef.current.clientWidth;
    const scrollAmount = clientWidth;
    
    const maxScroll = getMaxScroll();

    let newX = direction === 'prev'
      ? currentX + scrollAmount
      : currentX - scrollAmount;

    newX = Math.max(-maxScroll, Math.min(0, newX));
    
    animate(x, newX, { type: "spring", stiffness: 400, damping: 40 });
  };

  return (
    <div className="relative">
      {showNavButtons && (
        <div className="absolute right-0 -top-16 flex items-center justify-end space-x-3 h-10 w-24">
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                key="prev"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleNav('prev')}
                className={cn(
                  "p-2 rounded-full shadow-md z-10",
                  theme === 'dark' 
                    ? "bg-[#333] text-white hover:bg-[#444]" 
                    : "bg-gray-100 text-black hover:bg-gray-200"
                )}
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>
            )}
            {canScrollRight && (
              <motion.button
                key="next"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleNav('next')}
                className={cn(
                  "p-2 rounded-full shadow-md z-10",
                  theme === 'dark' 
                    ? "bg-[#333] text-white hover:bg-[#444]" 
                    : "bg-gray-100 text-black hover:bg-gray-200"
                )}
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      <div ref={containerRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
        <motion.div
          className="flex"
          style={{ gap: `${GAP}px`, x }}
          drag="x"
          dragConstraints={{
            left: -getMaxScroll(),
            right: 0,
          }}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          onPointerDown={() => (wasDragged.current = false)}
          onDrag={(event, info) => {
            if (Math.abs(info.offset.x) > 5) {
              wasDragged.current = true
            }
          }}
        >
          {carouselItems.map((item) => (
            <div key={item.id} className="flex-shrink-0" style={{ width: `${ITEM_WIDTH}px` }}>
              <section>
                <Link
                  href={item.href}
                  className={cn(
                    "group block transition-colors duration-300",
                    theme === 'dark' ? "text-white hover:text-gray-300" : "text-black hover:text-gray-600"
                  )}
                  draggable="false"
                  onDragStart={(e) => e.preventDefault()}
                  onClick={(e) => {
                    if (wasDragged.current) {
                      e.preventDefault()
                      e.stopPropagation()
                    }
                  }}
                >
                  <div className={cn(
                      "overflow-hidden mb-4",
                      theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-gray-100'
                  )}>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={374}
                      height={625}
                      unoptimized
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      className="object-cover w-full h-auto aspect-[3/5] group-hover:scale-105 transition-transform duration-500 ease-in-out pointer-events-none select-none"
                    />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider">{item.title}</h3>
                </Link>
              </section>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
