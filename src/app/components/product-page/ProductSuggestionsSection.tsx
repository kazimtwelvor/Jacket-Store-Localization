"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types"
import WeThinkYouWillLove from "../../category/WeThinkYouWillLove"
import RecentlyViewed from "../../category/RecentlyViewed"
import RelatedProducts from "./related-products"
import { useRouter } from "next/navigation"
import { useCart } from "../../contexts/CartContext"
import MobileAddToCartModal from "../../modals/MobileAddToCartModal"

interface ProductSuggestionsSectionProps {
  suggestProducts: Product[]
  relatedProductIds?: string[]
  isMobile: boolean
}

export const ProductSuggestionsSection = ({ suggestProducts, relatedProductIds, isMobile }: ProductSuggestionsSectionProps) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])
  const [mobileCartModal, setMobileCartModal] = useState<{ isOpen: boolean; product: Product | null }>({
    isOpen: false,
    product: null
  })
  const [isMobileView, setIsMobileView] = useState(false)
  const router = useRouter()
  const { addToCart } = useCart()

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'

    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)

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
    return () => {
      window.removeEventListener('resize', checkMobile)
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
    
    if (isMobileView) {
      console.log('Opening mobile cart modal')
      setMobileCartModal({ isOpen: true, product })
    } else {
      console.log('Adding directly to cart')
      const defaultSize = product.sizeDetails && product.sizeDetails.length > 0 
        ? product.sizeDetails[0].name 
        : 'Default'
      const defaultColor = product.colorDetails && product.colorDetails.length > 0 
        ? product.colorDetails[0].name 
        : 'Default'
      
      addToCart(product, defaultSize, defaultColor)
    }
  }

  return (
    <div className="flex flex-col w-full min-h-0 space-y-4 pb-12 pt-5 md:space-y-8 lg:space-y-4 items-center ml-2 sm:ml-0" style={{ backgroundColor: '#F9F9F9', minHeight: 'fit-content', maxWidth: '100vw', overflow: 'hidden' }}>
      {relatedProductIds && relatedProductIds.length > 0 && (
        <RelatedProducts
          relatedProductIds={relatedProductIds}
          hoveredProduct={hoveredProduct}
          setHoveredProduct={setHoveredProduct}
          selectedSizes={selectedSizes}
          addToRecentlyViewed={addToRecentlyViewed}
          handleClick={handleProductClick}
          handleSizeSelect={handleSizeSelect}
          onAddToCartClick={handleAddToCart}
        />
      )}
      
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

      {mobileCartModal.isOpen && mobileCartModal.product && (
        <MobileAddToCartModal
          isOpen={mobileCartModal.isOpen}
          onClose={() => setMobileCartModal({ isOpen: false, product: null })}
          product={mobileCartModal.product}
          availableSizes={mobileCartModal.product.sizeDetails || []}
          availableColors={mobileCartModal.product.colorDetails || []}
          selectedColorId={mobileCartModal.product.colorDetails?.[0]?.id || ''}
        />
      )}
    </div>
  )
}