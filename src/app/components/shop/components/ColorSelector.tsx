import React, { useState, useRef } from "react"
import type { Product } from "@/types"
import { cn } from "../../../lib/utils"
import { X } from "lucide-react"

interface ColorSelectorProps {
  product: Product
  isDesktop: boolean
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({ product, isDesktop }) => {
  const [colorPopup, setColorPopup] = useState<{ productId: string; rect: DOMRect } | null>(null)
  const colorTriggerRefs = useRef<Record<string, HTMLButtonElement>>({})
  
  const availableColors = product.colorDetails || product.colors || [{ value: "#000000", name: "Black" }]
  const hasMultipleColors = availableColors.length > 1

  if (!hasMultipleColors) {
    return (
      <div className="mt-2">
        <div className="relative inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-black">
          <div className="flex items-center gap-1">
            <div 
              className="w-4 h-4 rounded-full border border-black/30" 
              style={{ backgroundColor: availableColors[0].value || "#000000" }} 
            />
            <span className="text-xs text-gray-700">{availableColors[0].name || "Black"}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-2">
      <div className="relative inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-black">
        <div className="flex items-center gap-1">
          <div 
            className="w-4 h-4 rounded-full border border-black/30" 
            style={{ backgroundColor: availableColors[0].value || "#000000" }} 
          />
          <span className="text-xs text-gray-700">{availableColors[0].name || "Black"}</span>
        </div>
        
        <button
          ref={(el) => {
            if (el) colorTriggerRefs.current[`grid-${product.id}`] = el
          }}
          data-color-trigger
          onClick={(e) => {
            e.stopPropagation()
            if (colorPopup?.productId === product.id) {
              setColorPopup(null)
            } else {
              const button = e.currentTarget
              const rect = button.getBoundingClientRect()
              setColorPopup({ productId: product.id, rect })
            }
          }}
          className={cn(
            "text-xs transition-colors", 
            colorPopup?.productId === product.id && isDesktop 
              ? "absolute inset-0 flex items-center justify-center bg-black text-white border border-black font-medium" 
              : "text-gray-500 hover:text-gray-700 underline"
          )}
        >
          {colorPopup?.productId === product.id && isDesktop ? "Hide colors" : `+${availableColors.length - 1} more`}
        </button>

        {colorPopup?.productId === product.id && isDesktop && (
          <div className="absolute -top-32 left-0 z-50 bg-white border-2 border-gray-600 shadow-2xl w-52">
            <div className="p-3">
              <h4 className="text-sm font-semibold text-grey mb-3 pb-2 border-b border-black-200">
                Color: {availableColors[0]?.name || "Black"}
              </h4>
              <div className="flex gap-2 mb-2">
                {availableColors.map((color: any) => (
                  <div 
                    key={color.id} 
                    className="cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation(); 
                      setColorPopup(null) 
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

        {colorPopup?.productId === product.id && !isDesktop && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5">
                <h2 className="text-lg font-bold">Select Color</h2>
                <button 
                  onClick={() => setColorPopup(null)} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-4 gap-4">
                  {availableColors.map((color: any) => (
                    <div 
                      key={color.id} 
                      className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation(); 
                        setColorPopup(null) 
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
