import React, { useState, useEffect } from "react"
import type { Product } from "@/types"
import { cn } from "@/src/app/lib/utils"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ProductImageCarousel } from "./ProductImageCarousel"
import { ColorSelector } from "./ColorSelector"
import { SizeSelector } from "./SizeSelector"
import { trackAddToWishlist } from "@/src/app/lib/analytics"
import { useCountry } from "@/src/hooks/use-country"

interface ProductCardProps {
  product: Product
  index: number
  isDesktop: boolean
  hoveredProduct: string | null
  setHoveredProduct: (id: string | null) => void
  selectedSizes: Record<string, string>
  selectedColors: Record<string, string>
  handleSizeSelect: (productId: string, size: string) => void
  handleColorSelect: (colorId: string, productId: string) => void
  handleClick: (product: Product) => void
  addToRecentlyViewed: (product: Product) => void
  wishlist: any
  setMobileCartModal: (modal: { isOpen: boolean; product: Product | null }) => void
  loadingProducts: Set<string>
  visibleProducts: string[]
  wasDraggedRef: React.MutableRefObject<boolean>
  openColorModal: { isOpen: boolean; product: Product | null }
  setOpenColorModal: (modal: { isOpen: boolean; product: Product | null }) => void
  productRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  onProductUpdate?: (updatedProduct: Product) => void
  setLoadingProducts?: React.Dispatch<React.SetStateAction<Set<string>>>
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  isDesktop,
  hoveredProduct,
  setHoveredProduct,
  selectedSizes,
  selectedColors,
  handleSizeSelect,
  handleColorSelect,
  handleClick,
  addToRecentlyViewed,
  wishlist,
  setMobileCartModal,
  loadingProducts,
  visibleProducts,
  wasDraggedRef,
  openColorModal,
  setOpenColorModal,
  productRefs,
  onProductUpdate,
  setLoadingProducts,
}) => {
  const { countryCode } = useCountry();
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isHovered = hoveredProduct === `grid-${product.id}-${index}`
  const hasMultipleImages = product.images && product.images.length > 1
  const availableSizes = product.sizeDetails || []
  const selectedProductSizes = selectedSizes[product.id] ? [selectedSizes[product.id]] : []
  const availableColors = product.colorDetails || []
  
  const getProductUrl = (product: Product) => {
    if (product.slug) return `/${countryCode}/product/${product.slug}`
    if (product.name) {
      const baseSlug = product.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      return product.id ? `/${countryCode}/product/${baseSlug}-${product.id.substring(0, 8)}` : `/${countryCode}/product/${baseSlug}`
    }
    return `/${countryCode}/product/${product.id}`
  }

  return (
    <motion.div
      id={`product-${product.id}`}
      ref={(el) => { if (productRefs.current) productRefs.current[index] = el as HTMLDivElement | null; }}
      className="group relative cursor-pointer flex flex-col h-full"
      onClick={() => {
        if (!isDesktop && wasDraggedRef.current) return;
        addToRecentlyViewed(product)
        handleClick(product)
      }}
      onMouseEnter={() => isDesktop && setHoveredProduct(`grid-${product.id}-${index}`)}
      onMouseLeave={() => isDesktop && setHoveredProduct(null)}
      initial={loadingProducts.has(`${product.id}-${index}`) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={loadingProducts.has(`${product.id}-${index}`) ? { opacity: 1, y: 0 } : (visibleProducts.includes(product.id) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 })}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="relative w-full aspect-[3/5] bg-gray-100 overflow-visible lg:overflow-hidden">
        {isDesktop ? (
          <div className="w-full h-full overflow-hidden relative">
            <Link href={getProductUrl(product)}>
              <Image
                src={
                  isHovered && hasMultipleImages
                    ? (product.images[1] as any).url
                    : ((product.images?.[0] as any)?.url || "/placeholder.svg")
                }
                alt={product.name}
                fill
                className={cn(
                  "object-cover object-top transition-all duration-300",
                  isHovered && hasMultipleImages ? "scale-110" : "scale-100"
                )}
                sizes="(max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                priority={index < 4}
                loading={index < 4 ? "eager" : "lazy"}
              />
            </Link>
            {loadingProducts.has(`${product.id}-${index}`) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-30">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-gray-400"></div>
              </div>
            )}
          </div>
        ) : (
          <ProductImageCarousel product={product} wasDragged={wasDraggedRef} />
        )}

        <button
          className="absolute lg:top-2 lg:right-2 w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-white flex items-center justify-center shadow-md z-10 -bottom-4 right-12 hover:scale-110 transition-transform"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.stopPropagation()
            const uniqueKey = `${product.id}-${index}`
            if (wishlist.isInWishlistWithKey(uniqueKey)) {
              wishlist.removeItemWithKey(uniqueKey)
            } else {
              wishlist.addItemWithKey(product, uniqueKey)
              trackAddToWishlist(product)
            }
          }}
        >
          <Heart className={cn("w-4 h-4 md:w-5 md:h-5", wishlist.isInWishlistWithKey(`${product.id}-${index}`) ? "fill-black text-black" : "text-gray-700")} />
        </button>

        <button
          className="lg:hidden absolute w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-md z-48 right-2 -bottom-4 lg:top-3 lg:right-3 lg:bottom-auto"
          aria-label="Add to cart"
          onClick={(e) => {
            e.stopPropagation()
            setMobileCartModal({ isOpen: true, product })
          }}
        >
          <ShoppingCart className="w-4 h-4" />
        </button>

        {product.isFeatured && (
          <div className="absolute top-3 left-0 z-10">
            <div className="bg-black text-white py-0.5 px-2 shadow-md">
              <span className="font-semibold tracking-wide text-[8px] md:text-xs">BEST SELLING</span>
            </div>
          </div>
        )}

        {isDesktop && isHovered && availableSizes.length > 0 && (
          <SizeSelector
            product={product}
            selectedSizes={selectedProductSizes}
            onSizeSelect={handleSizeSelect}
          />
        )}
      </div>

      <div className="mt-6 xs:mt-6 sm:mt-6 md:mt-4 lg:mt-4 xl:mt-4 2xl:mt-4">
        <p className="text-sm line-clamp-1">{product.name.toUpperCase()}</p>
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

        {availableColors.length > 0 && (
          <ColorSelector
            product={product}
            availableColors={availableColors}
            isDesktop={isDesktop}
            selectedColorId={selectedColors[product.id]}
            onColorSelect={handleColorSelect}
            openColorModal={openColorModal}
            setOpenColorModal={setOpenColorModal}
            onProductUpdate={onProductUpdate}
            loadingProducts={loadingProducts}
            setLoadingProducts={setLoadingProducts}
            index={index}
          />
        )}
      </div>
    </motion.div>
  )
}