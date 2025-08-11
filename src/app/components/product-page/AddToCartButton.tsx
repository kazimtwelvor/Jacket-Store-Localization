"use client"

import Button from "../../ui/button"
import { cn } from "../../lib/utils"

interface AddToCartButtonProps {
  onAddToCart: () => void
  isLoading: boolean
  isMobile: boolean
}

const AddToCartButton = ({ onAddToCart, isLoading, isMobile }: AddToCartButtonProps) => {
  if (isMobile) return null

  return (
    <div className="relative mb-4 sm:mb-6">
      {/* Button glow effect */}
      <div className="absolute -inset-1 bg-[#B01E23]/10 rounded-md blur-lg opacity-50"></div>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            onAddToCart()
          }}
          disabled={isLoading}
          className={cn(
            "relative flex-1 h-[54px] text-[15px] font-bold tracking-wide bg-black text-white hover:bg-gray-800 shadow-md transition-all duration-300 overflow-hidden rounded-none",
            isLoading && "opacity-70 cursor-not-allowed",
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>ADDING TO CART...</span>
            </div>
          ) : (
            <>
              {/* Shine effect */}
              <div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-[45deg] transform -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700 ease-in-out"></div>
              ADD TO CART
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default AddToCartButton