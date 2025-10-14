"use client"

import { useState } from "react"
import { X, ChevronDown } from "lucide-react"
import { cn } from "@/src/app/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Button from "@/components/ui/button"

// Filter categories
const CATEGORIES = [
  { id: "t-shirts", name: "T-Shirts" },
  { id: "hoodies", name: "Hoodies" },
  { id: "sweatshirts", name: "Sweatshirts" },
  { id: "jackets", name: "Jackets" },
  { id: "pants", name: "Pants" },
  { id: "shorts", name: "Shorts" },
  { id: "accessories", name: "Accessories" }
]

// Size options
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]

// Color options with hex values
const COLORS = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Red", value: "#FF0000" },
  { name: "Blue", value: "#0000FF" },
  { name: "Green", value: "#00FF00" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "Purple", value: "#800080" },
  { name: "Orange", value: "#FFA500" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Gray", value: "#808080" }
]

// Price ranges
const PRICE_RANGES = [
  { id: "0-25", name: "Under $25" },
  { id: "25-50", name: "$25 to $50" },
  { id: "50-100", name: "$50 to $100" },
  { id: "100-200", name: "$100 to $200" },
  { id: "200-plus", name: "$200+" }
]

interface FilterSidebarProps {
  open: boolean
  onClose: () => void
  selectedFilters: {
    categories: string[]
    sizes: string[]
    colors: string[]
    priceRanges: string[]
  }
  onFilterChange: (filterType: string, value: string) => void
  onClearFilters: () => void
  onApplyFilters: () => void
}

export default function FilterSidebar({
  open,
  onClose,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  onApplyFilters
}: FilterSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="px-4 py-4 border-b">
          <SheetTitle className="flex items-center justify-between">
            <span>Filter Products</span>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-black">
              <X size={18} />
            </button>
          </SheetTitle>
        </SheetHeader>
        
        <div className="overflow-y-auto h-[calc(100vh-10rem)]">
          <Accordion type="multiple" defaultValue={["categories", "sizes", "colors", "price"]}>
            {/* Categories Filter */}
            <AccordionItem value="categories" className="border-b">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-black">
                <span className="font-medium">Categories</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category.id}`} 
                        checked={selectedFilters.categories.includes(category.id)}
                        onCheckedChange={() => onFilterChange("categories", category.id)}
                      />
                      <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Sizes Filter */}
            <AccordionItem value="sizes" className="border-b">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-black">
                <span className="font-medium">Sizes</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="grid grid-cols-3 gap-2">
                  {SIZES.map((size) => (
                    <div
                      key={size}
                      className={cn(
                        "flex items-center justify-center h-10 border rounded-md cursor-pointer transition-colors",
                        selectedFilters.sizes.includes(size)
                          ? "bg-black text-white border-black"
                          : "border-gray-300 hover:border-black"
                      )}
                      onClick={() => onFilterChange("sizes", size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Colors Filter */}
            <AccordionItem value="colors" className="border-b">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-black">
                <span className="font-medium">Colors</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="grid grid-cols-5 gap-2">
                  {COLORS.map((color) => (
                    <div
                      key={color.name}
                      className="flex flex-col items-center gap-1"
                      onClick={() => onFilterChange("colors", color.name)}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full cursor-pointer border transition-transform",
                          selectedFilters.colors.includes(color.name)
                            ? "border-black scale-110 shadow-md"
                            : "border-gray-300"
                        )}
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-xs">{color.name}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Price Filter */}
            <AccordionItem value="price" className="border-b">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-black">
                <span className="font-medium">Price</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <div key={range.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`price-${range.id}`} 
                        checked={selectedFilters.priceRanges.includes(range.id)}
                        onCheckedChange={() => onFilterChange("priceRanges", range.id)}
                      />
                      <Label htmlFor={`price-${range.id}`} className="cursor-pointer">
                        {range.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Footer with action buttons */}
        <div className="border-t p-4 bg-white">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClearFilters}
              className="flex-1"
            >
              Clear All
            </Button>
            <Button 
              onClick={onApplyFilters}
              className="flex-1 bg-[#2b2b2b] hover:bg-[#2b2b2b]"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
