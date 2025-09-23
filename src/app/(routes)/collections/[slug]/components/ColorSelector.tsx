import React, { useState, useRef } from "react"
import type { Product } from "@/types"
import { cn } from "@/src/app/lib/utils"
import { X } from "lucide-react"

interface ColorSelectorProps {
  product: Product
  availableColors: any[]
  isDesktop: boolean
  openColorModal: { isOpen: boolean; product: Product | null }
  setOpenColorModal: (modal: { isOpen: boolean; product: Product | null }) => void
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({ 
  product, 
  availableColors, 
  isDesktop,
  openColorModal,
  setOpenColorModal
}) => {
  const hasMultipleColors = availableColors.length > 1
  const isModalOpen = openColorModal.isOpen && openColorModal.product?.id === product.id
  
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
          data-color-trigger
          onClick={(e) => {
            e.stopPropagation()
            setOpenColorModal({ isOpen: !isModalOpen, product: isModalOpen ? null : product })
          }}
          className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
        >
          {`+${availableColors.length - 1} more`}
        </button>

        {isModalOpen && isDesktop && (
          <div className="absolute -top-32 left-0 z-[60] bg-white border-2 border-gray-600 shadow-2xl" style={{ width: Math.max(208, availableColors.length * 44 + 32) }}>
            <div className="p-3">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-black-200">
                <h4 className="text-sm font-semibold text-grey">
                  Color: {availableColors[0]?.name || "Black"}
                </h4>
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setOpenColorModal({ isOpen: false, product: null })
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex gap-2 mb-2 flex-wrap">
                {availableColors.map((color: any) => (
                  <div 
                    key={color.id || color.name} 
                    className="cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation(); 
                      setOpenColorModal({ isOpen: false, product: null })
                    }}
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-gray-600 shadow-sm">
                      <div 
                        className="w-full h-full rounded-full border-2 border-white" 
                        style={{ backgroundColor: color.value }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isModalOpen && !isDesktop && (
          <div 
            className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-end justify-center z-50"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setOpenColorModal({ isOpen: false, product: null })
            }}
          >
            <div 
              className="bg-white rounded-t-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5">
                <h2 className="text-lg font-bold">Select Color</h2>
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setOpenColorModal({ isOpen: false, product: null })
                  }} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-4 gap-4">
                  {availableColors.map((color: any) => (
                    <div 
                      key={color.id || color.name} 
                      className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      onClick={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation(); 
                        setOpenColorModal({ isOpen: false, product: null })
                      }}
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-gray-300">
                        <div 
                          className="w-full h-full rounded-full border-2 border-white" 
                          style={{ backgroundColor: color.value }} 
                        />
                      </div>
                      <span className="text-xs text-center font-medium">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
