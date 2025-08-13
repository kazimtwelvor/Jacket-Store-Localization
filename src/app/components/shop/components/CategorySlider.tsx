"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, ChevronLeft, ChevronRight, Grid3X3, List, Star } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../../ui/sheet"
import { cn } from "../../../lib/utils"
import type { Category } from "@/types"
import Image from "next/image"
import Link from "next/link"

interface CategorySliderProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  onCategorySelect?: (category: Category) => void
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  isOpen,
  onClose,
  categories,
  onCategorySelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.materials?.some(material => 
        material.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      category.styles?.some(style => 
        style.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [categories, searchQuery])

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category)
    onCategorySelect?.(category)
    // Don't close immediately to show category details
  }

  const handleClose = () => {
    setSelectedCategory(null)
    setSearchQuery("")
    onClose()
  }

  const CategoryCard = ({ category }: { category: Category }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
      onClick={() => handleCategoryClick(category)}
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-300">
        {/* Category Image */}
        <div className="relative h-48 w-full overflow-hidden">
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <Grid3X3 className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-800 rounded-full">
              {category.materials?.length || 0} Materials
            </span>
          </div>
        </div>

        {/* Category Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#2b2b2b] transition-colors">
            {category.name}
          </h3>
          
          {category.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {category.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {category.styles?.slice(0, 3).map((style, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-md"
              >
                {style}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  )

  const CategoryListItem = ({ category }: { category: Category }) => (
    <motion.div
      whileHover={{ x: 4 }}
      className="group cursor-pointer border-b border-gray-100 last:border-b-0"
      onClick={() => handleCategoryClick(category)}
    >
      <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors duration-200">
        {/* Category Image */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <Grid3X3 className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-[#2b2b2b] transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-gray-600 line-clamp-1 mt-1">
              {category.description}
            </p>
          )}
          
          {/* Tags */}
          <div className="flex items-center gap-2 mt-2">
            {category.materials?.slice(0, 2).map((material, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
              >
                {material}
              </span>
            ))}
            {category.materials && category.materials.length > 2 && (
              <span className="text-xs text-gray-500">
                +{category.materials.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
    </motion.div>
  )

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[90vw] max-w-[800px] p-0">
        <div className="h-full flex flex-col">
          {/* Header */}
          <SheetHeader className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <SheetTitle className="text-2xl font-bold text-gray-900">
                Browse Categories
              </SheetTitle>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories, materials, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b2b2b] focus:border-transparent"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "grid" 
                    ? "bg-[#2b2b2b] text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "list" 
                    ? "bg-[#2b2b2b] text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedCategory ? (
              // Category Detail View
              <div className="p-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Categories
                </button>

                <div className="space-y-6">
                  {/* Category Header */}
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedCategory.name}
                    </h2>
                    {selectedCategory.description && (
                      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {selectedCategory.description}
                      </p>
                    )}
                  </div>

                  {/* Category Image */}
                  {selectedCategory.imageUrl && (
                    <div className="relative h-64 w-full rounded-xl overflow-hidden">
                      <Image
                        src={selectedCategory.imageUrl}
                        alt={selectedCategory.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Category Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Materials */}
                    {selectedCategory.materials && selectedCategory.materials.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          Materials
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCategory.materials.map((material, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-white border border-gray-200 text-sm text-gray-700 rounded-full"
                            >
                              {material}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Styles */}
                    {selectedCategory.styles && selectedCategory.styles.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Grid3X3 className="w-5 h-5 text-blue-500" />
                          Styles
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCategory.styles.map((style, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-white border border-gray-200 text-sm text-gray-700 rounded-full"
                            >
                              {style}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="text-center">
                    <Link
                      href={`/collections/${selectedCategory.slug || selectedCategory.id}`}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-[#2b2b2b] text-white font-semibold rounded-lg hover:bg-black transition-colors"
                    >
                      Explore {selectedCategory.name}
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              // Categories Grid/List View
              <div className="p-6">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No categories found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search terms or browse all categories.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Found {filteredCategories.length} category{filteredCategories.length !== 1 ? 's' : ''}
                    </p>
                    
                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {filteredCategories.map((category) => (
                          <CategoryCard key={category.id} category={category} />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredCategories.map((category) => (
                          <CategoryListItem key={category.id} category={category} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
