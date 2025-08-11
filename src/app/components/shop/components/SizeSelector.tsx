import React from "react"
import type { Product } from "@/types"
import { motion } from "framer-motion"
import { cn } from "../../../lib/utils"

interface SizeSelectorProps {
  product: Product
  selectedSizes: Record<string, string>
  handleSizeSelect: (productId: string, size: string) => void
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({ 
  product, 
  selectedSizes, 
  handleSizeSelect 
}) => {
  const availableSizes = product.sizeDetails || product.sizes || []

  if (availableSizes.length === 0) return null

  return (
    <motion.div 
      className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-70 z-20" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 20 }} 
      transition={{ duration: 0.15 }} 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3">
        <div className="text-xs mb-2">
          Quick Shop <span className="text-gray-500">(Select your Size)</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {availableSizes.map((size) => (
            <button
              key={size.id}
              className={cn(
                "px-3 py-1.5 text-xs border-black hover:border-black transition-colors", 
                selectedSizes[product.id] === size.name ? "border-black" : "border-black"
              )}
              onClick={(e) => {
                e.stopPropagation()
                handleSizeSelect(product.id, size.name)
              }}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
