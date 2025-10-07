"use client"

import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import type { Product } from "@/types"
import { stripH2Tags } from "../lib/stripHeadings"

interface ProductDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
}

const ProductDetailsModal = ({ isOpen, onClose, product }: ProductDetailsModalProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-[999999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#2b2b2b]">Product Details</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Product Name */}
              <div>
                <span className="font-bold text-xl mb-2">{product.name}</span>
                <p className="text-gray-600">SKU: {product.sku || "N/A"}</p>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-semibold text-[#2b2b2b] mb-3">Description</h2>
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: stripH2Tags(product.description || "No description available") }}
                />
              </div>

              {/* Specifications */}
              <div>
                <h4 className="font-semibold text-[#2b2b2b] mb-3">Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><span className="font-medium">Material:</span> {product.material || "Premium fabric"}</p>
                    <p><span className="font-medium">Fit:</span> {product.specifications?.fit || "Regular fit"}</p>
                    <p><span className="font-medium">Care:</span> Machine wash cold</p>
                  </div>
                  <div className="space-y-2">
                    <p><span className="font-medium">Origin:</span> {(product as any).origin || "Made with care"}</p>
                    <p><span className="font-medium">Weight:</span> {product.weight || "Lightweight"}</p>
                    <p><span className="font-medium">Season:</span> {(product as any).season || "All season"}</p>
                  </div>
                </div>
              </div>

              {/* Care Instructions */}
              <div>
                <h4 className="font-semibold text-[#2b2b2b] mb-3">Care Instructions</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Machine wash cold with similar colors</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low</li>
                  <li>Iron on low heat if needed</li>
                  <li>Do not dry clean</li>
                </ul>
              </div>

              {/* Additional Info */}
              {(product as any).additionalInfo && (
                <div>
                  <h4 className="font-semibold text-[#2b2b2b] mb-3">Additional Information</h4>
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: stripH2Tags((product as any).additionalInfo) }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}

export default ProductDetailsModal