"use client"
import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "../lib/utils"
import type { Product } from "@/types"
import useWishlist from "../hooks/use-wishlist"
// import useWishlist from "@/app/hooks/use-wishlist"
// import useWishlist from "@/hooks/use-wishlist"


interface RecentlyViewedProps {
  recentlyViewed: Product[]
  hoveredProduct: string | null
  setHoveredProduct: (id: string | null) => void
  selectedSizes: Record<string, string>
  addToRecentlyViewed: (product: Product) => void
  handleClick: (product: Product) => void
  handleSizeSelect: (productId: string, size: string) => void
  onAddToCartClick: (product: Product) => void;
  // Note: scrollRecentlyViewed & recentlyViewedScrollRef are removed as they are not used in the new logic
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  recentlyViewed,
  hoveredProduct,
  setHoveredProduct,
  selectedSizes,
  addToRecentlyViewed,
  handleClick,
  handleSizeSelect,
  onAddToCartClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [mouseStart, setMouseStart] = useState<number | null>(null)
  const [mouseEnd, setMouseEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const mobileCarouselRef = useRef<HTMLDivElement>(null)
  const desktopCarouselRef = useRef<HTMLDivElement>(null)
  const [visibleItems, setVisibleItems] = useState(4)
  const [mobileScrollAmount, setMobileScrollAmount] = useState(0)
  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set())
  const [currentProducts, setCurrentProducts] = useState<Product[]>(recentlyViewed)
  const colorTriggerRefs = useRef<Record<string, HTMLButtonElement>>({})
  const [isDesktop, setIsDesktop] = useState(false)
  const [colorPopup, setColorPopup] = useState<{ productKey: string; rect: DOMRect } | null>(null)
  const [mounted, setMounted] = useState(false)
  const wishlist = useWishlist()
  const [wishlistItems, setWishlistItems] = useState<string[]>([])

  // Track wishlist changes
  useEffect(() => {
    const items = wishlist.items.map(item => item.id)
    setWishlistItems(items)
  }, [wishlist.items])

  useEffect(() => {
    setMounted(true)
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    setCurrentProducts(recentlyViewed)
  }, [recentlyViewed])


  useEffect(() => {
    const calculateLayout = () => {
      const width = window.innerWidth
      if (width < 768) {
        setVisibleItems(1)
        if (mobileCarouselRef.current) {
            const item = mobileCarouselRef.current.querySelector<HTMLElement>(':scope > div')
            if (item) {
                const itemWidth = item.offsetWidth
                const gap = parseFloat(window.getComputedStyle(mobileCarouselRef.current).gap)
                setMobileScrollAmount(itemWidth + (isNaN(gap) ? 16 : gap)) // Default gap 16px if parsing fails
            }
        }
      } else {
        setVisibleItems(4)
      }
    }

    calculateLayout()
    const timer = setTimeout(calculateLayout, 100); // Recalculate after initial render
    window.addEventListener('resize', calculateLayout)

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateLayout)
    }
  }, [recentlyViewed]) // Depend on recentlyViewed length




  const maxIndex = Math.max(0, currentProducts.length - visibleItems)

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return // Ignore drag if starting on a button
    setMouseStart(e.clientX)
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setMouseEnd(e.clientX)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
     if ((e.target as HTMLElement).closest('button')) {
      setIsDragging(false)
      return
    }
    // Prevent click if there was significant mouse movement (indicating a drag)
    if (!mouseStart || Math.abs(e.clientX - mouseStart) < 10) {
        setIsDragging(false)
        return
    }
    if (!mouseEnd || !isDragging) {
      setIsDragging(false)
      return
    }

    const distance = mouseStart - mouseEnd
    const isLeftDrag = distance > 50
    const isRightDrag = distance < -50

    if (isLeftDrag) {
      handleNext()
    } else if (isRightDrag) {
      handlePrev()
    }

    setMouseStart(null)
    setMouseEnd(null)
    setIsDragging(false)
  }

  const handleCardClick = (product: Product, e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false) // Reset dragging state
      return
    }
    addToRecentlyViewed(product)
    handleClick(product)
  }

  // Don't render if no recently viewed items
  if (currentProducts.length === 0) {
    return null
  }

  return (
    <div className="w-full pl-4 pr-0 sm:pl-6 md:pl-8 lg:px-8 mb-8 md:mb-12 mt-16 h-auto min-h-[200px]">
      <div className="relative">
        <div className="flex justify-between items-center mb-4 pr-4 sm:pr-6 md:pr-0">
          <h2 className="text-xl font-bold">Recently Viewed</h2>

          {/* Mobile Arrows - Updated Style */}
          <div className="md:hidden flex items-center gap-2">
            {currentIndex > 0 && (
              <button
                onClick={handlePrev}
                className="w-8 h-8 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {currentIndex < maxIndex && (
              <button
                onClick={handleNext}
                className="w-8 h-8 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          {/* Desktop Arrows - REMOVED from here (this block is now empty and can be deleted if desired) */}
          <div className="hidden md:flex items-center gap-2">
             {/* Arrows removed from this location */}
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative overflow-hidden">
          <motion.div
            ref={mobileCarouselRef}
            className="flex gap-4"
            animate={{ x: `-${currentIndex * mobileScrollAmount}px` }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {currentProducts.map((product, index) => (
              // Changed from motion.div to div and removed whileHover, onMouseEnter, onMouseLeave
              <div
                key={`recent-mobile-${product.id}-${index}`}
                className="flex-shrink-0 w-[calc(59vw-16px)] cursor-pointer flex flex-col h-full"
                // Removed whileHover and onMouseEnter/onMouseLeave for mobile
                onClick={(e) => handleCardClick(product, e)}
              >
                <div className="relative flex-1 aspect-[3/5] overflow-visible bg-gray-100">
                  {/* Simplified image logic for mobile - no hover swap */}
                  <Image
                    src={(product.images?.[0] as any)?.url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover object-top transition-all duration-300"
                    sizes="250px"
                  />
                  {/* Loading Spinner */}
                  {loadingProducts.has(product.id) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-30">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-black"></div>
                    </div>
                  )}
                  {/* <div className="absolute bottom-2 left-2 text-red-600 text-sm font-medium opacity-80">
                    FINEYST
                  </div> */}
                  {/* Wishlist icon */}
                  <button
                      className="absolute w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md z-10 right-12 -bottom-4"
                      aria-label="Add to wishlist"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (wishlist.isInWishlist(product.id)) {
                          wishlist.removeItem(product.id)
                        } else {
                          wishlist.addItem(product)
                        }
                      }}
                  >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="black" strokeWidth="2" fill={mounted && wishlistItems.includes(product.id) ? "black" : "none"} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                  </button>
                  {/* Cart icon */}
                  <button
                      className="absolute w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-md z-10 right-2 -bottom-4"
                      aria-label="Add to cart"
                      onClick={(e) => {
                          e.stopPropagation();
                          onAddToCartClick(product);
                      }}
                  >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.5 9h11L19 21H5L6.5 9z" />
                          <path d="M9 9c0-2.76 1.38-5 3-5s3 2.24 3 5" />
                      </svg>
                  </button>
                  {product.isFeatured && (
                    // Keep motion.div for initial animation
                    <motion.div
                      className="absolute top-2 left-0 z-10 scale-90"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <div className="relative">
                        <div className="bg-black text-white py-0.5 px-1.5 shadow-md flex items-center">
                          <span className="font-semibold tracking-wide text-[9px]">BEST SELLING</span>
                        </div>
                        <div className="absolute top-full left-0 w-0 h-0 border-t-[5px] border-t-red-800 border-r-[5px] border-r-transparent"></div>
                      </div>
                    </motion.div>
                  )}
                  {/* Removed the entire AnimatePresence block for quick shop on mobile */}
                </div>
                <div className="mt-8">
                  <h3 className="text-sm line-clamp-1">{product.name.toUpperCase()}</h3>
                  <div className="mt-1">
                    {product.salePrice && Number(product.salePrice) > 0 ? (
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold line-through text-black-500">${product.price}</span>
                        <span className="text-lg font-bold text-black">${product.salePrice}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-black">${product.price}</span> 
                    )}
                  </div>
                  <div className="mt-2">
                    <div 
                      className="relative inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-black"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {((product as any).colorDetails || (product as any).colors || [{value: '#000000', name: 'Black'}]).slice(0, 1).map((color: any, index: number) => (
                        <div key={index} className="flex items-center gap-1">
                          <div
                            className="w-4 h-4 rounded-full border border-black/30"
                            style={{ backgroundColor: color.value || '#000000' }}
                          />
                          <span className="text-xs text-gray-700">{color.name || 'Black'}</span>
                        </div>
                      ))}
                      {((product as any).colorDetails || (product as any).colors || []).length > 1 && (
                        <button 
                          ref={(el) => {
                            if (el) colorTriggerRefs.current[`recent-mobile-${product.id}-${index}`] = el
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            const productKey = `${product.id}-${index}`
                            const button = e.currentTarget
                            const rect = button.getBoundingClientRect()
                            setColorPopup({ productKey, rect })
                          }}
                          className="text-xs text-gray-500"
                        >
                          +{((product as any).colorDetails || (product as any).colors || []).length - 1} more
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Desktop/Tablet Carousel */}
        <div className="hidden md:block relative group">
          <div className="overflow-hidden" ref={desktopCarouselRef}>
            <motion.div
              className="flex gap-3 sm:gap-4 md:gap-4 lg:gap-5 xl:gap-6"
              animate={{ x: `calc(-${currentIndex * (100 / visibleItems)}% - ${currentIndex * (20 / visibleItems)}px)`}}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {currentProducts.map((product, index) => (
                <div
                  key={`recent-${product.id}-${index}`}
                  className="group/item flex-shrink-0 cursor-pointer flex flex-col"
                  style={{ width: `calc(${(100 / visibleItems)}% - ${((visibleItems - 1) * 20) / visibleItems}px)`, userSelect: 'none' }}
                  onMouseEnter={() => setHoveredProduct(`recent-${product.id}-${index}`)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={(e) => handleCardClick(product, e)}
                >
                  <div className="relative overflow-hidden bg-gray-100 w-full aspect-[3/5]">
                    <Image
                      src={hoveredProduct === `recent-${product.id}-${index}` && (product.images?.[1] as any)?.url ? (product.images[1] as any).url : ((product.images?.[0] as any)?.url || "/placeholder.svg")}
                      alt={product.name}
                      fill
                      className={cn(
                        "object-cover object-top transition-all duration-300 pointer-events-none select-none",
                        hoveredProduct === `recent-${product.id}-${index}` && (product.images?.[1] as any)?.url ? "scale-110" : "scale-100"
                      )}
                      sizes="(max-width: 768px) 33vw, (max-width: 1280px) 33vw, 25vw"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    {/* Loading Spinner */}
                    {loadingProducts.has(product.id) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-30">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-black"></div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 text-red-600 text-sm font-medium opacity-80">
                      FINEYST
                    </div>
                    <motion.button
                      className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm z-10"
                      aria-label="Add to wishlist"
                      whileHover={{ scale: 1.2, backgroundColor: "#f8f8f8" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (wishlist.isInWishlist(product.id)) {
                          wishlist.removeItem(product.id)
                        } else {
                          wishlist.addItem(product)
                        }
                      }}
                    >
                      <Heart className={`w-6 h-6 ${mounted && wishlistItems.includes(product.id) ? 'fill-black' : ''}`} />
                    </motion.button>
                    {product.isFeatured && (
                      <motion.div
                        className="absolute top-2 left-0 z-10 scale-90"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <div className="relative">
                          <div className="bg-black text-white py-0.5 px-1.5 shadow-md flex items-center">
                            <span className="font-semibold tracking-wide text-[9px]">BEST SELLING</span>
                          </div>
                          <div className="absolute top-full left-0 w-0 h-0 border-t-[5px] border-t-red-800 border-r-[5px] border-r-transparent"></div>
                        </div>
                      </motion.div>
                    )}
                    <AnimatePresence>
                      {hoveredProduct === `recent-${product.id}-${index}` && product.sizeDetails && product.sizeDetails.length > 0 && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-70 z-20"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.15 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-3">
                            <div className="text-xs mb-2">
                              Quick Shop <span className="text-gray-500">(Select your Size)</span>
                            </div>
                            <div className="flex gap-1 overflow-x-auto">
                              {product.sizeDetails.map((size) => (
                                <button
                                  key={size.id}
                                  className={cn(
                                    "px-3 py-1.5 text-xs border-black hover:border-black transition-colors whitespace-nowrap flex-shrink-0",
                                    selectedSizes[product.id] === size.name ? "border-black" : "border-black",
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSizeSelect(product.id, size.name)
                                  }}
                                >
                                  {size.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                

                  <div className="mt-6 xs:mt-6 sm:mt-6 md:mt-4 lg:mt-4 xl:mt-4 2xl:mt-4">
                    <h3 className="text-sm line-clamp-1">{product.name.toUpperCase()}</h3>
                    <div className="mt-1 xs:mt-1 sm:mt-1 md:mt-1 lg:mt-1 xl:mt-1 2xl:mt-1">
                      {product.salePrice && Number(product.salePrice) > 0 ? (
                        <div className="flex items-center gap-1">
                          <span className="text-sm line-through text-black-500">${product.price}</span>
                          <span className="text-sm font-bold text-black">${product.salePrice}</span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-black">${product.price}</span>
                      )}
                    </div>
                    {/* Color Options */}
                    <div className="mt-2">
                      <div 
                        className="relative inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-black"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {((product as any).colorDetails || (product as any).colors || [{ value: '#000000', name: 'Black' }]).slice(0, 1).map((color: any, index: number) => (
                          <div key={index} className="flex items-center gap-1">
                            <div
                              className="w-4 h-4 rounded-full border border-black/30"
                              style={{ backgroundColor: color.value || '#000000' }}
                            />
                            <span className="text-xs text-gray-700">{color.name || 'Black'}</span>
                          </div>
                        ))}
                        {((product as any).colorDetails || (product as any).colors || []).length > 1 && (
                          <>
                            <button 
                              ref={(el) => {
                                if (el) colorTriggerRefs.current[`recent-${product.id}-${index}`] = el
                              }}
                              data-color-trigger
                              onClick={(e) => {
                                e.stopPropagation()
                                const productKey = `${product.id}-${index}`
                                if (colorPopup?.productKey === productKey) {
                                  setColorPopup(null)
                                } else {
                                  const button = e.currentTarget
                                  const rect = button.getBoundingClientRect()
                                  setColorPopup({ productKey, rect })
                                }
                              }}
                              className={cn(
                                "text-xs transition-colors",
                                colorPopup?.productKey === `${product.id}-${index}` && isDesktop
                                  ? "absolute inset-0 flex items-center justify-center bg-black text-white border border-black font-medium" 
                                  : "text-gray-500 hover:text-gray-700 underline"
                              )}
                            >
                              {colorPopup?.productKey === `${product.id}-${index}` && isDesktop
                                ? "Hide colors" 
                                : `+${((product as any).colorDetails || (product as any).colors || []).length - 1} more`
                              }
                            </button>
                            
                           {/* Color Popup inside the color box container */}
                            {colorPopup?.productKey === `${product.id}-${index}` && isDesktop && (
                              <div className="absolute -top-32 left-0 z-50 bg-white border-2 border-gray-600 shadow-2xl w-52">
                                <div className="p-3">
                                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-black-200">
                                    <h4 className="text-sm font-semibold text-grey">
                                      Color: {(() => {
                                        const colors = (product as any)?.colorDetails || (product as any)?.colors || []
                                        return colors[0]?.name || 'Black'
                                      })()}
                                    </h4>
                                  </div>
                                  <div className="flex gap-2 mb-2">
                                    {((product as any)?.colorDetails || (product as any)?.colors || []).map((color: any) => {
                                      const colorLinks = product?.colorLinks || {}
                                      const colorLink = colorLinks[color.name]
                                      
                                      return (
                                        <div 
                                          key={color.id} 
                                          className="cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md"
                                          onClick={async (e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            
                                            if (colorLink && colorLink.trim() !== '') {
                                              try {
                                                const currentProductIndex = currentProducts.findIndex(p => p.id === product.id)
                                                if (currentProductIndex === -1) return
                                                
                                                setLoadingProducts(prev => new Set([...prev, product.id]))
                                                
                                                const response = await fetch(`/api/product-by-url?url=${encodeURIComponent(colorLink)}`)
                                                
                                                if (response.ok) {
                                                  const newProduct = await response.json()
                                                  
                                                  if (newProduct && newProduct.name && newProduct.id) {
                                                    setCurrentProducts(prev => {
                                                      const updated = [...prev]
                                                      updated[currentProductIndex] = newProduct
                                                      return updated
                                                    })
                                                  }
                                                }
                                              } catch (error) {
                                                console.error('Error:', error)
                                              } finally {
                                                setLoadingProducts(prev => {
                                                  const newSet = new Set(prev)
                                                  newSet.delete(product.id)
                                                  return newSet
                                                })
                                              }
                                            }
                                            
                                            setColorPopup(null)
                                          }}
                                        >
                                          <div className="w-10 h-10 rounded-full border-2 border-gray-600 shadow-sm">
                                            <div
                                              className="w-full h-full rounded-full border-2 border-white"
                                              style={{ backgroundColor: color.value }}
                                            />
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Color Popup - Mobile/Tablet Modal */}
                            {colorPopup?.productKey === `${product.id}-${index}` && !isDesktop && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
                                <div className="bg-white rounded-t-lg w-full max-h-[80vh] overflow-y-auto">
                                  {/* Header */}
                                  <div className="flex items-center justify-between p-5 ">
                                    <h2 className="text-lg font-bold">Select Color</h2>
                                    <button
                                      onClick={() => setColorPopup(null)}
                                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                      <X size={20} />
                                    </button>
                                  </div>
                                  
                                  {/* Colors Grid */}
                                  <div className="p-4">
                                    <div className="grid grid-cols-4 gap-4">
                                      {((product as any)?.colorDetails || (product as any)?.colors || []).map((color: any) => {
                                        const colorLinks = product?.colorLinks || {}
                                        const colorLink = colorLinks[color.name]
                                        
                                        return (
                                          <div
                                            key={color.id}
                                            className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                            onClick={async (e) => {
                                              e.preventDefault()
                                              e.stopPropagation()
                                              
                                              if (colorLink && colorLink.trim() !== '') {
                                                try {
                                                  const currentProductIndex = currentProducts.findIndex(p => p.id === product.id)
                                                  if (currentProductIndex === -1) return
                                                  
                                                  setLoadingProducts(prev => new Set([...prev, product.id]))
                                                  
                                                  const response = await fetch(`/api/product-by-url?url=${encodeURIComponent(colorLink)}`)
                                                  
                                                  if (response.ok) {
                                                    const newProduct = await response.json()
                                                    
                                                    if (newProduct && newProduct.name && newProduct.id) {
                                                      setCurrentProducts(prev => {
                                                        const updated = [...prev]
                                                        updated[currentProductIndex] = newProduct
                                                        return updated
                                                      })
                                                    }
                                                  }
                                                } catch (error) {
                                                  console.error('Error:', error)
                                                } finally {
                                                  setLoadingProducts(prev => {
                                                    const newSet = new Set(prev)
                                                    newSet.delete(product.id)
                                                    return newSet
                                                  })
                                                }
                                              }
                                              
                                              setColorPopup(null)
                                            }}
                                          >
                                            <div className="w-12 h-12 rounded-full border-2 border-gray-300">
                                              <div
                                                className="w-full h-full rounded-full border-2 border-white"
                                                style={{ backgroundColor: color.value }}
                                              />
                                            </div>
                                            <span className="text-xs text-center font-medium">{color.name}</span>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          {/* Desktop Navigation Buttons - Always Visible, Updated Style */}
          {/* Removed opacity-0 group-hover:opacity-100 and adjusted top position */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute -left-4 lg:-left-6 top-1/3 bg-black text-white p-2 shadow-lg hover:bg-gray-800 transition-colors z-10 flex items-center justify-center"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {currentIndex < maxIndex && (
            <button
              onClick={handleNext}
              className="absolute -right-4 lg:-right-6 top-1/3 bg-black text-white p-2 shadow-lg hover:bg-gray-800 transition-colors z-10 flex items-center justify-center"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
      


    </div>
  )
}

export default RecentlyViewed