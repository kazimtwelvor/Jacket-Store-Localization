"use client"

import React, { useState, useEffect } from "react"
import type { Product } from "@/types"
import { ProductCard } from "./ProductCard"
import { ProductCardFallback } from "./ProductCardFallback"

interface ProductCardWrapperProps {
  product: Product
  index: number
  isDesktop: boolean
  hoveredProduct: string | null
  setHoveredProduct: (productId: string | null) => void
  selectedSizes: Record<string, string[]>
  handleSizeSelect: (productId: string, size: string) => void
  handleClick: (product: Product) => void
  addToRecentlyViewed: (product: Product) => void
  wishlist: any
  setMobileCartModal: (modal: { isOpen: boolean; product: Product }) => void
  loadingProducts: Set<string>
  visibleProducts: string[]
  wasDraggedRef: React.MutableRefObject<boolean>
  openColorModal: { isOpen: boolean; product: Product | null }
  setOpenColorModal: (modal: { isOpen: boolean; product: Product | null }) => void
}

export const ProductCardWrapper: React.FC<ProductCardWrapperProps> = (props) => {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return <ProductCardFallback {...props} />
  }

  return <ProductCard {...props} />
}
