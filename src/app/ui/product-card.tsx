"use client"

import type { Product } from "@/types"
import Image from "next/image"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "../lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import useWishlist from "../hooks/use-wishlist"
import { useCart } from "@/src/app/contexts/CartContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog"

// Shimmer effect for image loading
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stopColor="#f6f7f8" offset="20%" />
      <stop stopColor="#edeef1" offset="50%" />
      <stop stopColor="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlinkHref="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
</svg>`

const toBase64 = (str: string) =>
  typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str)

interface ProductCardProps {
  data: Product
  onMouseEnter?: () => void
}

const ProductCard = ({ data, onMouseEnter }: ProductCardProps) => {
  const router = useRouter()
  const wishlist = useWishlist()
  const { addToCart } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  const [selectedSize, setSelectedSize] = useState<{ id: string; name: string; value: string } | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [colorDialogOpen, setColorDialogOpen] = useState(false)

  // Client-side only effects
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleClick = () => {
    // Save current page using the page state module
    if (typeof window !== 'undefined') {
      // Import the page state module
      const { setShopPage } = require('../../app/shop/page-state');
      const urlParams = new URLSearchParams(window.location.search);
      const currentPage = parseInt(urlParams.get('page') || '1', 10);
      setShopPage(currentPage);
    }
    router.push(`/product/${data.slug || data.id}`)
  }

  const handleSizeSelect = (size: { id: string; name: string; value: string }) => {
    setSelectedSize(size)
  }

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    wishlist.addItem(data)
  }

  // Check if product has sizes
  const hasSizes = data.sizeDetails && Array.isArray(data.sizeDetails) && data.sizeDetails.length > 0
  
  // Get primary color if available
  const primaryColor = data.colorDetails && data.colorDetails.length > 0 ? data.colorDetails[0] : null
  
  // No need for debug logging in production

  // Non-JS fallback
  if (!isMounted) {
    return (
      <div className="group cursor-pointer rounded-xl bg-white p-3 space-y-4 relative">
        <div className="aspect-[3/4] rounded-xl bg-gray-100 relative overflow-hidden">
          <Image 
            src={data?.images?.[0]?.url || "/placeholder.svg"} 
            alt={data.name} 
            fill 
            className="object-cover" 
          />
        </div>
        <div>
          <p className="font-semibold text-lg">{data.name}</p>
          <p className="text-sm text-gray-500">{data.category?.name}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="font-bold text-lg">${data.price}</div>
        </div>
        <div className="flex items-center gap-2">
          {data.colors && data.colors.slice(0, 3).map((color, i) => (
            <div 
              key={i} 
              className="h-6 w-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: color.value || color.hex || color || "#000000" }}
            />
          ))}
          {data.colors && data.colors.length > 3 && (
            <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
              +{data.colors.length - 3} colors
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative cursor-pointer rounded-xl bg-white p-3 space-y-4"
      onClick={handleClick}
      onMouseEnter={() => {
        setIsHovered(true)
        if (onMouseEnter) onMouseEnter()
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
        <Image
          src={data?.images?.[0]?.url || "/placeholder.svg"}
          alt={data.name}
          fill
          className={cn(
            "object-cover transition-transform duration-300",
            isHovered ? "scale-110" : "scale-100"
          )}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 400))}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Wishlist button */}
        <motion.button
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm z-10"
          aria-label="Add to wishlist"
          whileHover={{ scale: 1.2, backgroundColor: "#f8f8f8" }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAddToWishlist}
        >
          <Heart 
            className="w-5 h-5" 
            fill={wishlist.isInWishlist(data.id) ? "#B01E23" : "none"}
            color={wishlist.isInWishlist(data.id) ? "#B01E23" : "currentColor"}
          />
        </motion.button>

        {/* Featured badge */}
        {data.isFeatured && (
          <motion.div
            className="absolute top-1 sm:top-3 left-0 z-10 scale-[0.5] sm:scale-[0.6] md:scale-75"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="relative">
              <div className="bg-black text-white py-0.5 sm:py-0.5 md:py-0.5 px-1.5 sm:px-1.5 md:px-2 shadow-md flex items-center">
                <span className="font-semibold tracking-wide text-[8px] sm:text-[9px] md:text-[10px]">BEST SELLING</span>
              </div>
              <div className="absolute top-full left-0 w-0 h-0 border-t-[3px] sm:border-t-[4px] md:border-t-[6px] border-t-red-800 border-r-[3px] sm:border-r-[4px] md:border-r-[6px] border-r-transparent"></div>
            </div>
          </motion.div>
        )}

        {/* Quick Shop Size Selection */}
        <AnimatePresence>
          {isHovered && hasSizes && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 sm:p-4">
                <div className="text-xs sm:text-sm mb-2">
                  Quick Shop <span className="text-gray-500">(Select Size)</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2">
                  {data.sizes.map((size) => (
                    <button
                      key={size.id}
                      className={cn(
                        "py-1 sm:py-2 text-center text-xs sm:text-sm border hover:border-black transition-colors",
                        selectedSize?.id === size.id ? "border-black bg-black text-white" : "border-gray-200"
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSizeSelect(size)
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

      <div className="mt-3 sm:mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm sm:text-base font-bold line-clamp-1 flex-1">{data.name}</h3>
          <p className="text-base sm:text-lg font-bold ml-2 whitespace-nowrap">
            ${data.price}
          </p>
        </div>
        
        {/* Color display with ball */}
        {primaryColor && primaryColor.value && (
          <div className="flex items-center gap-1 mt-1">
            <div 
              className="h-4 w-4 rounded-full border border-gray-300"
              style={{ backgroundColor: primaryColor.value || primaryColor.hex || primaryColor }}
            />
            <span className="text-xs text-gray-500">{primaryColor.name}</span>
          </div>
        )}
        
        {/* Category name if available */}
        {data.category?.name && (
          <p className="text-xs text-gray-500 mt-1">{data.category.name}</p>
        )}
        
        {/* Color Options */}
        {data.colors && data.colors.length > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
            {/* Show first 3 colors */}
            {data.colors.slice(0, 3).map((color) => (
              <motion.div
                key={color.id}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-300 flex items-center justify-center"
                style={{ backgroundColor: color.value || color.hex || color }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}

            {/* Show +X colors button if there are more colors */}
            {data.colors.length > 3 && (
              <Dialog open={colorDialogOpen} onOpenChange={setColorDialogOpen}>
                <DialogTrigger asChild>
                  <motion.button
                    className="h-4 sm:h-5 px-1.5 sm:px-2 text-[10px] sm:text-xs font-medium bg-black text-white rounded-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setColorDialogOpen(true)
                    }}
                  >
                    +{data.colors.length - 3}
                  </motion.button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Available Colors</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-5 sm:grid-cols-4 gap-2 sm:gap-3">
                    {data.colors.map((color) => (
                      <motion.div
                        key={color.id}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center"
                        style={{ backgroundColor: color.value || color.hex || color }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span className="sr-only">{color.name}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs sm:text-sm text-gray-600 border-t pt-3">
                    {data.colors.length} colors available
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ProductCard