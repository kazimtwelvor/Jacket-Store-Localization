import React, { useState, useRef } from "react"
import type { Product } from "@/types"
import { cn } from "@/src/app/lib/utils"
import { X } from "lucide-react"

interface ColorSelectorProps {
  product: Product
  availableColors: any[]
  onColorClick: () => void
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({ 
  product, 
  availableColors, 
  onColorClick 
}) => {
  const hasMultipleColors = availableColors.length > 1
  
  if (!hasMultipleColors) {
    return (
      <div className="mt-2">
        <div className="relative inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-black">
          <div className="flex items-center gap-1">
            <div 
              className="w-4 h-4 rounded-full border border-black/30" 
              style={{ backgroundColor: availableColors[0]?.value || "#000000" }} 
            />
            <span className="text-xs text-gray-700">{availableColors[0]?.name || "Black"}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-2">
      <div className="relative inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-black min-w-fit">
        <div className="flex items-center gap-1">
          <div 
            className="w-4 h-4 rounded-full border border-black/30" 
            style={{ backgroundColor: availableColors[0]?.value || "#000000" }} 
          />
          <span className="text-xs text-gray-700">{availableColors[0]?.name || "Black"}</span>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            onColorClick()
          }}
          className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
        >
          {`+${availableColors.length - 1} more`}
        </button>
      </div>
    </div>
  )
}
