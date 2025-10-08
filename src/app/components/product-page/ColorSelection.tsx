"use client"

import Link from "next/link"
import React, { useState } from "react"
import { cn } from "../../lib/utils"
import type { Color } from "@/types"
import ColorSelectionModal from "../../modals/ColorSelectionModal"
import ZipCodeModal from "../../modals/ZipCodeModal"

interface ColorSelectionProps {
  availableColors: Color[]
  selectedColorId: string
  setSelectedColorId: (id: string) => void
  selectedColorName: string
  isMobile: boolean
  colorLinks?: Record<string, string>
}

const ColorSelection = ({ 
  availableColors, 
  selectedColorId, 
  setSelectedColorId, 
  selectedColorName, 
  isMobile,
  colorLinks = {}
}: ColorSelectionProps) => {
  const [showColorModal, setShowColorModal] = useState(false)
  const [showZipModal, setShowZipModal] = useState(false)
  const [deliveryText, setDeliveryText] = useState("")
  
  const handleZipApply = (zipCode: string, deliveryText: string) => {
    setDeliveryText(deliveryText)
  }
  
  // Load cached delivery text on mount
  React.useEffect(() => {
    const savedDeliveryText = localStorage.getItem('savedDeliveryText')
    if (savedDeliveryText) {
      setDeliveryText(savedDeliveryText)
    }
  }, [])
  
  if (availableColors.length === 0) return null

  return (
    <div className={cn(isMobile ? "mb-4" : "mb-6 sm:mb-8")}>
      {isMobile ? (
        <>
          
          <div className="flex items-center gap-2 mb-3 color-selector">
            <button
              onClick={() => availableColors.length > 1 && setShowColorModal(true)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md transition-colors",
                availableColors.length > 1 ? "hover:bg-gray-100 cursor-pointer" : "cursor-default"
              )}
            >
              <div className="flex items-center gap-1">
                {availableColors.slice(0, 1).map((color: Color, index: number) => (
                  <div
                    key={index}
                    className="w-5 h-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.value || '#000000' }}
                  />
                ))}
              </div>
              <span className="text-[15px] text-gray-700 pointer-events-none">
                {availableColors.length > 1 
                  ? `+${availableColors.length - 1} Colors` 
                  : selectedColorName
                }
              </span>
            </button>
          </div>
          
          <ColorSelectionModal 
            isOpen={showColorModal}
            onClose={() => setShowColorModal(false)}
            availableColors={availableColors}
            selectedColorId={selectedColorId}
            setSelectedColorId={setSelectedColorId}
            colorLinks={colorLinks}
          />
          
          <div className="relative mt-6">
            {deliveryText ? (
              <div 
                className="text-xs text-gray-700 line-clamp-2 pointer-events-none"
                dangerouslySetInnerHTML={{ __html: deliveryText }}
              />
            ) : (
              <button
                onClick={() => setShowZipModal(true)}
                className="text-sm text-gray-600 underline hover:text-black transition-colors"
              >
                Enter a ZIP code to see a delivery date
              </button>
            )}
            
            <ZipCodeModal 
              isOpen={showZipModal}
              onClose={() => setShowZipModal(false)}
              onApply={handleZipApply}
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-x-1.5">
            <span className="text-[15px] font-medium text-gray-500">COLOR:</span>
            <span className="text-[15px] font-semibold uppercase text-black">{selectedColorName}</span>
          </div>
          <div className="border-b border-gray-200 mb-3"></div>
          <div className="flex flex-wrap gap-3 color-selector">
            {availableColors.map((color: Color) => {
              const colorLink = colorLinks[color.name]
              
              if (colorLink && selectedColorId !== color.id) {
                const modifiedLink = colorLink.replace('www.fineystjackets.com', 'www.fineystjackets.com')
                return (
                  <Link key={color.id} href={modifiedLink} aria-label={`View ${color.name} color option`}>
                    <div 
                      className={cn(
                        "w-[24px] h-[24px] rounded-full border-2 transition-all duration-200 cursor-pointer",
                        "border-gray-300 hover:ring-1 hover:ring-gray-400 hover:scale-105"
                      )}
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="sr-only">{color.name} color option</span>
                  </Link>
                )
              }
              
              return (
                <button
                  key={color.id}
                  onClick={() => setSelectedColorId(color.id)}
                  className={cn(
                    "relative flex items-center justify-center",
                    selectedColorId === color.id ? "z-10" : ""
                  )}
                >
                  <div 
                    className={cn(
                      "w-[24px] h-[24px] rounded-full border-2 transition-all duration-200",
                      selectedColorId === color.id 
                        ? "border-white ring-2 ring-black ring-offset-1 scale-110" 
                        : "border-gray-300 hover:ring-1 hover:ring-gray-400"
                    )}
                    style={{ backgroundColor: color.value }}
                  />
                </button>
              )
            })}
          </div>
          
          <div className="relative mt-8">
            {deliveryText ? (
              <div 
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: deliveryText }}
              />
            ) : (
              <button
                onClick={() => setShowZipModal(true)}
                className="text-sm text-gray-600 underline hover:text-black transition-colors"
              >
                Enter a ZIP code to see a delivery date
              </button>
            )}
            
            <ZipCodeModal 
              isOpen={showZipModal}
              onClose={() => setShowZipModal(false)}
              onApply={handleZipApply}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default ColorSelection