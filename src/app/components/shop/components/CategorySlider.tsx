"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, ChevronLeft, ChevronRight, Grid3X3, List, Star } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../../ui/sheet"
import { cn } from "../../../lib/utils"
import type { Category } from "@/types"
import Image from "next/image"
import Link from "next/link"

interface KeywordCategory {
  id: string
  name: string
  slug: string
  imageUrl?: string
  description?: string
  materials?: string[]
  styles?: string[]
}

interface CategorySliderProps {
  isOpen: boolean
  onClose: () => void
  keywordCategories: KeywordCategory[]
  onCategorySelect?: (category: KeywordCategory) => void
  currentCategory?: KeywordCategory
  relatedCategories?: KeywordCategory[]
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  isOpen,
  onClose,
  keywordCategories,
  onCategorySelect,
  currentCategory,
  relatedCategories = [],
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState<KeywordCategory | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.blur()
    }
  }, [isOpen])

  const sortedCategories = useMemo(() => {
    if (!keywordCategories || !Array.isArray(keywordCategories)) return []
    
    // Create a map for quick lookup of keyword categories
    const keywordCategoriesMap = new Map(
      keywordCategories.map(cat => [cat.id || cat.slug, cat])
    )
    
    // Get related categories in the exact order they appear in JacketCategories
    const orderedRelated = relatedCategories
      .map(relatedCat => keywordCategoriesMap.get(relatedCat.id || relatedCat.slug))
      .filter((cat): cat is KeywordCategory => cat !== undefined)
    
    // Get remaining categories (not in related)
    const relatedIds = new Set(relatedCategories.map(cat => cat.id || cat.slug))
    const others = keywordCategories.filter(category => 
      !relatedIds.has(category.id || category.slug)
    )
    
    return [...orderedRelated, ...others]
  }, [keywordCategories, relatedCategories])

  const filteredCategories = useMemo(() => {
    if (!sortedCategories || !Array.isArray(sortedCategories)) return []
    if (!searchQuery.trim()) return sortedCategories
    
    return sortedCategories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [sortedCategories, searchQuery])

  const handleCategoryClick = (category: KeywordCategory) => {
    setSelectedCategory(category)
    onCategorySelect?.(category)
    // Don't close immediately to show category details
  }

  const handleClose = () => {
    setSelectedCategory(null)
    setSearchQuery("")
    onClose()
  }

  const CategoryCard = ({ category }: { category: KeywordCategory }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group cursor-pointer flex flex-col items-center text-center"
      onClick={() => handleCategoryClick(category)}
    >
      <div
        className={cn(
          "relative w-24 h-24 mb-3 rounded-full overflow-hidden transition-all duration-300",
          currentCategory?.id === category.id
            ? "shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
            : "ring-2 ring-gray-100 hover:ring-gray-300"
        )}
      >
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <Grid3X3 className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      <h3 className={cn(
        "font-bold text-sm transition-colors",
        currentCategory?.id === category.id
          ? "text-gray-900"
          : "text-gray-400 group-hover:text-gray-700"
      )}>
        {category.name}
      </h3>
    </motion.div>
  )

  const CategoryListItem = ({ category }: { category: KeywordCategory }) => (
    <motion.div
      whileHover={{ x: 4 }}
      className={cn(
        "group cursor-pointer border-b transition-all duration-200",
        currentCategory?.id === category.id
          ? "border-gray-300 bg-gray-50/50"
          : "border-gray-100 hover:bg-gray-50"
      )}
      onClick={() => handleCategoryClick(category)}
    >
      <div className="flex items-center gap-4 p-4 transition-colors duration-200">
        {/* Category Image */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
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
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "font-semibold transition-colors",
              currentCategory?.id === category.id
                ? "text-gray-900"
                : "text-gray-800 group-hover:text-gray-900"
            )}>
              {category.name}
            </h3>
            <span className={cn(
              "px-2 py-1 text-xs font-medium rounded-full transition-colors",
              currentCategory?.id === category.id
                ? "bg-gray-200 text-gray-700"
                : "bg-gray-100 text-gray-600"
            )}>
              {(category as any).productCount > 0 
                ? `${(category as any).productCount} Product${(category as any).productCount !== 1 ? 's' : ''}`
                : 'Coming Soon'
              }
            </span>
          </div>
          {category.description && (
            <p className="text-sm text-gray-600 line-clamp-1 mt-1">
              {category.description}
            </p>
          )}
          
          {/* Tags */}
          <div className="flex items-center gap-2 mt-2">
            {category.materials && category.materials.length > 0 ? (
              <>
                {category.materials.slice(0, 2).map((material, index) => (
                  <span
                    key={index}
                    className={cn(
                      "px-2 py-1 text-xs rounded-full transition-colors",
                      currentCategory?.id === category.id
                        ? "bg-gray-100 text-gray-700 border border-gray-200"
                        : "bg-gray-50 text-gray-600"
                    )}
                  >
                    {material}
                  </span>
                ))}
                {category.materials.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{category.materials.length - 2} more
                  </span>
                )}
              </>
            ) : category.styles && category.styles.length > 0 ? (
              <>
                {category.styles.slice(0, 2).map((style, index) => (
                  <span
                    key={index}
                    className={cn(
                      "px-2 py-1 text-xs rounded-full transition-colors",
                      currentCategory?.id === category.id
                        ? "bg-gray-100 text-gray-700 border border-gray-200"
                        : "bg-gray-50 text-gray-600"
                    )}
                  >
                    {style}
                  </span>
                ))}
                {category.styles.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{category.styles.length - 2} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs text-gray-500 italic">
                Premium Collection
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
    </motion.div>
  )

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[90vw] max-w-[800px] p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between mb-6">
              <SheetTitle className="text-3xl font-bold text-gray-900">
                Browse Categories
              </SheetTitle>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search categories, materials, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                autoFocus={false}
                tabIndex={-1}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  viewMode === "grid" 
                    ? "bg-gray-800 text-white shadow-md" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  viewMode === "list" 
                    ? "bg-gray-800 text-white shadow-md" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            {selectedCategory ? (
              <div className="p-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Categories
                </button>

                <div className="space-y-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="p-6 bg-white">
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
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 font-medium">
                      Found {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'}
                    </p>
                    
                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-4 gap-6">
                        {filteredCategories.map((category) => (
                          <CategoryCard key={category.id} category={category} />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-1">
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
