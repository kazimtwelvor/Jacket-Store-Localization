"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Product } from "@/types"

// Helper function to generate a slug
const getProductSlug = (product: Product): string => {
  if (product.slug) return product.slug
  if (product.name) {
    const baseSlug = product.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
    return product.id ? `${baseSlug}-${product.id.substring(0, 8)}` : baseSlug
  }
  return product.id
}

interface ProductCardProps {
  product: Product
}

const ProductCardNew = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const slug = getProductSlug(product)
  
  // Check if product has sizes
  const hasSizes = product.sizeDetails && product.sizeDetails.length > 0
  
  const handleSizeSelect = (e: React.MouseEvent, sizeValue: string) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedSize(sizeValue)
  }
  
  return (
    <div 
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={product.images?.[0]?.image?.url || "/placeholder.svg"}
            alt={product.name}
            fill
            className={cn(
              "object-cover object-center transition-transform duration-300",
              isHovered ? "scale-110" : "scale-100",
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* Size Selection Overlay - Only show when hovered and product has sizes */}
          {isHovered && hasSizes && (
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 z-20 p-4">
              <div className="text-sm mb-2">
                <span className="text-gray-500">Select Size</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {product.sizeDetails?.map((size) => (
                  <button
                    key={size.id}
                    className={cn(
                      "py-2 text-center text-sm border hover:border-black transition-colors",
                      selectedSize === size.value ? "border-black bg-black text-white" : "border-gray-200"
                    )}
                    onClick={(e) => handleSizeSelect(e, size.value)}
                  >
                    {size.value}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-base font-bold line-clamp-1">{product.name.toUpperCase()}</h3>
          <p className="text-lg font-bold mt-1">
            ${Number.parseFloat(product.price?.toString() || "0").toFixed(2)}
          </p>
          
          {/* Color Options */}
          <div className="flex items-center gap-2 mt-3">
            {product.colorDetails &&
              product.colorDetails
                .slice(0, 3)
                .map((color) => (
                  <div
                    key={color.id}
                    className="w-5 h-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.value || color.hex || color }}
                  />
                ))}

            {product.colorDetails && product.colorDetails.length > 3 && (
              <button
                className="h-5 px-2 text-xs font-medium bg-gray-100 rounded-full hover:bg-gray-200"
              >
                +{product.colorDetails.length - 3} colors
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCardNew