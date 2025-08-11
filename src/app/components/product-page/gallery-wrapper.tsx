"use client"

// import Gallery from "../../gallery"
// import useCart from "../../hooks/use-cart"
// import useWishlist from "../../hooks/use-wishlist"
import { useState } from "react"
import type { ProductImage, Product } from "@/types"
import { useCart } from "../../contexts/CartContext"
import useWishlist from "../../hooks/use-wishlist"
import Gallery from "../gallery"

interface GalleryWrapperProps {
  images: ProductImage[]
  product: Product
}

const GalleryWrapper: React.FC<GalleryWrapperProps> = ({ images, product }) => {
  const cart = useCart()
  const wishlist = useWishlist()
  const isInWishlist = wishlist.isInWishlist(product.id)
  const [showMobileSizeModal, setShowMobileSizeModal] = useState(false)

  const handleAddToCart = () => {
    alert('Button clicked!')
    setShowMobileSizeModal(true)
  }

  const handleAddToWishlist = () => {
    wishlist.addItem(product)
  }

  return (
    <>
      <Gallery
        images={images} 
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        isInWishlist={isInWishlist}
      />
      
      {/* Mobile Size Selection Modal */}
      {showMobileSizeModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[99999]" 
          onClick={() => setShowMobileSizeModal(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}
        >
          <div className="absolute bottom-0 left-0 right-0 w-full bg-white rounded-t-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <h3 className="text-lg font-bold text-black mb-4">Select Size</h3>
              <p className="text-gray-600 mb-4">Please select a size to add this item to your cart.</p>
              <button
                onClick={() => setShowMobileSizeModal(false)}
                className="w-full py-4 bg-black text-white font-bold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default GalleryWrapper