import React from "react"
import type { Product } from "@/types"
import { cn } from "../../../lib/utils"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ProductImageCarousel } from "./ProductImageCarousel"
import { ColorSelector } from "./ColorSelector"
import { SizeSelector } from "./SizeSelector"

interface ProductCardProps {
  product: Product
  index: number
  isDesktop: boolean
  hoveredProduct: string | null
  setHoveredProduct: (id: string | null) => void
  selectedSizes: Record<string, string>
  handleSizeSelect: (productId: string, size: string) => void
  handleClick: (product: Product) => void
  addToRecentlyViewed: (product: Product) => void
  wishlist: any
  setMobileCartModal: (modal: { isOpen: boolean; product: Product | null }) => void
  loadingProducts: Set<string>
  visibleProducts: string[]
  wasDraggedRef: React.MutableRefObject<boolean>
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  isDesktop,
  hoveredProduct,
  setHoveredProduct,
  selectedSizes,
  handleSizeSelect,
  handleClick,
  addToRecentlyViewed,
  wishlist,
  setMobileCartModal,
  loadingProducts,
  visibleProducts,
  wasDraggedRef,
}) => {
  const isHovered = hoveredProduct === `grid-${product.id}`
  const hasMultipleImages = product.images && product.images.length > 1
  const availableSizes = product.sizeDetails || product.sizes || []
  const availableColors = product.colorDetails || product.colors || []

  return (
    <motion.div
      id={`product-${product.id}`}
      className="group relative cursor-pointer flex flex-col h-full"
      onClick={() => {
        if (!isDesktop && wasDraggedRef.current) return
        addToRecentlyViewed(product)
        handleClick(product)
      }}
      onMouseEnter={() => isDesktop && setHoveredProduct(`grid-${product.id}`)}
      onMouseLeave={() => isDesktop && setHoveredProduct(null)}
      initial={loadingProducts.has(product.id) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={loadingProducts.has(product.id) ? { opacity: 1, y: 0 } : visibleProducts.includes(product.id) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0 }}
    >
      <div className="relative w-full aspect-[3/5] bg-gray-100 overflow-visible md:overflow-hidden">
        {isDesktop ? (
          <div className="w-full h-full overflow-hidden relative">
            <Image
              src={isHovered && hasMultipleImages ? product.images[1].url : product.images?.[0]?.url || "/placeholder.svg"}
              alt={product.name}
              fill
              className={cn("object-cover object-top transition-all duration-300", isHovered && hasMultipleImages ? "scale-110" : "scale-100")}
              sizes="(max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />
            {loadingProducts.has(product.id) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-30">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-gray-400"></div>
              </div>
            )}
          </div>
        ) : (
          <ProductImageCarousel product={product} wasDragged={wasDraggedRef} />
        )}


        <button
          className="absolute w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md z-10 -bottom-4 right-10 md:top-- md:right-3"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.stopPropagation()
            wishlist.addItem(product)
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              stroke="black"
              strokeWidth="2"
              fill={wishlist.isInWishlist(product.id) ? "black" : "none"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          className="md:hidden absolute w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shadow-md z-48 right-2 left-38 -bottom-4 md:top-3 md:right-3 md:bottom-auto"
          aria-label="Add to cart"
          onClick={(e) => {
            e.stopPropagation()
            setMobileCartModal({ isOpen: true, product })
          }}
        >
          <ShoppingCart className="w-4 h-4" />
        </button>

        {product.isFeatured && (
          <motion.div
            className="absolute top-3 left-0 z-10"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="bg-black text-white py-0.5 px-2 shadow-md">
              <span className="font-semibold tracking-wide text-[8px] md:text-xs">BEST SELLING</span>
            </div>
          </motion.div>
        )}
        <AnimatePresence>
          {isDesktop && isHovered && availableSizes.length > 0 && (
            <SizeSelector
              product={product}
              selectedSizes={selectedSizes}
              handleSizeSelect={handleSizeSelect}
            />
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

        <ColorSelector
          product={product}
          isDesktop={isDesktop}
        />
      </div>
    </motion.div>
  )
}
