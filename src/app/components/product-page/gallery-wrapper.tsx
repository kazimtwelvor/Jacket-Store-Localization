"use client"

import { useState } from "react"
import type { ProductImage, Product } from "@/types"
import { useCart } from "../../contexts/CartContext"
import useWishlist from "../../hooks/use-wishlist"
import Gallery from "../gallery"
import MobileAddToCartModal from "../../modals/MobileAddToCartModal"
import React from "react"

interface GalleryWrapperProps {
  images: ProductImage[]
  product: Product
}

const GalleryWrapper: React.FC<GalleryWrapperProps> = ({ images, product }) => {
  const cart = useCart()
  const wishlist = useWishlist()
  const [hasMounted, setHasMounted] = useState(false)
  
  const isInWishlist = hasMounted ? wishlist.isInWishlist(product.id) : false
  
  const [showMobileSizeModal, setShowMobileSizeModal] = useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const handleAddToCart = () => {
    setShowMobileSizeModal(true)
  }

  const handleAddToWishlist = () => {
    if (isInWishlist) {
      wishlist.removeItem(product.id)
    } else {
      wishlist.addItem(product)
    }
  }

  return (
    <>
      <Gallery
        images={images} 
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        isInWishlist={isInWishlist}
      />
      
      <MobileAddToCartModal
        isOpen={showMobileSizeModal}
        onClose={() => setShowMobileSizeModal(false)}
        product={product}
        availableSizes={product.sizeDetails || []}
        availableColors={product.colorDetails || []}
        selectedColorId={product.colorDetails?.[0]?.id || ''}
      />
    </>
  )
}

export default GalleryWrapper