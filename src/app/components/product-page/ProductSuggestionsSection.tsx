"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types"
import WeThinkYouWillLove from "../../category/WeThinkYouWillLove"
import RecentlyViewed from "../../category/RecentlyViewed"
import { useRouter } from "next/navigation"

interface ProductSuggestionsSectionProps {
  suggestProducts: Product[]
  isMobile: boolean
}

export const ProductSuggestionsSection = ({ suggestProducts, isMobile }: ProductSuggestionsSectionProps) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])
  const router = useRouter()

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'

    const stored = localStorage.getItem('recentlyViewed')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed)
        }
      } catch (error) {
        setRecentlyViewed([])
      }
    } else {
    }
  }, [])

  const addToRecentlyViewed = (product: Product) => {
    const updated = [product, ...recentlyViewed.filter(p => p.id !== product.id)].slice(0, 10)
    setRecentlyViewed(updated)
    localStorage.setItem('recentlyViewed', JSON.stringify(updated))
  }

  const handleProductClick = (product: Product) => {
    addToRecentlyViewed(product)
    router.push(`/product/${product.slug || product.id}`)
  }

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }))
  }

  const handleAddToCart = (product: Product) => {
    console.log('Adding to cart:', product)
  }

  return (
    <div className="flex flex-col w-full min-h-0 space-y-4 pb-12 pt-5 md:space-y-8 lg:space-y-4 items-center ml-2 sm:ml-0" style={{ backgroundColor: '#F9F9F9', minHeight: 'fit-content', maxWidth: '100vw', overflow: 'hidden' }}>
      <WeThinkYouWillLove
        products={suggestProducts}
        hoveredProduct={hoveredProduct}
        setHoveredProduct={setHoveredProduct}
        selectedSizes={selectedSizes}
        addToRecentlyViewed={addToRecentlyViewed}
        handleClick={handleProductClick}
        handleSizeSelect={handleSizeSelect}
        onAddToCartClick={handleAddToCart}
      />

      <RecentlyViewed
        recentlyViewed={recentlyViewed}
        hoveredProduct={hoveredProduct}
        setHoveredProduct={setHoveredProduct}
        selectedSizes={selectedSizes}
        addToRecentlyViewed={addToRecentlyViewed}
        handleClick={handleProductClick}
        handleSizeSelect={handleSizeSelect}
        onAddToCartClick={handleAddToCart}
      />
    </div>
  )
}