"use client"

import { ChevronDown, Check } from "lucide-react"
import { cn } from "../../lib/utils"
import Button from "../../ui/button"
import type { Size } from "@/types"

interface SizeSelectionProps {
  availableSizes: Size[]
  selectedSizeId: string
  setSelectedSizeId: (id: string) => void
  isDropdownOpen: boolean
  setIsDropdownOpen: (open: boolean) => void
  isMobile: boolean
  isLoading: boolean
  onAddToCart: () => void
  setShowMobileSizeModal: (show: boolean) => void
}

const SizeSelection = ({
  availableSizes,
  selectedSizeId,
  setSelectedSizeId,
  isDropdownOpen,
  setIsDropdownOpen,
  isMobile,
  isLoading,
  onAddToCart,
  setShowMobileSizeModal
}: SizeSelectionProps) => {
  if (availableSizes.length === 0) return null

  return (
    <div className="mb-6 sm:mb-8">
      <div id="size-selector" className="relative">
        <div className="relative">
          <div
            className="w-full border-2 bg-black/[0.04]   
             
            cursor-pointer transition-colors
            
            "
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="px-3 sm:px-4 py-3 flex items-center justify-between">
              <span className="text-sm sm:text-[15px] text-gray-700 font-bold">
                {selectedSizeId ? `SIZE ${availableSizes.find((size: Size) => size.id === selectedSizeId)?.name}` : "SIZE"}
              </span>
              <ChevronDown size={16} className={cn("text-gray-700 transition-transform sm:w-[18px] sm:h-[18px]", isDropdownOpen && "rotate-180")} />
            </div>
          </div>

          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border-2 border-black/[0.15] rounded-md shadow-lg">
              {/* Footer Note */}
              <div className="px-3 sm:px-4 py-2 bg-black/[0.04] border-b-2 border-black/[0.15]">
                <p className="text-[10px] sm:text-xs text-black">Sizes shown are standard to your country</p>
              </div>

              <div className="max-h-48 overflow-y-auto">
                {availableSizes.map((size: Size) => {
                  const isSelected = selectedSizeId === size.id;
                  let stockStatus = "available";
                  if (typeof (size as any).stock === "number") {
                    stockStatus = (size as any).stock === 0 ? "notify" : (size as any).stock <= 5 ? "few" : "available";
                  }

                  return (
                    <div
                      key={size.id}
                      onClick={() => {
                        if (stockStatus !== "notify") {
                          setSelectedSizeId(size.id);
                          setIsDropdownOpen(false);
                        }
                      }}
                      className={cn(
                        "flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 cursor-pointer border-b-2 border-black/[0.15] last:border-b-0 transition-colors",
                        stockStatus === "notify" && "cursor-not-allowed opacity-60",
                        isSelected && "bg-black/[0.04]"
                      )}
                    >
                      <span className={cn(
                        "text-sm sm:text-[15px] font-medium",
                        isSelected && "text-black"
                      )}>
                        {size.name}
                      </span>

                      {stockStatus === "notify" ? (
                        <div className="flex items-center gap-1 sm:gap-2 text-black">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5" />
                          </svg>
                          <span className="text-xs font-medium">Notify me</span>
                        </div>
                      ) : stockStatus === "few" ? (
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-xs text-black font-medium">Few items left</span>
                          {isSelected && (
                            <Check size={14} className="text-black" />
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 sm:gap-2">
                          {isSelected && (
                            <Check size={14} className="text-black" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {!isMobile && (
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
          <span className="text-xs text-gray-600">In stock - Ready to ship</span>
        </div>
      )}

      {isMobile && (
        <div className="mt-4">
          <Button
            onClick={() => {
              if (availableSizes.length > 0 && !selectedSizeId) {
                setShowMobileSizeModal(true)
              } else {
                onAddToCart()
              }
            }}
            disabled={isLoading}
            className={cn(
              "w-full h-[48px] text-[14px] font-bold tracking-wide bg-black text-white hover:bg-gray-800 shadow-md transition-all duration-300",
              isLoading && "opacity-70 cursor-not-allowed",
            )}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>ADDING...</span>
              </div>
            ) : (
              "ADD TO CART"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default SizeSelection