

"use client"

import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react"
import type { Product, Category, Color, Size } from "@/types"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "../../contexts/CartContext"
import useWishlist from "../../hooks/use-wishlist"
import { motion, AnimatePresence } from "framer-motion"
import getProducts from "../../actions/get-products"
import getKeywordCategories from "../../actions/get-keyword-categories"
import MobileAddToCartModal from "../../modals/MobileAddToCartModal"
import ShopCategories from "./ShopCategories"
import RecentlyViewed from "../../category/RecentlyViewed"
import WeThinkYouWillLove from "../../category/WeThinkYouWillLove"
import { ProductCard } from "./components/ProductCard"
import { FilterBar } from "./components/FilterBar"
import { PaginationControls } from "./components/PaginationControls"
import { FilterSidebar } from "./components/FilterSidebar"

// Custom hook for media queries
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window === "undefined") return

    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])

  return mounted ? matches : false
}

// Helper functions
const getMaterialsFromCategories = (categories?: Category[]) => 
  categories?.filter((cat) => cat.materials && cat.materials.length > 0) || []

const getStylesFromCategories = (categories?: Category[]) => 
  categories?.filter((cat) => cat.styles && cat.styles.length > 0) || []

const getGendersFromCategories = (categories?: Category[]) => 
  categories?.filter((cat) => cat.genders && cat.genders.length > 0) || []

const getProductSlug = (product: Product): string => {
  if (product.slug) return product.slug
  if (product.name) {
    const baseSlug = product.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
    return product.id ? `${baseSlug}-${product.id.substring(0, 8)}` : baseSlug
  }
  return product.id
}

interface PaginatedProductsData {
  products: Product[]
  pagination: {
    currentPage: number
    totalPages: number
    totalProducts: number
    productsPerPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

interface KeywordCategory {
  id: string
  name: string
  slug: string
  imageUrl?: string
}

type ProductsPageClientProps = {
  initialProductsData: PaginatedProductsData
  categories?: Category[]
  colors?: Color[]
  sizes?: Size[]
  keywordCategories?: KeywordCategory[]
}

const ProductsPageClient: React.FC<ProductsPageClientProps> = ({ 
  initialProductsData, 
  categories, 
  colors, 
  sizes, 
  keywordCategories = [] 
}) => {
  // State
  const [productsData, setProductsData] = useState<PaginatedProductsData>(initialProductsData)
  const [loading, setLoading] = useState(false)
  const [sizeModalOpen, setSizeModalOpen] = useState(false)
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("t-shirts")
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [activeSort, setActiveSort] = useState<string>("newest")
  const [selectedFilters, setSelectedFilters] = useState({
    materials: [] as string[],
    style: [] as string[],
    gender: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
  })
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])
  const [visibleProducts, setVisibleProducts] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(initialProductsData.pagination.currentPage)
  const [isFilterSticky, setIsFilterSticky] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set())
  const [mobileCartModal, setMobileCartModal] = useState<{ isOpen: boolean; product: Product | null }>({ isOpen: false, product: null })
  const [currentProducts, setCurrentProducts] = useState<Product[]>(initialProductsData.products)
  const [mounted, setMounted] = useState(false)
  const [layoutMetrics, setLayoutMetrics] = useState({
    startStickyPoint: 0,
    endStickyPoint: 0,
    filterBarHeight: 0,
  })

  // Refs
  const filterBarWrapperRef = useRef<HTMLDivElement>(null)
  const paginationSectionRef = useRef<HTMLDivElement>(null)
  const filterBarRef = useRef<HTMLDivElement>(null)
  const wasDraggedRef = useRef(false)
  const productRefs = useRef<(HTMLDivElement | null)[]>([])

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { addToCart } = useCart()
  const wishlist = useWishlist()

  // Derived state
  const materials = getMaterialsFromCategories(categories)
  const styles = getStylesFromCategories(categories)
  const genders = getGendersFromCategories(categories)
  const hasActiveFilters = selectedFilters.materials.length > 0 || selectedFilters.style.length > 0 || selectedFilters.gender.length > 0 || selectedFilters.colors.length > 0 || selectedFilters.sizes.length > 0
  const totalActiveFilters = selectedFilters.materials.length + selectedFilters.style.length + selectedFilters.gender.length + selectedFilters.colors.length + selectedFilters.sizes.length

  // URL management
  const updateURL = useCallback(
    (newParams: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(newParams).forEach(([key, value]) => {
        if (value && value !== "" && value !== "1" && !(key === "categoryId" && value === "t-shirts")) {
          params.set(key, String(value))
        } else {
          params.delete(key)
        }
      })
      const newUrl = params.toString() ? `/shop?${params.toString()}` : "/shop"
      router.push(newUrl, { scroll: false })
    },
    [router, searchParams],
  )

  // Product fetching
  const fetchProducts = useCallback(
    async (page: number, resetFilters = false) => {
      setLoading(true)
      try {
        const queryParams = {
          page,
          limit: 28,
          categoryId: activeCategory !== "t-shirts" ? activeCategory : undefined,
          materials: selectedFilters.materials.length > 0 ? selectedFilters.materials.join(",") : undefined,
          styles: selectedFilters.style.length > 0 ? selectedFilters.style.join(",") : undefined,
          genders: selectedFilters.gender.length > 0 ? selectedFilters.gender.join(",") : undefined,
          colors: selectedFilters.colors.length > 0 ? selectedFilters.colors.join(",") : undefined,
          size: selectedFilters.sizes.length > 0 ? selectedFilters.sizes.join(",") : undefined,
        }

        const newProductsData = await getProducts(queryParams)
        
        setProductsData(newProductsData)
        setCurrentProducts(newProductsData.products)
        setCurrentPage(page)

        updateURL({
          page: page > 1 ? page : "",
          categoryId: activeCategory !== "t-shirts" ? activeCategory : "",
          materials: selectedFilters.materials.length > 0 ? selectedFilters.materials.join(",") : "",
          styles: selectedFilters.style.length > 0 ? selectedFilters.style.join(",") : "",
          genders: selectedFilters.gender.length > 0 ? selectedFilters.gender.join(",") : "",
          colors: selectedFilters.colors.length > 0 ? selectedFilters.colors.join(",") : "",
          size: selectedFilters.sizes.length > 0 ? selectedFilters.sizes.join(",") : "",
        })
      } catch (error) {
        console.error("❌ Error fetching products:", error)
        setProductsData({
          products: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalProducts: 0,
            productsPerPage: 28,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        })
      } finally {
        setLoading(false)
      }
    },
    [activeCategory, selectedFilters, updateURL],
  )

  // Event handlers
  const handlePageChange = useCallback(
    (page: number) => {
      fetchProducts(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [fetchProducts],
  )

  const handleFilterChange = useCallback(() => {
    fetchProducts(1, true)
  }, [fetchProducts])

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId)
      fetchProducts(1, true)
    },
    [fetchProducts],
  )

  const handleSortChange = (sortValue: string) => {
    setActiveSort(sortValue)
    setSortDropdownOpen(false)
  }

  const handleClick = (product: Product) => {
    const slug = getProductSlug(product)
    router.push(`/product/${slug}`)
  }

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id)
      const updated = [product, ...filtered].slice(0, 8)
      localStorage.setItem("recentlyViewedProducts", JSON.stringify(updated))
      return updated
    })
  }

  const handleSizeSelect = (productId: string, size: string) => {
    const product = currentProducts.find((p) => p.id === productId) || recentlyViewed.find((p) => p.id === productId)
    if (product) {
      addToCart(product, 'M')
    }
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }))
  }

  // Filter toggle functions
  const toggleMaterialFilter = (material: string) => {
    setSelectedFilters((prev) => {
      const newMaterials = prev.materials.includes(material) ? prev.materials.filter((m) => m !== material) : [...prev.materials, material]
      return { ...prev, materials: newMaterials }
    })
  }

  const toggleStyleFilter = (style: string) => {
    setSelectedFilters((prev) => {
      const newStyles = prev.style.includes(style) ? prev.style.filter((s) => s !== style) : [...prev.style, style]
      return { ...prev, style: newStyles }
    })
  }

  const toggleGenderFilter = (gender: string) => {
    setSelectedFilters((prev) => {
      const newGenders = prev.gender.includes(gender) ? prev.gender.filter((g) => g !== gender) : [...prev.gender, gender]
      return { ...prev, gender: newGenders }
    })
  }

  const toggleSizeFilter = (size: string) => {
    setSelectedFilters((prev) => {
      const newSizes = prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size]
      return { ...prev, sizes: newSizes }
    })
  }

  const toggleColorFilter = (color: string) => {
    setSelectedFilters((prev) => {
      const newColors = prev.colors.includes(color) ? prev.colors.filter((c) => c !== color) : [...prev.colors, color]
      return { ...prev, colors: newColors }
    })
  }

  const clearFilters = () => {
    setSelectedFilters({
      materials: [],
      style: [],
      gender: [],
      colors: [],
      sizes: [],
    })
  }

  // Effects
  useEffect(() => {
    setMounted(true)
    setCurrentProducts(initialProductsData.products)
    setVisibleProducts(initialProductsData.products.map((p) => p.id))
  }, [initialProductsData.products])

  useEffect(() => {
    const urlPage = Number.parseInt(searchParams.get("page") || "1")
    const urlCategoryId = searchParams.get("categoryId") || "t-shirts"
    const urlMaterials = searchParams.get("materials")
    const urlStyle = searchParams.get("styles")
    const urlGender = searchParams.get("genders")
    const urlColor = searchParams.get("colors")
    const urlSize = searchParams.get("size")

    setActiveCategory(urlCategoryId)
    setCurrentPage(urlPage)

    if (urlMaterials || urlStyle || urlGender || urlColor || urlSize) {
      setSelectedFilters((prev) => ({
        ...prev,
        materials: urlMaterials ? urlMaterials.split(",") : [],
        style: urlStyle ? urlStyle.split(",") : [],
        gender: urlGender ? urlGender.split(",") : [],
        colors: urlColor ? urlColor.split(",") : [],
        sizes: urlSize ? urlSize.split(",") : [],
      }))
    }

    const needsFetch = urlPage !== initialProductsData.pagination.currentPage || urlCategoryId !== "t-shirts" || urlMaterials || urlStyle || urlGender || urlColor || urlSize || urlPage > 1

    if (needsFetch) {
      fetchProducts(urlPage)
    }
  }, [])

  useEffect(() => {
    const urlPage = Number.parseInt(searchParams.get("page") || "1")
    if (urlPage !== currentPage) {
      fetchProducts(urlPage)
    }
  }, [searchParams])

  useEffect(() => {
    handleFilterChange()
  }, [selectedFilters])

  useEffect(() => {
    const stoblackRecentlyViewed = localStorage.getItem("recentlyViewedProducts")
    if (stoblackRecentlyViewed) {
      try {
        const parsedData = JSON.parse(stoblackRecentlyViewed)
        const productObjects = parsedData.map((p: Product) => p).filter(Boolean)
        setRecentlyViewed(productObjects)
      } catch (error) {
        console.error("Error parsing recently viewed products:", error)
      }
    }
  }, [])

  // Intersection observer for product visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productId = entry.target.id.replace("product-", "")
            setVisibleProducts((prev) => (prev.includes(productId) ? prev : [...prev, productId]))
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: window.innerWidth < 768 ? "200px" : "100px",
      },
    )

    productRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      productRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [productsData.products])

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownOpen && filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [sortDropdownOpen])

  // Layout measurements
  useLayoutEffect(() => {
    const filterBarWrapper = filterBarWrapperRef.current
    const paginationSection = paginationSectionRef.current
    if (filterBarWrapper && paginationSection && filterBarWrapper.firstElementChild) {
      const filterBarElement = filterBarWrapper.firstElementChild as HTMLElement
      const style = window.getComputedStyle(filterBarElement)
      const marginBottom = parseFloat(style.marginBottom)
      const height = filterBarElement.offsetHeight + marginBottom
      const stickyBarTopPosition = window.matchMedia("(min-width: 768px)").matches ? 112 : 128
      setLayoutMetrics({
        startStickyPoint: filterBarWrapper.offsetTop,
        endStickyPoint: paginationSection.offsetTop - stickyBarTopPosition - height,
        filterBarHeight: height,
      })
    }
  }, [])

  // Sticky filter bar logic
  useEffect(() => {
    if (layoutMetrics.startStickyPoint === 0) return
    const handleScroll = () => {
      const scrollY = window.scrollY
      const { startStickyPoint } = layoutMetrics
      const shouldBeSticky = scrollY >= startStickyPoint
      setIsFilterSticky(current => current !== shouldBeSticky ? shouldBeSticky : current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [layoutMetrics])

  // Capsule nav visibility
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("filterBarSticky", { detail: { isSticky: isFilterSticky } }))
    }
  }, [isFilterSticky])

  if (!mounted) return null

  return (
    <div className="bg-white">
      {/* Shop Categories Section */}
      <ShopCategories keywordCategories={keywordCategories} />
      
      <div className="mx-auto w-full px-0 sm:px-4 lg:px-6 py-6 sm:py-8 md:py-12">
        {/* Filter Bar */}
        <div ref={filterBarWrapperRef}>
          <FilterBar
            isFilterSticky={isFilterSticky}
            layoutMetrics={layoutMetrics}
            hasActiveFilters={hasActiveFilters}
            totalActiveFilters={totalActiveFilters}
            activeSort={activeSort}
            sortDropdownOpen={sortDropdownOpen}
            setSortDropdownOpen={setSortDropdownOpen}
            setFilterSidebarOpen={setFilterSidebarOpen}
            setSizeModalOpen={setSizeModalOpen}
            clearFilters={clearFilters}
            handleSortChange={handleSortChange}
            isDesktop={isDesktop}
          />
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black-600"></div>
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        )}

        {/* Products Grid */}
        <div className="w-full px-2 sm:px-4 md:px-8">
          {!loading && productsData.products.length > 0 ? (
            <>
              {/* Page info */}
              <div className="mb-4 text-sm text-gray-600 text-center">
                Showing {(productsData.pagination.currentPage - 1) * productsData.pagination.productsPerPage + 1} - {Math.min(productsData.pagination.currentPage * productsData.pagination.productsPerPage, productsData.pagination.totalProducts)} of {productsData.pagination.totalProducts} products
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-4 lg:gap-5 xl:gap-6 gap-y-8 md:gap-y-4 lg:gap-y-5 xl:gap-y-6">
                {currentProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    isDesktop={isDesktop}
                    hoveredProduct={hoveredProduct}
                    setHoveredProduct={setHoveredProduct}
                    selectedSizes={selectedSizes}
                    handleSizeSelect={handleSizeSelect}
                    handleClick={handleClick}
                    addToRecentlyViewed={addToRecentlyViewed}
                    wishlist={wishlist}
                    setMobileCartModal={setMobileCartModal}
                    loadingProducts={loadingProducts}
                    visibleProducts={visibleProducts}
                    wasDraggedRef={wasDraggedRef}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <div ref={paginationSectionRef}>
                <PaginationControls
                  currentPage={productsData.pagination.currentPage}
                  totalPages={productsData.pagination.totalPages}
                  hasNextPage={productsData.pagination.hasNextPage}
                  hasPreviousPage={productsData.pagination.hasPreviousPage}
                  loading={loading}
                  onPageChange={handlePageChange}
                  isDesktop={isDesktop}
                />
              </div>

              <div id="lower-content-section"></div>
            </>
          ) : !loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No products found. Try adjusting your filters.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-2 text-black-600 hover:text-black underline">
                  Clear all filters
                </button>
              )}
            </div>
          ) : null}
        </div>

        {/* We Think You Will Also Love Section */}
        {currentProducts.length > 0 && (
          <WeThinkYouWillLove
            products={currentProducts}
            hoveredProduct={hoveredProduct}
            setHoveredProduct={setHoveredProduct}
            selectedSizes={selectedSizes}
            addToRecentlyViewed={addToRecentlyViewed}
            handleClick={handleClick}
            handleSizeSelect={handleSizeSelect}
            onAddToCartClick={(product) => setMobileCartModal({ isOpen: true, product })}
          />
        )}

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <RecentlyViewed
            recentlyViewed={recentlyViewed}
            hoveredProduct={hoveredProduct}
            setHoveredProduct={setHoveredProduct}
            selectedSizes={selectedSizes}
            addToRecentlyViewed={addToRecentlyViewed}
            handleClick={handleClick}
            handleSizeSelect={handleSizeSelect}
            onAddToCartClick={(product) => setMobileCartModal({ isOpen: true, product })}
          />
        )}

        {/* Filter Sidebar */}
        <FilterSidebar
          isOpen={filterSidebarOpen}
          onClose={() => setFilterSidebarOpen(false)}
          hasActiveFilters={hasActiveFilters}
          totalActiveFilters={totalActiveFilters}
          selectedFilters={selectedFilters}
          materials={materials}
          styles={styles}
          genders={genders}
          colors={colors || []}
          sizes={sizes || []}
          onFilterChange={{
            toggleMaterial: toggleMaterialFilter,
            toggleStyle: toggleStyleFilter,
            toggleGender: toggleGenderFilter,
            toggleSize: toggleSizeFilter,
            toggleColor: toggleColorFilter,
          }}
          onClearFilters={clearFilters}
        />

        {/* Mobile Add To Cart Modal */}
        {mobileCartModal.product && (
          <MobileAddToCartModal 
            isOpen={mobileCartModal.isOpen} 
            onClose={() => setMobileCartModal({ isOpen: false, product: null })} 
            product={mobileCartModal.product} 
            availableSizes={mobileCartModal.product.sizeDetails || []} 
            availableColors={mobileCartModal.product.colorDetails || []} 
            selectedColorId={mobileCartModal.product.colorDetails?.[0]?.id || ""} 
          />
        )}

        <style jsx>{`
          :global(body.header-hidden .sticky-filter-bar) {
            top: 0px;
          }
          :global(.custom-scrollbar::-webkit-scrollbar) { width: 6px; }
          :global(.custom-scrollbar::-webkit-scrollbar-track) { background: #f1f1f1; }
          :global(.custom-scrollbar::-webkit-scrollbar-thumb) { background: #d1d5db; border-radius: 3px; }
          :global(.custom-scrollbar::-webkit-scrollbar-thumb:hover) { background: #9ca3af; }
          :global(.hide-scrollbar::-webkit-scrollbar) { display: none; }
          @media (max-width: 768px) { :global(.hide-scrollbar) { scroll-snap-type: x mandatory; } }
          @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); } 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); } }
          :global(.bg-\[\#2b2b2b\]) { animation: pulse 2s infinite; }
          :global(.sticky) { 
            backdrop-filter: saturate(180%) blur(5px);
            background-color: rgba(255, 255, 255, 0.9);
            transition: all 0.3s ease-in-out;
            will-change: transform;
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
          }
          :global(.sticky.shadow-sm) { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
        `}</style>
      </div>
    </div>
  )
}

export default ProductsPageClient

