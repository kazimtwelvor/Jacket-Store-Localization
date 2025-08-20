

"use client"
import React, { useState, useRef, useEffect, useLayoutEffect, Suspense } from "react"
import Image from "next/image"

import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { motion, AnimatePresence, useMotionValue, animate, PanInfo } from "framer-motion"
import WhatsMySize from "@/src/components/WhatsMySize"
import type { Product, Category } from "@/types"

import { cn } from "@/src/app/lib/utils"
import JacketCategories from "@/src/app/category/JacketCategories"
import WeThinkYouWillLove from "@/src/app/category/WeThinkYouWillLove"
import RecentlyViewed from "@/src/app/category/RecentlyViewed"
import CategoryFilterBar from "@/src/app/category/CategoryFilterBar"
import StructuredData from "@/src/app/components/layout/structured-data-layout"
import CartSidebar from "@/src/app/components/layout/cart-sidebar"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/src/app/ui/sheet"
import { useCart } from "@/src/app/contexts/CartContext"
import useWishlist from "@/src/app/hooks/use-wishlist"
import MobileAddToCartModal from "@/src/app/modals/MobileAddToCartModal"
import { CategorySlider } from "@/src/app/components/shop/components/CategorySlider"
import CategorySEOSection from "@/src/app/category/category-seo-section"

interface KeywordCategory {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    description?: string;
}
interface CategoryPageClientProps {
    category: Category & {
        currentCategory?: {
            categoryId: string;
            categoryName: string;
            imageUrl: string;
        };
    }
    products: Product[]
    slug: string
    allCategories: Category[]
    keywordCategories?: KeywordCategory[]
    isKeywordCategory?: boolean
}

const DRAG_BUFFER = 10;

const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean;
    return function(this: any, ...args: any[]) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window === 'undefined') return;

        const media = window.matchMedia(query);
        setMatches(media.matches);

        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);

    return mounted ? matches : false;
};

const ProductImageCarousel = React.memo(({ product, wasDragged }: { product: Product; wasDragged: React.MutableRefObject<boolean> }) => {
    const images = (product.images && product.images.length > 0)
        ? product.images
        : [{ id: 'placeholder', url: '/placeholder.svg' }];
    const [imageIndex, setImageIndex] = useState(0);
    const dragX = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const onDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
        if (Math.abs(offset.x) > DRAG_BUFFER) {
            wasDragged.current = true;
        } else {
            wasDragged.current = false;
            return;
        }
        const dragThreshold = containerWidth / 4;
        if (offset.x < -dragThreshold || velocity.x < -500) {
            setImageIndex(Math.min(imageIndex + 1, images.length - 1));
        } else if (offset.x > dragThreshold || velocity.x > 500) {
            setImageIndex(Math.max(imageIndex - 1, 0));
        }
    };

    useEffect(() => {
        if (containerWidth > 0) {
            animate(dragX, -imageIndex * containerWidth, {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
            });
        }
    }, [imageIndex, containerWidth, dragX]);

    if (images.length <= 1) {
        return (
            <div className="w-full h-full overflow-hidden">
                <Image
                    src={(images[0] as any).url}
                    alt={product.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
                    priority={false}
                    loading="lazy"
                    draggable={false}
                />
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full h-full overflow-hidden relative cursor-grab active:cursor-grabbing">
            <motion.div
                className="flex h-full"
                style={{ x: dragX }}
                drag="x"
                dragConstraints={{ right: 0, left: -containerWidth * (images.length - 1) }}
                dragElastic={0.15}
                onPointerDown={() => { wasDragged.current = false; }}
                onDragEnd={onDragEnd}
            >
                {images.map((image, i) => (
                    <div key={image.id || i} className="relative flex-shrink-0 w-full h-full">
                        <Image
                            src={(image as any).url}
                            alt={product.name}
                            fill
                            className="object-cover object-top pointer-events-none"
                            sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
                            priority={i === 0}
                            loading={i === 0 ? "eager" : "lazy"}
                            draggable={false}
                            onDragStart={(e) => e.preventDefault()}
                        />
                    </div>
                ))}
            </motion.div>
            <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                {images.map((_, i) => (
                    <div
                        key={`dot-${i}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setImageIndex(i);
                        }}
                        className={cn(
                            "w-1.5 h-1.5 rounded-full cursor-pointer transition-colors duration-300",
                            imageIndex === i ? 'bg-black border border-black' : 'bg-white border border-gray-400'
                        )}
                    />
                ))}
            </div>
        </div>
    );
});

const getLocalImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return "/placeholder.svg"
    const cleanUrl = imageUrl.replace(/\n/g, '').trim()
    const filename = cleanUrl.split('/').pop()?.trim()
    if (!filename) return "/placeholder.svg"
    const localPath = `/uploads/2025/${filename}`
    return localPath
}
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

const CategoryPageClientContent: React.FC<CategoryPageClientProps> = ({ category, products, slug, allCategories, keywordCategories = [], isKeywordCategory = false }) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const wasDraggedRef = useRef(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [mounted, setMounted] = useState(false);
    const initialSort = searchParams.get('sort') || 'popular'
    const [currentSort, setCurrentSort] = useState(initialSort)
    const urlSizes = searchParams.get('sizes')?.split(',').filter(Boolean) || []
    const urlColors = searchParams.get('colors')?.split(',').filter(Boolean) || []
    const [filterSidebarOpen, setFilterSidebarOpen] = useState(false)
    const [categoriesSidebarOpen, setCategoriesSidebarOpen] = useState(false)
    const [categorySliderOpen, setCategorySliderOpen] = useState(false)
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
    const [sizeModalOpen, setSizeModalOpen] = useState(false)
    const [selectedFilters, setSelectedFilters] = useState({
        sizes: urlSizes,
        colors: urlColors,
    })
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
    const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])
    const [visibleProducts, setVisibleProducts] = useState<string[]>([])
    const [isFilterSticky, setIsFilterSticky] = useState(false)
    const [productSidebarOpen, setProductSidebarOpen] = useState(false)
    const [colorPopup, setColorPopup] = useState<{ productKey: string; rect: DOMRect } | null>(null)
    const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set())
    const [isPageLoading, setIsPageLoading] = useState(false)
    const [mobileCartModal, setMobileCartModal] = useState<{ isOpen: boolean; product: Product | null }>({ isOpen: false, product: null })
    const [layoutMetrics, setLayoutMetrics] = useState({
        startStickyPoint: 0,
        endStickyPoint: 0,
        filterBarHeight: 0,
    });

    const { addToCart } = useCart()
    const wishlist = useWishlist()
    const productsPerPage = 20 
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
    const [currentProducts, setCurrentProducts] = useState<Product[]>(products)
    const [currentPage, setCurrentPage] = useState(1)
    const colorTriggerRefs = useRef<Record<string, HTMLButtonElement>>({})
    const productRefs = useRef<(HTMLDivElement | null)[]>([])
    const recentlyViewedScrollRef = useRef<HTMLDivElement>(null)
    const filterBarWrapperRef = useRef<HTMLDivElement>(null);
    const productsGridWrapperRef = useRef<HTMLDivElement>(null);
    const paginationSectionRef = useRef<HTMLDivElement>(null);
    const [colorDialogs, setColorDialogs] = useState<Record<string, boolean>>({})

    if (!category) {
        return null;
    }

    const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
    const colors = ["Black", "White", "Blue", "Red", "Green"]

    const categoryIcons: Record<string, string> = {
        'leather-jackets': '/images/leather.webp',
        'womens-jackets': '/images/women-leather.webp',
        'mens-jackets': '/images/leather.webp',
        'coats': '/images/trench-coat.webp',
        'denim-jackets': '/images/denim.webp',
        'bomber-jackets': '/images/letterman.webp',
        'puffer-jackets': '/images/puffer.webp',
        'trench-coats': '/images/trench-coat.webp',
        'aviator-jackets': '/images/aviator.webp',
        'varsity-jackets': '/images/varsity.webp',
        'suede-jackets': '/images/suede.webp'
    }

    const hasActiveFilters = selectedFilters.sizes.length > 0 || selectedFilters.colors.length > 0
    
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateFiltersInURL(selectedFilters)
        }, 300) // Debounce filter updates
        return () => clearTimeout(timeoutId)
    }, [selectedFilters.sizes, selectedFilters.colors])
    
    useEffect(() => {
        setMounted(true)
        if (products && products.length > 0) {
            setVisibleProducts(products.slice(0, productsPerPage).map((p) => p.id))
        }
        if (typeof window !== 'undefined') {
            const savedRecentlyViewed = localStorage.getItem('recentlyViewed')
            if (savedRecentlyViewed) {
                try {
                    const parsed = JSON.parse(savedRecentlyViewed)
                    if (Array.isArray(parsed)) {
                        setRecentlyViewed(parsed)
                    }
                } catch (error) {
                    console.error('Error parsing recently viewed from localStorage:', error)
                }
            }
        }
    }, [products, productsPerPage])
    useEffect(() => {
        if (currentProducts.length > 0) {
            const observer = new IntersectionObserver(
                (entries) => {
                    const newVisibleIds: string[] = []
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const productId = entry.target.id.replace("product-", "")
                            newVisibleIds.push(productId)
                        }
                    })
                    if (newVisibleIds.length > 0) {
                        setVisibleProducts((prev) => {
                            const combined = [...new Set([...prev, ...newVisibleIds])]
                            return combined.length !== prev.length ? combined : prev
                        })
                    }
                },
                { threshold: 0.1, rootMargin: '50px' },
            )
            productRefs.current.forEach((ref) => {
                if (ref) observer.observe(ref)
            })
            return () => {
                productRefs.current.forEach((ref) => {
                    if (ref) observer.unobserve(ref)
                })
            }
        }
    }, [filteredProducts.length])
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement

            if (sortDropdownOpen) {
                setSortDropdownOpen(false)
            }

            if (colorPopup && !target.closest('[data-color-trigger]') && !target.closest('.absolute')) {
                setColorPopup(null)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [sortDropdownOpen, colorPopup])
    useLayoutEffect(() => {
        const filterBarWrapper = filterBarWrapperRef.current;
        const paginationSection = paginationSectionRef.current;
        if (filterBarWrapper && paginationSection && filterBarWrapper.firstElementChild) {
            const filterBarElement = filterBarWrapper.firstElementChild as HTMLElement;
            const style = window.getComputedStyle(filterBarElement);
            const marginBottom = parseFloat(style.marginBottom);
            const height = filterBarElement.offsetHeight + marginBottom;
            const stickyBarTopPosition = window.matchMedia('(min-width: 768px)').matches ? 112 : 128;
            setLayoutMetrics({
                startStickyPoint: filterBarWrapper.offsetTop,
                endStickyPoint: paginationSection.offsetTop - stickyBarTopPosition - height,
                filterBarHeight: height,
            });
        }
    }, []);
    useEffect(() => {
        if (layoutMetrics.startStickyPoint === 0) return;
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const { startStickyPoint, endStickyPoint } = layoutMetrics;
            const shouldBeSticky = scrollY >= startStickyPoint && scrollY < endStickyPoint;
            setIsFilterSticky(current => current !== shouldBeSticky ? shouldBeSticky : current);
        };
        const throttledHandleScroll = throttle(handleScroll, 16); // ~60fps
        window.addEventListener('scroll', throttledHandleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', throttledHandleScroll);
    }, [layoutMetrics.startStickyPoint, layoutMetrics.endStickyPoint, layoutMetrics.filterBarHeight]);
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
            sizes: [],
            colors: [],
        })
        const params = new URLSearchParams(searchParams.toString())
        params.delete('sizes')
        params.delete('colors')
        router.push(`?${params.toString()}`, { scroll: false })
    }
    const handleSortChange = (sortBy: string) => {
        setCurrentSort(sortBy)
        const params = new URLSearchParams(searchParams.toString())
        params.set('sort', sortBy)
        router.push(`?${params.toString()}`, { scroll: false })
    }

    useEffect(() => {
        const s = searchParams.get('sort') || 'popular'
        if (s !== currentSort) setCurrentSort(s)
    }, [searchParams])
    const updateFiltersInURL = (newFilters: { sizes: string[], colors: string[] }) => {
        const params = new URLSearchParams(searchParams.toString())
        if (newFilters.sizes.length > 0) {
            params.set('sizes', newFilters.sizes.join(','))
        } else {
            params.delete('sizes')
        }
        if (newFilters.colors.length > 0) {
            params.set('colors', newFilters.colors.join(','))
        } else {
            params.delete('colors')
        }
        router.push(`?${params.toString()}`, { scroll: false })
    }


    const handleSizeSelect = (productId: string, size: string) => {
        const product = currentProducts.find(p => p.id === productId) || recentlyViewed.find(p => p.id === productId);
        if (product) {
            addToCart(product, size)
            window.dispatchEvent(new CustomEvent('openCart'))
        }
        setSelectedSizes((prev) => ({
            ...prev,
            [productId]: size,
        }))
    }
    const addToRecentlyViewed = (product: Product) => {
        setRecentlyViewed((prev) => {
            const filtered = prev.filter((p) => p.id !== product.id)
            const updated = [product, ...filtered].slice(0, 8)
            if (typeof window !== 'undefined') {
                localStorage.setItem('recentlyViewed', JSON.stringify(updated))
            }
            return updated
        })
    }
    const handleClick = (product: Product) => {
        const slug = getProductSlug(product)
        router.push(`/product/${slug}`)
    }


    useEffect(() => {
        const deriveCategoryGender = (): string => {
            const basis = `${category?.name || ''} ${slug || ''}`.toLowerCase()
            if (basis.includes('women')) return 'female'
            if (basis.includes('woman')) return 'female'
            if (basis.includes('ladies')) return 'female'
            if (basis.includes('men')) return 'male'
            if (basis.includes('man')) return 'male'
            return ''
        }

        const normalizeGender = (value: string): string => {
            const v = String(value || '').trim().toLowerCase()
            if (v.startsWith('women')) return 'female'
            if (v.startsWith('female')) return 'female'
            if (v.startsWith('ladies')) return 'female'
            if (v.startsWith('men')) return 'male'
            if (v.startsWith('male')) return 'male'
            if (v.startsWith('man')) return 'male'
            return v
        }

        const categoryGender = deriveCategoryGender()

        const filterBySelections = (p: Product) => {
            const productColors = ((p as any).colorDetails || (p as any).colors || []).map((c: any) => c.name || c)
            const productSizes = ((p as any).sizeDetails || (p as any).sizes || []).map((s: any) => s.name || s)
            const productGender = normalizeGender((p as any).gender || '')

            const matchesColors = selectedFilters.colors.length === 0 || selectedFilters.colors.some(color => productColors.includes(color))
            const matchesSizes = selectedFilters.sizes.length === 0 || selectedFilters.sizes.some(size => productSizes.includes(size))
            const matchesGender = categoryGender === '' || productGender === categoryGender

            return matchesColors && matchesSizes && matchesGender
        }

        let filtered = products.filter(filterBySelections)

        const parsePriceValue = (raw: any): number => {
            if (raw === undefined || raw === null) return 0
            if (typeof raw === 'number') return raw
            const cleaned = String(raw).replace(/[^0-9.]/g, '')
            const num = Number.parseFloat(cleaned)
            return Number.isFinite(num) ? num : 0
        }
        const priceOf = (p: Product) => {
            const sale = parsePriceValue((p as any).salePrice)
            const base = parsePriceValue((p as any).price)
            return sale > 0 ? sale : base
        }
        if (currentSort === 'newest') {
            filtered = [...filtered].sort((a, b) => {
                const aTime = new Date((a as any).createdAt || 0).getTime()
                const bTime = new Date((b as any).createdAt || 0).getTime()
                return bTime - aTime
            })
        } else if (currentSort === 'price-high') {
            filtered = [...filtered].sort((a, b) => priceOf(b) - priceOf(a))
        } else if (currentSort === 'price-low') {
            filtered = [...filtered].sort((a, b) => priceOf(a) - priceOf(b))
        }

        setFilteredProducts(filtered)
        setCurrentPage(1)
    }, [products, selectedFilters, currentSort])

    useEffect(() => {
        const startIndex = (currentPage - 1) * productsPerPage
        const endIndex = startIndex + productsPerPage
        setCurrentProducts(filteredProducts.slice(startIndex, endIndex))
    }, [filteredProducts, currentPage, productsPerPage])

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
    const hasNextPage = currentPage < totalPages
    const hasPreviousPage = currentPage > 1

    const handlePageChange = (page: number) => {
        setIsPageLoading(true)
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => setIsPageLoading(false), 100)
    }
    let parsedCategoryContent: any = category.categoryContent;
    if (typeof category.categoryContent === 'string') {
        try {
            const cleanedContent = category.categoryContent.replace(/^\uFEFF/, '');
            parsedCategoryContent = JSON.parse(cleanedContent);
        } catch (error) {
            console.error('Failed to parse categoryContent string:', error);
            parsedCategoryContent = {};
        }
    }
    if (!parsedCategoryContent || typeof parsedCategoryContent !== 'object') {
        parsedCategoryContent = {};
    }
    let currentCategory = null;
    if (category.name && category.id) {
        let imageUrl = '';
        if (category.currentCategory && category.currentCategory.imageUrl) {
            imageUrl = category.currentCategory.imageUrl;
        } else {
            imageUrl = category.imageUrl || '';
        }
        imageUrl = getLocalImageUrl(imageUrl)
        currentCategory = {
            categoryId: category.id,
            categoryName: category.name,
            imageUrl: imageUrl
        };
    }
    let categories: { name: string; icon: string; slug: string; categoryId: string; }[] = [];
    if (parsedCategoryContent?.otherCategories && parsedCategoryContent.otherCategories.length > 0) {
        categories = parsedCategoryContent.otherCategories.map((cat: any) => {
            const foundCategory = allCategories.find(c => c.id === cat.categoryId);
            const categorySlug = foundCategory?.slug || cat.categoryName.toLowerCase().replace(/\s+/g, '-');
            let iconUrl = "";
            iconUrl = getLocalImageUrl(cat.imageUrl);
            if (iconUrl === "/placeholder.svg") {
                iconUrl = categoryIcons[categorySlug] || categoryIcons[cat.categoryName.toLowerCase()];
            }
            if (!iconUrl) {
                iconUrl = "/placeholder.svg";
            }
            return {
                name: cat.categoryName,
                icon: iconUrl,
                slug: categorySlug,
                categoryId: cat.categoryId
            };
        });
    } else {
        categories = allCategories.slice(0, 5).map(cat => {
            const categorySlug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
            const iconUrl = categoryIcons[categorySlug] || categoryIcons[cat.name.toLowerCase()] || "/placeholder.svg";
            return {
                name: cat.name,
                icon: iconUrl,
                slug: categorySlug,
                categoryId: cat.id
            };
        });
    }
    const structuredData = []
    if (category.enableSchema && category.customSchema) {
        try {
            const schemaData = typeof category.customSchema === 'string'
                ? JSON.parse(category.customSchema)
                : category.customSchema
            structuredData.push(schemaData)
        } catch (error) {
            console.error('Error parsing custom schema:', error)
        }
    }
    return (
        <section className="bg-white overflow-x-hidden">
            <StructuredData data={structuredData} />
            <div className="container mx-auto pt-24 sm:pt-22 md:pt-20 lg:pt-20 xl:pt-20 pb-0 sm:pb-2 md:pb-6 lg:pb-6 xl:pb-6 text-center">
                <JacketCategories
                    categories={categories}
                    onCategoryClick={(categorySlug) => router.push(`/collections/${categorySlug}`)}
                    currentCategory={currentCategory || undefined}
                />
                <div className="mt-0.1 sm:mt-6 md:mt-8 lg:mt-8 xl:mt-8 mb-0 sm:mb-2 md:mb-6 lg:mb-6 xl:mb-6">
                    <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl font-bold text-gray-900">{category.name}</h1>
                </div>
            </div>
            <div className="mx-auto w-full px-2 sm:px-6 md:px-6 lg:px-8 xl:px-8 py-3 sm:py-3 md:py-6 lg:py-6 xl:py-6">
                <div ref={filterBarWrapperRef} style={{ height: isFilterSticky ? `${layoutMetrics.filterBarHeight}px` : 'auto' }}>
                    <CategoryFilterBar
                        category={category}
                        hasActiveFilters={hasActiveFilters}
                        isFilterSticky={isFilterSticky}
                        sortDropdownOpen={sortDropdownOpen}
                        setSortDropdownOpen={setSortDropdownOpen}
                        setCategoriesSidebarOpen={setCategoriesSidebarOpen}
                        setCategorySliderOpen={setCategorySliderOpen}
                        setFilterSidebarOpen={setFilterSidebarOpen}
                        setSizeModalOpen={setSizeModalOpen}
                        clearFilters={clearFilters}
                        selectedFilters={selectedFilters}
                        onSortChange={handleSortChange}
                        currentSort={currentSort}
                        keywordCategories={keywordCategories}
                    />
                </div>
                <div ref={productsGridWrapperRef} className="w-full px-0 xs:px-0 sm:px-0 md:px-4 lg:px-6 xl:px-8 2xl:px-8 relative">
                    {isPageLoading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div>
                        </div>
                    )}
                    {currentProducts.length > 0 ? (
                        <>
                            <div className="mb-4 text-sm text-gray-600 text-center">
                                Showing {(currentPage - 1) * productsPerPage + 1} - {Math.min(currentPage * productsPerPage, products.length)} of {products.length} products
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-4 lg:gap-5 xl:gap-6 gap-y-8 md:gap-y-4 lg:gap-y-5 xl:gap-y-6">
                                {currentProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        id={`product-${product.id}`}
                                        ref={(el) => { if (productRefs.current) productRefs.current[index] = el as HTMLDivElement | null; }}
                                        className="group relative cursor-pointer flex flex-col h-full"
                                        onClick={() => {
                                            if (!isDesktop && wasDraggedRef.current) return;
                                            addToRecentlyViewed(product)
                                            handleClick(product)
                                        }}
                                        onMouseEnter={() => isDesktop && setHoveredProduct(`grid-${product.id}-${index}`)}
                                        onMouseLeave={() => isDesktop && setHoveredProduct(null)}
                                        initial={loadingProducts.has(product.id) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                        animate={loadingProducts.has(product.id) ? { opacity: 1, y: 0 } : (visibleProducts.includes(product.id) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 })}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                    >
                                        <div
                                            className="relative w-full aspect-[3/5] bg-gray-100 overflow-visible md:overflow-hidden"
                                        >
                                            {mounted ? (
                                                isDesktop ? (
                                                    <div className="w-full h-full overflow-hidden relative">
                                                        <Image
                                                            src={
                                                                hoveredProduct === `grid-${product.id}-${index}` && (product.images?.[1] as any)?.url
                                                                    ? (product.images[1] as any).url
                                                                    : ((product.images?.[0] as any)?.url || "/placeholder.svg")
                                                            }
                                                            alt={product.name}
                                                            fill
                                                            className={cn(
                                                                "object-cover object-top transition-all duration-300",
                                                                hoveredProduct === `grid-${product.id}-${index}` && (product.images?.[1] as any)?.url ? "scale-110" : "scale-100"
                                                            )}
                                                            sizes="(max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                                                            priority={index < 4}
                                                            loading={index < 4 ? "eager" : "lazy"}
                                                        />
                                                        {loadingProducts.has(product.id) && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-30">
                                                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-gray-400"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <ProductImageCarousel product={product} wasDragged={wasDraggedRef} />
                                                )
                                            ) : (
                                                <div className="w-full h-full overflow-hidden bg-gray-100" />
                                            )}
                                            <motion.button
                                                className="absolute w-8 h-8 md:w-9 md:h-9 rounded-full bg-white flex items-center justify-center shadow-md z-10 -bottom-4 md:top-2 right-12 md:right-2"
                                                aria-label="Add to wishlist"
                                                whileHover={{ scale: 1.2, backgroundColor: "#f8f8f8" }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (wishlist.isInWishlist(product.id)) {
                                                        wishlist.removeItem(product.id)
                                                    } else {
                                                        wishlist.addItem(product)
                                                    }
                                                }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className=" md:w-6 md:h-6">
                                                    <path
                                                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                                        stroke="black"
                                                        strokeWidth="2"
                                                        fill={mounted && wishlist.isInWishlist(product.id) ? "black" : "none"}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </motion.button>
                                            <button
                                                className=" md:hidden absolute w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-md z-48 right-2 -bottom-4 md:top-3 md:right-3 md:bottom-auto"
                                                aria-label="Add to cart"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMobileCartModal({ isOpen: true, product });
                                                }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.5 9h11L19 21H5L6.5 9z" />
                                                    <path d="M9 9c0-2.76 1.38-5 3-5s3 2.24 3 5" />
                                                </svg>
                                            </button>
                                            {product.isFeatured && (
                                                <motion.div
                                                    className="absolute top-3 left-0 z-10"
                                                    initial={{ x: -50, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ duration: 0.3, delay: 0.1 }}
                                                >
                                                    <div className="relative">
                                                        <div className="bg-black text-white py-0.5 px-2 shadow-md flex items-center">
                                                            <span className="font-semibold tracking-wide text-[8px] md:text-xs">BEST SELLING</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                            <AnimatePresence>
                                                {isDesktop && hoveredProduct === `grid-${product.id}-${index}` && ((product as any).sizeDetails || (product as any).sizes) && ((product as any).sizeDetails || (product as any).sizes).length > 0 && (
                                                    <motion.div
                                                        className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-70 z-20"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 20 }}
                                                        transition={{ duration: 0.15 }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="p-3">
                                                            <div className="text-xs mb-2">
                                                                Quick Shop <span className="text-gray-500">(Select your Size)</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {((product as any).sizeDetails || (product as any).sizes).map((size: any) => (
                                                                    <button
                                                                        key={size.id}
                                                                        className={cn(
                                                                            "px-3 py-1.5 text-xs border-black hover:border-black transition-colors",
                                                                            selectedSizes[product.id] === size.name ? "border-black" : "border-black",
                                                                        )}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            handleSizeSelect(product.id, size.name)
                                                                        }}
                                                                    >
                                                                        {size.name}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <div className="mt-6 xs:mt-6 sm:mt-6 md:mt-4 lg:mt-4 xl:mt-4 2xl:mt-4">
                                            <h3 className="text-sm line-clamp-1">{product.name.toUpperCase()}</h3>
                                            <div className="mt-1 xs:mt-1 sm:mt-1 md:mt-1 lg:mt-1 xl:mt-1 2xl:mt-1">
                                                {product.salePrice && Number(product.salePrice) > 0 ? (
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm line-through text-black-500">${product.price}</span>
                                                        <span className="text-sm font-bold text-black">${product.salePrice}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm font-bold text-black">${product.price}</span>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                <div
                                                    className="relative inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-black"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {((product as any).colorDetails || (product as any).colors || [{ value: '#000000', name: 'Black' }]).slice(0, 1).map((color: any, index: number) => (
                                                        <div key={index} className="flex items-center gap-1">
                                                            <div
                                                                className="w-4 h-4 rounded-full border border-black/30"
                                                                style={{ backgroundColor: color.value || '#000000' }}
                                                            />
                                                            <span className="text-xs text-gray-700">{color.name || 'Black'}</span>
                                                        </div>
                                                    ))}
                                                    {((product as any).colorDetails || (product as any).colors || []).length > 1 && (
                                                        <>
                                                            <button
                                                                ref={(el) => {
                                                                    if (el) colorTriggerRefs.current[`grid-${product.id}-${index}`] = el
                                                                }}
                                                                data-color-trigger
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    const productKey = `${product.id}-${index}`
                                                                    if (colorPopup?.productKey === productKey) {
                                                                        setColorPopup(null)
                                                                    } else {
                                                                        const button = e.currentTarget
                                                                        const rect = button.getBoundingClientRect()
                                                                        setColorPopup({ productKey, rect })
                                                                    }
                                                                }}
                                                                className={cn(
                                                                    "text-xs transition-colors",
                                                                    colorPopup?.productKey === `${product.id}-${index}` && isDesktop
                                                                        ? "absolute inset-0 flex items-center justify-center bg-black text-white border border-black font-medium"
                                                                        : "text-gray-500 hover:text-gray-700 underline"
                                                                )}
                                                            >
                                                                {colorPopup?.productKey === `${product.id}-${index}` && isDesktop
                                                                    ? "Hide colors"
                                                                    : `+${((product as any).colorDetails || (product as any).colors || []).length - 1} more`
                                                                }
                                                            </button>

                                                            {/* Color Popup inside the color box container */}
                                                            {colorPopup?.productKey === `${product.id}-${index}` && isDesktop && (
                                                                <div className="absolute -top-32 left-0 z-50 bg-white border-2 border-gray-600 shadow-2xl w-52">
                                                                    <div className="p-3">
                                                                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-black-200">
                                                                            <h4 className="text-sm font-semibold text-grey">
                                                                                Color: {(() => {
                                                                                    const colors = (product as any)?.colorDetails || (product as any)?.colors || []
                                                                                    return colors[0]?.name || 'Black'
                                                                                })()}
                                                                            </h4>
                                                                        </div>
                                                                        <div className="flex gap-2 mb-2">
                                                                            {((product as any)?.colorDetails || (product as any)?.colors || []).map((color: any) => {
                                                                                const colorLinks = product?.colorLinks || {}
                                                                                const colorLink = colorLinks[color.name]

                                                                                return (
                                                                                    <div
                                                                                        key={color.id}
                                                                                        className="cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md"
                                                                                        onClick={async (e) => {
                                                                                            e.preventDefault()
                                                                                            e.stopPropagation()

                                                                                            if (colorLink && colorLink.trim() !== '') {
                                                                                                try {
                                                                                                    setLoadingProducts(prev => new Set([...prev, product.id]))

                                                                                                    const response = await fetch(`/api/product-by-url?url=${encodeURIComponent(colorLink)}`)

                                                                                                    if (response.ok) {
                                                                                                        const newProduct = await response.json()

                                                                                                        if (newProduct && newProduct.name && newProduct.id) {
                                                                                                            setCurrentProducts(prev =>
                                                                                                                prev.map(p =>
                                                                                                                    p.id === product.id ? newProduct : p
                                                                                                                )
                                                                                                            )
                                                                                                        }
                                                                                                    }
                                                                                                } catch (error) {
                                                                                                    console.error('Error:', error)
                                                                                                } finally {
                                                                                                    setLoadingProducts(prev => {
                                                                                                        const newSet = new Set(prev)
                                                                                                        newSet.delete(product.id)
                                                                                                        return newSet
                                                                                                    })
                                                                                                }
                                                                                            }

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
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {colorPopup?.productKey === `${product.id}-${index}` && !isDesktop && (
                                                                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-end justify-center z-50">
                                                                    <div className="bg-white rounded-t-lg w-full max-h-[80vh] overflow-y-auto">
                                                                        {/* Header */}
                                                                        <div className="flex items-center justify-between p-5 ">
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
                                                                                {((product as any)?.colorDetails || (product as any)?.colors || []).map((color: any) => {
                                                                                    const colorLinks = product?.colorLinks || {}
                                                                                    const colorLink = colorLinks[color.name]

                                                                                    return (
                                                                                        <div
                                                                                            key={color.id}
                                                                                            className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                                                                            onClick={async (e) => {
                                                                                                e.preventDefault()
                                                                                                e.stopPropagation()

                                                                                                if (colorLink && colorLink.trim() !== '') {
                                                                                                    try {
                                                                                                        setLoadingProducts(prev => new Set([...prev, product.id]))

                                                                                                        const response = await fetch(`/api/product-by-url?url=${encodeURIComponent(colorLink)}`)

                                                                                                        if (response.ok) {
                                                                                                            const newProduct = await response.json()

                                                                                                            if (newProduct && newProduct.name && newProduct.id) {
                                                                                                                setCurrentProducts(prev =>
                                                                                                                    prev.map(p =>
                                                                                                                        p.id === product.id ? newProduct : p
                                                                                                                    )
                                                                                                                )
                                                                                                            }
                                                                                                        }
                                                                                                    } catch (error) {
                                                                                                        console.error('Error:', error)
                                                                                                    } finally {
                                                                                                        setLoadingProducts(prev => {
                                                                                                            const newSet = new Set(prev)
                                                                                                            newSet.delete(product.id)
                                                                                                            return newSet
                                                                                                        })
                                                                                                    }
                                                                                                }

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
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10">No products found in this category.</div>
                    )}
                </div>
                <div ref={paginationSectionRef}>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8 mb-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!hasPreviousPage}
                                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 text-sm"
                            >
                                Previous
                            </button>

                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                const page = i + 1
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-2 rounded-md text-sm ${page === currentPage
                                            ? 'bg-[#2b2b2b] text-white'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )
                            })}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!hasNextPage}
                                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 text-sm"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
                <style jsx global>{`
          .hide-scrollbar {
            -webkit-overflow-scrolling: touch;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          @media (max-width: 768px) {
            .hide-scrollbar {
              scroll-snap-type: x mandatory;
            }
          }
        `}</style>
                <div id="lower-content-div">
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
                    <CategorySEOSection
                        category={{
                            ...category,
                            categoryContent: parsedCategoryContent
                        }}
                        categoryName={category.name}
                        categoryDescription={parsedCategoryContent?.mainContent ?
                            parsedCategoryContent.mainContent.replace(/<[^>]*>/g, '').substring(0, 160) :
                            `Explore our premium collection of ${category.name.toLowerCase()} designed with quality and style in mind. Our carefully curated selection offers something for everyone.`
                        }
                    />
                </div>
                <Sheet open={categoriesSidebarOpen} onOpenChange={setCategoriesSidebarOpen}>
                    <SheetContent side="left" className="w-[85vw] max-w-[300px] p-0 z-[9999]" style={{ zIndex: 9999 }}>
                        <div className="h-full flex flex-col">
                            <SheetHeader className="text-left px-4 pt-4 pb-2 border-b">
                                <SheetTitle className="text-xl font-bold">Categories</SheetTitle>
                            </SheetHeader>
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="grid grid-cols-2 gap-2">
                                    {allCategories.map((cat) => {
                                        const categorySlug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => {
                                                    router.push(`/collections/${categorySlug}`)
                                                    setCategoriesSidebarOpen(false)
                                                }}
                                                className={cn(
                                                    "px-2 py-2 border rounded-md text-sm font-medium transition-colors",
                                                    categorySlug === slug
                                                        ? "bg-[#2b2b2b] text-white border-black"
                                                        : "border-gray-300 hover:border-black"
                                                )}
                                            >
                                                {cat.name}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
                <Sheet open={filterSidebarOpen} onOpenChange={setFilterSidebarOpen}>
                    <SheetContent side="left" className="w-[85vw] max-w-[300px] p-0 z-[9999]" style={{ zIndex: 9999 }}>
                        <div className="h-full flex flex-col">
                            <SheetHeader className="text-left px-4 pt-4 pb-2 border-b">
                                <div className="flex justify-between items-center">
                                    <SheetTitle className="text-xl font-bold">Filters</SheetTitle>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-xs font-medium text-black hover:text-red-800 underline"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>
                            </SheetHeader>
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="mb-6">
                                    <h3 className="text-base font-semibold mb-3 flex items-center">
                                        <span className="w-6 h-6 rounded-full bg-black-100 text-black flex items-center justify-center mr-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                            </svg>
                                        </span>
                                        Sizes
                                    </h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => toggleSizeFilter(size)}
                                                className={cn(
                                                    "px-2 py-2 border rounded-md text-sm font-medium transition-colors",
                                                    selectedFilters.sizes.includes(size)
                                                        ? "bg-[#2b2b2b] text-white border-bla"
                                                        : "border-gray-300 hover:border-black"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-base font-semibold mb-3 flex items-center">
                                        <span className="w-6 h-6 rounded-full bg-black-100 text-black flex items-center justify-center mr-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <circle cx="13.5" cy="6.5" r="2.5"></circle>
                                                <circle cx="19" cy="17" r="2"></circle>
                                                <circle cx="9" cy="17" r="2.5"></circle>
                                                <circle cx="4.5" cy="12" r="1.5"></circle>
                                            </svg>
                                        </span>
                                        Colors
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => toggleColorFilter(color)}
                                                className={cn(
                                                    "flex items-center px-3 py-2 border rounded-md text-sm transition-colors",
                                                    selectedFilters.colors.includes(color)
                                                        ? "bg-[#2b2b2b] text-white border-black"
                                                        : "border-gray-300 hover:border-black"
                                                )}
                                            >
                                                <span
                                                    className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                                                    style={{ backgroundColor: color.toLowerCase() }}
                                                ></span>
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="border-t p-4">
                                <button
                                    onClick={() => setFilterSidebarOpen(false)}
                                    className="w-full bg-[#2b2b2b] text-white py-3 rounded-md font-medium hover:bg-black-700 transition-colors"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
                <WhatsMySize 
                  open={sizeModalOpen} 
                  onOpenChange={setSizeModalOpen}
                  onCategorySelect={(category) => {
                    console.log('Selected category:', category)
                  }}
                />
                <CartSidebar
                    isOpen={productSidebarOpen}
                    onClose={() => setProductSidebarOpen(false)}
                />
                
                <style jsx global>{`
          /* Custom scrollbar for the filter sidebar */
          .custom-scrollbar::-webkit-scrollbar {
            width: 20px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
          /* Hide scrollbar for recently viewed div */
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          /* Pulse animation for popular badge */
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
            }
            70% {
              box-shadow: 0 0 0 6px rgba(220, 38, 38, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
            }
          }
          .bg-[#2b2b2b] {
            animation: pulse 2s infinite;
          }
          /* Sticky header styles */
          .sticky {
            backdrop-filter: saturate(180%) blur(5px);
            background-color: rgba(255, 255, 255, 0.9);
            transition: all 0.3s ease-in-out;
          }
          /* Optimize performance */
          .sticky {
            will-change: transform;
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
          }
          /* Add subtle shadow when scrolling */
          .sticky.shadow-sm {
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          }
        `}</style>
            </div>



            {mobileCartModal.product && (
                <MobileAddToCartModal
                    isOpen={mobileCartModal.isOpen}
                    onClose={() => setMobileCartModal({ isOpen: false, product: null })}
                    product={mobileCartModal.product}
                    availableSizes={(mobileCartModal.product as any).sizeDetails || (mobileCartModal.product as any).sizes || []}
                    availableColors={(mobileCartModal.product as any).colorDetails || (mobileCartModal.product as any).colors || []}
                    selectedColorId={(mobileCartModal.product as any).colorDetails?.[0]?.id || (mobileCartModal.product as any).colors?.[0]?.id || ''}
                />
            )}

            <CategorySlider
                isOpen={categorySliderOpen}
                onClose={() => setCategorySliderOpen(false)}
                keywordCategories={keywordCategories.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    imageUrl: cat.imageUrl,
                    description: cat.description
                }))}
                currentCategory={{
                    id: category.id,
                    name: category.name,
                    slug: category.slug || '',
                    imageUrl: category.currentCategory?.imageUrl,
                    description: ''
                }}
                onCategorySelect={(selectedCategory) => {
                    router.push(`/collections/${selectedCategory.slug}`);
                    setCategorySliderOpen(false);
                }}
            />
        </section>
    )
}

const CategoryPageClient: React.FC<CategoryPageClientProps> = (props) => {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div></div>}>
            <CategoryPageClientContent {...props} />
        </Suspense>
    )
}

export default CategoryPageClient