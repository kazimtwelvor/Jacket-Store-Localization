import React from "react"
import type { Product } from "@/types"
import { cn } from "@/src/app/lib/utils"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCountry } from "@/src/hooks/use-country"

interface ProductCardFallbackProps {
  product: Product
  index: number
  isDesktop: boolean
  hoveredProduct: string | null
  setHoveredProduct: (productId: string | null) => void
  selectedSizes: Record<string, string>
  handleSizeSelect: (productId: string, size: string) => void
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
}

export const ProductCardFallback: React.FC<ProductCardFallbackProps> = ({
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
  openColorModal,
  setOpenColorModal,
  productRefs,
}) => {
  const { countryCode } = useCountry();
  const isHovered = hoveredProduct === `grid-${product.id}-${index}`
  const hasMultipleImages = product.images && product.images.length > 1
  const availableSizes = product.sizeDetails || []
  const selectedProductSizes = selectedSizes[product.id] || []
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
    <div
      id={`product-${product.id}`}
      className="group relative cursor-pointer flex flex-col h-full"
      onClick={() => {
        if (!isDesktop && wasDraggedRef.current) return
        addToRecentlyViewed(product)
        handleClick(product)
      }}
      onMouseEnter={() => isDesktop && setHoveredProduct(`grid-${product.id}-${index}`)}
      onMouseLeave={() => isDesktop && setHoveredProduct(null)}
    >
      <div className="relative w-full aspect-[3/5] bg-gray-100 overflow-visible md:overflow-hidden">
        {isDesktop ? (
          <div className="w-full h-full overflow-hidden relative">
            <Link href={getProductUrl(product)}>
              <Image
                src={isHovered && hasMultipleImages ? (product.images[1] as any).url : ((product.images?.[0] as any)?.url || "/placeholder.svg")}
                alt={product.name}
                fill
                className={cn("object-cover object-top transition-all duration-300", isHovered && hasMultipleImages ? "scale-110" : "scale-100")}
                sizes="(max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />
            </Link>
            {loadingProducts.has(product.id) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-30">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-gray-400"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full overflow-hidden relative">
            <Link href={getProductUrl(product)}>
              <Image
                src={(product.images?.[0] as any)?.url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </Link>
            {loadingProducts.has(product.id) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-30">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-gray-400"></div>
              </div>
            )}
          </div>
        )}

        <button
          className="absolute md:top-2 md:right-2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white flex items-center justify-center shadow-md z-10 -bottom-4 right-12 hover:scale-110 transition-transform"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.stopPropagation()
            // No-JS fallback: direct navigation to product page
            window.location.href = `/${countryCode}/product/${product.slug}`
          }}
        >
          <Heart className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
        </button>

        <button
          className="md:hidden absolute w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-md z-48 right-2 -bottom-4 md:top-3 md:right-3 md:bottom-auto"
          aria-label="Add to cart"
          onClick={(e) => {
            e.stopPropagation()
            // No-JS fallback: direct navigation to product page
            window.location.href = `/${countryCode}/product/${product.slug}`
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
          <div className="absolute bottom-2 left-2 right-2 z-20">
            <div className="bg-white rounded-lg shadow-lg p-2">
              <div className="flex flex-wrap gap-1">
                {availableSizes.map((size: any) => (
                  <button
                    key={size.id || size}
                    className={cn(
                      "px-2 py-1 text-xs rounded border transition-colors",
                      selectedProductSizes.includes(size.name || size)
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300 hover:border-black"
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSizeSelect(product.id, size.name || size)
                    }}
                  >
                    {size.name || size}
                  </button>
                ))}
              </div>
            </div>
          </div>
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
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs text-gray-600">Colors:</span>
            <div className="flex gap-1">
              {availableColors.slice(0, 4).map((color, colorIndex) => (
                <button
                  key={colorIndex}
                  className="w-4 h-4 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.hex || color.name }}
                  title={color.name}
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpenColorModal({ isOpen: true, product })
                  }}
                />
              ))}
              {availableColors.length > 4 && (
                <span className="text-xs text-gray-500">+{availableColors.length - 4}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
