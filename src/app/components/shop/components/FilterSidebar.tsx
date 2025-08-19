import React from "react"
import { cn } from "../../../lib/utils"
import type { Category, Color, Size } from "@/types"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../../ui/sheet"

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  hasActiveFilters: boolean
  totalActiveFilters: number
  selectedFilters: {
    materials: string[]
    style: string[]
    gender: string[]
    colors: string[]
    sizes: string[]
  }
  materials: { id: string; name: string }[]
  styles: { id: string; name: string }[]
  genders: { id: string; name: string }[]
  colors: Color[]
  sizes: Size[]
  onFilterChange: {
    toggleMaterial: (material: string) => void
    toggleStyle: (style: string) => void
    toggleGender: (gender: string) => void
    toggleSize: (size: string) => void
    toggleColor: (color: string) => void
  }
  onClearFilters: () => void
  onApplyFilters?: () => void
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  hasActiveFilters,
  totalActiveFilters,
  selectedFilters,
  materials,
  styles,
  genders,
  colors,
  sizes,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
}) => {
  const handleClearAndClose = () => {
    onClearFilters()
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[85vw] max-w-[300px] p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="text-left px-4 pt-4 pb-2 border-b">
            <div className="flex justify-between items-center">
              <SheetTitle className="text-xl font-bold">Filters</SheetTitle>
              {hasActiveFilters && (
                <button 
                  onClick={onClearFilters} 
                  className="text-xs font-medium text-black-600 hover:text-black underline"
                >
                  Clear all
                </button>
              )}
            </div>
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedFilters.materials.length > 0 && <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">{selectedFilters.materials.length} materials</div>}
                {selectedFilters.style.length > 0 && <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">{selectedFilters.style.length} styles</div>}
                {selectedFilters.gender.length > 0 && <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">{selectedFilters.gender.length} genders</div>}
                {selectedFilters.sizes.length > 0 && <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">{selectedFilters.sizes.length} sizes</div>}
                {selectedFilters.colors.length > 0 && <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">{selectedFilters.colors.length} colors</div>}
              </div>
            )}
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 pt-6">
            {/* Materials Section */}
            <div className="mb-6 mt-4">
              <h3 className="text-base font-semibold mb-3 flex items-center">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-black flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                </span>
                Materials
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {materials.map((material) => (
                  <button 
                    key={material.id} 
                    onClick={() => onFilterChange.toggleMaterial(material.name)} 
                    className={cn(
                      "px-2 py-2 border rounded-md text-sm font-medium transition-colors", 
                      selectedFilters.materials.includes(material.name) 
                        ? "bg-[#2b2b2b] text-white border-black-600" 
                        : "border-gray-300 hover:border-black"
                    )}
                  >
                    {material.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Styles Section */}
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-3 flex items-center">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-black-600 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </span>
                Styles
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {styles.map((style) => (
                  <button 
                    key={style.id} 
                    onClick={() => onFilterChange.toggleStyle(style.name)} 
                    className={cn(
                      "px-2 py-2 border rounded-md text-sm font-medium transition-colors", 
                      selectedFilters.style.includes(style.name) 
                        ? "bg-[#2b2b2b] text-white border-black-600" 
                        : "border-gray-300 hover:border-black"
                    )}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Section */}
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-3 flex items-center">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-black-600 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"></path>
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V9s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                  </svg>
                </span>
                Gender
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {genders.map((gender) => (
                  <button 
                    key={gender.id} 
                    onClick={() => onFilterChange.toggleGender(gender.name)} 
                    className={cn(
                      "px-2 py-2 border rounded-md text-sm font-medium transition-colors", 
                      selectedFilters.gender.includes(gender.name) 
                        ? "bg-[#2b2b2b] text-white border-black" 
                        : "border-gray-300 hover:border-black"
                    )}
                  >
                    {gender.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Section */}
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-3 flex items-center">
                <span className="w-6 h-6 rounded-full bg-black-100 text-black-600 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  </svg>
                </span>
                Sizes
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {sizes && sizes.map((size) => {
                  const sizeValue = size.value || size.name || ""
                  return (
                    <button 
                      key={size.id} 
                      onClick={() => onFilterChange.toggleSize(sizeValue)} 
                      className={cn(
                        "px-2 py-2 border rounded-md text-sm font-medium transition-colors", 
                        selectedFilters.sizes.includes(sizeValue) 
                          ? "bg-[#2b2b2b] text-white border-black-600" 
                          : "border-gray-300 hover:border-black-600"
                      )}
                    >
                      {sizeValue}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Colors Section */}
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-3 flex items-center">
                <span className="w-6 h-6 rounded-full bg-black-100 text-black-600 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="13.5" cy="6.5" r="2.5"></circle>
                    <circle cx="19" cy="17" r="2"></circle>
                    <circle cx="9" cy="17" r="2.5"></circle>
                    <circle cx="4.5" cy="12" r="1.5"></circle>
                    <path d="M8 7c0-2.2 1.8-4 4-4"></path>
                    <path d="M13.9 17.45a8 8 0 0 0 2.82-11.73"></path>
                    <path d="M4.9 15.4a8 8 0 0 1 0-6.8"></path>
                    <path d="M15.9 12.4a8 8 0 0 1-3.99 4.5"></path>
                  </svg>
                </span>
                Colors
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {colors && colors.map((color) => {
                  const colorName = color.name || ""
                  return (
                    <div key={color.id} className="flex items-center">
                      <button 
                        onClick={() => onFilterChange.toggleColor(colorName)} 
                        className={cn(
                          "flex items-center w-full px-3 py-2 border rounded-md text-sm transition-colors", 
                          selectedFilters.colors.includes(colorName) 
                            ? "bg-[#2b2b2b] text-white border-black-600" 
                            : "border-gray-300 hover:border-black-600"
                        )}
                      >
                        <span 
                          className="w-4 h-4 rounded-full mr-2 border border-gray-300" 
                          style={{ backgroundColor: color.value || "#ccc" }}
                        ></span>
                        {colorName}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="border-t p-4">
            <button 
              onClick={() => {
                if (onApplyFilters) {
                  onApplyFilters()
                } else {
                  onClose()
                }
              }} 
              className="w-full bg-[#2b2b2b] text-white py-3 rounded-md font-medium hover:bg-black-700 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearAndClose}
              className="w-full text-gray-600 py-2 mt-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
