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

  const handleRemoveChip = (group: 'materials' | 'style' | 'gender' | 'colors' | 'sizes', value: string) => {
    if (group === 'materials') return onFilterChange.toggleMaterial(value)
    if (group === 'style') return onFilterChange.toggleStyle(value)
    if (group === 'gender') return onFilterChange.toggleGender(value)
    if (group === 'sizes') return onFilterChange.toggleSize(value)
    if (group === 'colors') return onFilterChange.toggleColor(value)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[90vw] max-w-[380px] p-0 z-[9999]">
        <div className="h-full flex flex-col bg-gray-50">
          {/* Header */}
          <SheetHeader className="px-6 py-6 bg-white border-b border-gray-100">
            <SheetTitle className="text-xl font-semibold text-gray-900">Filters</SheetTitle>
          </SheetHeader>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="px-6 py-3 bg-white border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap gap-2 flex-1">
                  {(['materials','style','gender','sizes','colors'] as const).map(group => 
                    selectedFilters[group].map((value) => (
                      <span 
                        key={`${group}-${value}`} 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-100 text-gray-800 border border-gray-300"
                      >
                        {value}
                        <button 
                          onClick={() => handleRemoveChip(group, value)}
                          className="w-4 h-4 bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors flex items-center justify-center"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </span>
                    ))
                  )}
                </div>
                <button
                  onClick={onClearFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium whitespace-nowrap"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-7">
            {/* Materials */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Materials</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {materials.map((material) => (
                  <button 
                    key={material.id} 
                    onClick={() => onFilterChange.toggleMaterial(material.name)} 
                    className={cn(
                      "px-3 py-2 text-sm font-medium transition-colors border", 
                      selectedFilters.materials.includes(material.name) 
                        ? "bg-gray-900 text-white border-gray-900" 
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    )}
                  >
                    {material.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Styles */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Styles</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {styles.map((style) => (
                  <button 
                    key={style.id} 
                    onClick={() => onFilterChange.toggleStyle(style.name)} 
                    className={cn(
                      "px-3 py-2 text-sm font-medium transition-colors border", 
                      selectedFilters.style.includes(style.name) 
                        ? "bg-gray-900 text-white border-gray-900" 
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    )}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Gender</h3>
              <div className="grid grid-cols-3 gap-2">
                {genders.map((gender) => (
                  <button 
                    key={gender.id} 
                    onClick={() => onFilterChange.toggleGender(gender.name)} 
                    className={cn(
                      "px-3 py-2 text-sm font-medium transition-colors border", 
                      selectedFilters.gender.includes(gender.name) 
                        ? "bg-gray-900 text-white border-gray-900" 
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    )}
                  >
                    {gender.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Sizes</h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {sizes && sizes.map((size) => {
                  const sizeValue = size.value || size.name || ""
                  return (
                    <button 
                      key={size.id} 
                      onClick={() => onFilterChange.toggleSize(sizeValue)} 
                      className={cn(
                        "px-2.5 py-1.5 text-xs font-semibold transition-colors border", 
                        selectedFilters.sizes.includes(sizeValue) 
                          ? "bg-gray-900 text-white border-gray-900" 
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      )}
                    >
                      {sizeValue}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Colors</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {colors && colors.map((color) => {
                  const colorName = color.name || ""
                  return (
                    <button 
                      key={color.id}
                      onClick={() => onFilterChange.toggleColor(colorName)} 
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors border", 
                        selectedFilters.colors.includes(colorName) 
                          ? "bg-gray-900 text-white border-gray-900" 
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      )}
                    >
                      <span 
                        className={cn(
                          "w-3.5 h-3.5 border",
                          selectedFilters.colors.includes(colorName) 
                            ? "border-white" 
                            : "border-gray-300"
                        )}
                        style={{ backgroundColor: color.value || colorName.toLowerCase() }}
                      />
                      {colorName}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex gap-2">
              <button
                onClick={handleClearAndClose}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={() => {
                  if (onApplyFilters) {
                    onApplyFilters()
                  } else {
                    onClose()
                  }
                }} 
                className="flex-1 px-3 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
