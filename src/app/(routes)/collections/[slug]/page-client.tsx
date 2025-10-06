"use client"
import React, { useState, useRef, useEffect, useLayoutEffect } from "react"
import Image from "next/image"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { X } from "lucide-react"
import { motion, AnimatePresence, useMotionValue, animate, PanInfo } from "framer-motion"
import WhatsMySize from "@/src/components/WhatsMySize"
import type { Product, Category } from "@/types"

import { cn } from "@/src/app/lib/utils"
import JacketCategories from "@/src/app/category/JacketCategories"
import WeThinkYouWillLove from "@/src/app/category/WeThinkYouWillLove"
import RecentlyViewed from "@/src/app/category/RecentlyViewed"
import { FilterBar } from "@/src/app/components/common/FilterBar"
import StructuredData from "@/src/app/components/layout/structured-data-layout"
import CartSidebar from "@/src/app/components/layout/cart-sidebar"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/src/app/ui/sheet"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/src/app/ui/accordion"
import { useCart } from "@/src/app/contexts/CartContext"
import useWishlist from "@/src/app/hooks/use-wishlist"
import MobileAddToCartModal from "@/src/app/modals/MobileAddToCartModal"
import { CategorySlider } from "@/src/app/components/shop/components/CategorySlider"
import CategorySEOSection from "@/src/app/category/category-seo-section"
import { ProductCardWrapper } from "./components/ProductCardWrapper"
import { useViewTracking } from "@/src/app/hooks/use-view-tracking"
import { getStoreId, isTrackingEnabled } from "@/src/app/utils/store-config"

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
    filterParams?: {
        materials: string[];
        styles: string[];
        colors: string[];
        genders: string[];
        collars: string[];
        cuffs: string[];
        closures: string[];
        pockets: string[];
    }
    initialProductCount?: number
    hasMoreProducts?: boolean
}

const DRAG_BUFFER = 10;

const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
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
                    width={400}
                    height={600}
                    className="object-cover object-top w-full h-full"
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
                            width={400}
                            height={600}
                            className="object-cover object-top pointer-events-none w-full h-full"
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

const CategoryPageClientContent: React.FC<CategoryPageClientProps> = ({ 
    category, 
    products, 
    slug, 
    allCategories, 
    keywordCategories = [], 
    isKeywordCategory = false,
    filterParams,
    initialProductCount = 0,
    hasMoreProducts = false
}) => {
    const router = useRouter()
    // Removed useSearchParams to avoid SSR issues
    const wasDraggedRef = useRef(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [mounted, setMounted] = useState(false);
    const [currentSort, setCurrentSort] = useState('popular')
    const [urlSizes, setUrlSizes] = useState<string[]>([])
    const [urlColors, setUrlColors] = useState<string[]>([])
    const [filterSidebarOpen, setFilterSidebarOpen] = useState(false)
    const [categoriesSidebarOpen, setCategoriesSidebarOpen] = useState(false)
    const [categorySliderOpen, setCategorySliderOpen] = useState(false)
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
    const [sizeModalOpen, setSizeModalOpen] = useState(false)
    const [urlMaterials, setUrlMaterials] = useState<string[]>([])
    const [urlStyles, setUrlStyles] = useState<string[]>([])
    const [urlGenders, setUrlGenders] = useState<string[]>([])
    const [selectedFilters, setSelectedFilters] = useState<{
        sizes: string[];
        colors: string[];
        materials: string[];
        styles: string[];
        genders: string[];
        collars: string[];
        cuffs: string[];
        closures: string[];
        pockets: string[];
    }>({
        sizes: [],
        colors: [],
        materials: [],
        styles: [],
        genders: [],
        collars: [],
        cuffs: [],
        closures: [],
        pockets: [],
    })
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
    const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
    const [selectedColors, setSelectedColors] = useState<Record<string, string>>({})
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
    const [materialQuery, setMaterialQuery] = useState("")
    const [styleQuery, setStyleQuery] = useState("")
    
    // Load more functionality state
    const [loadedProducts, setLoadedProducts] = useState<Product[]>(products) // All loaded products (starts with initial 40)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [loadMorePage, setLoadMorePage] = useState(2) // Start from page 2 since page 1 is already loaded
    const [hasMore, setHasMore] = useState(hasMoreProducts)

    const { trackView: trackCategoryView, hasTracked: hasTrackedCategory } = useViewTracking({
        storeId: getStoreId(),
        entityId: category.id || '',
        entityType: isKeywordCategory ? 'categoryPage' : 'category',
        enabled: isTrackingEnabled() && !!category.id,
        delay: 2000 
    })

    const { addToCart } = useCart()
    const wishlist = useWishlist()
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
    const [currentProducts, setCurrentProducts] = useState<Product[]>(products)
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

    // Colors: build name->value map from products (if available), but expose names list to UI to keep logic unchanged
    const buildColorNameToValueMap = (): Map<string, string> => {
        const map = new Map<string, string>()
        const fallback: Record<string, string> = {
            Black: '#000000', White: '#FFFFFF', Blue: '#0000FF', Red: '#FF0000', Green: '#00FF00',
            Brown: '#8B4513', Gray: '#808080', Navy: '#000080', Beige: '#F5F5DC', Pink: '#FFC0CB',
            Purple: '#800080', Orange: '#FFA500', Yellow: '#FFFF00'
        }
        products.forEach(p => {
            const productColors = (p as any).colorDetails || (p as any).colors || []
            productColors.forEach((c: any) => {
                const name = (c?.name ?? '').toString()
                const value = (c?.value ?? fallback[name]) as string | undefined
                if (name) map.set(name, value || '#CCCCCC')
            })
        })
        if (map.size === 0) {
            Object.entries(fallback).forEach(([name, value]) => map.set(name, value))
        }
        return map
    }
    const colorNameToValue = buildColorNameToValueMap()
    const colors = Array.from(colorNameToValue.keys())

    const materials = ["Leather", "Denim", "Cotton", "Polyester", "Wool", "Suede"]
    const styles = ["Bomber", "Biker", "Varsity", "Aviator", "Puffer", "Trench"]
    const genders = ["Men", "Women", "Unisex"]
    const collars = ["Rib-Knitted", "Hood", "Shirt Style", "Stand"]
    const cuffs = ["Rib-Knitted", "Regular"]
    const closures = ["Zippered", "Button"]
    const pockets = ["Side Pockets", "Flap Pockets", "Chest Pockets", "Welt Pockets", "Zippered Pockets"]

    const filteredMaterials = materials.filter(m => m.toLowerCase().includes(materialQuery.toLowerCase()))
    const filteredStyles = styles.filter(s => s.toLowerCase().includes(styleQuery.toLowerCase()))

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

    const hasActiveFilters = selectedFilters.materials.length > 0 || selectedFilters.styles.length > 0 || selectedFilters.genders.length > 0 || selectedFilters.sizes.length > 0 || selectedFilters.colors.length > 0 || selectedFilters.collars.length > 0 || selectedFilters.cuffs.length > 0 || selectedFilters.closures.length > 0 || selectedFilters.pockets.length > 0
    const totalActiveFiltersCount = selectedFilters.materials.length + selectedFilters.styles.length + selectedFilters.genders.length + selectedFilters.sizes.length + selectedFilters.colors.length + selectedFilters.collars.length + selectedFilters.cuffs.length + selectedFilters.closures.length + selectedFilters.pockets.length

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateFiltersInURL(selectedFilters)
        }, 300) // Debounce filter updates
        return () => clearTimeout(timeoutId)
    }, [selectedFilters.materials, selectedFilters.styles, selectedFilters.genders, selectedFilters.sizes, selectedFilters.colors, selectedFilters.collars, selectedFilters.cuffs, selectedFilters.closures, selectedFilters.pockets])

    useEffect(() => {
        setMounted(true)
        if (loadedProducts && loadedProducts.length > 0) {
            setVisibleProducts(loadedProducts.map((p) => p.id))
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
    }, [loadedProducts, category.id, category.name])
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
        const updateLayout = () => {
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
        };

        const timeoutId = setTimeout(updateLayout, 100);
        return () => clearTimeout(timeoutId);
    }, [loadedProducts, currentProducts, hasMore]);
    useEffect(() => {
        if (layoutMetrics.startStickyPoint === 0) return;
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const { startStickyPoint, endStickyPoint } = layoutMetrics;
            const shouldBeSticky = scrollY >= startStickyPoint && scrollY < endStickyPoint;
            setIsFilterSticky(current => current !== shouldBeSticky ? shouldBeSticky : current);
        };
        const throttledHandleScroll = throttle(handleScroll, 16); 
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
    const toggleMaterialFilter = (material: string) => {
        setSelectedFilters((prev) => {
            const newMaterials = prev.materials.includes(material) ? prev.materials.filter((m) => m !== material) : [...prev.materials, material]
            return { ...prev, materials: newMaterials }
        })
    }
    const toggleStyleFilter = (style: string) => {
        setSelectedFilters((prev) => {
            const newStyles = prev.styles.includes(style) ? prev.styles.filter((s) => s !== style) : [...prev.styles, style]
            return { ...prev, styles: newStyles }
        })
    }
    const toggleGenderFilter = (gender: string) => {
        setSelectedFilters((prev) => {
            const newGenders = prev.genders.includes(gender) ? prev.genders.filter((g) => g !== gender) : [...prev.genders, gender]
            return { ...prev, genders: newGenders }
        })
    }
    const toggleCollarFilter = (collar: string) => {
        setSelectedFilters((prev) => {
            const newCollars = prev.collars.includes(collar) ? prev.collars.filter((c) => c !== collar) : [...prev.collars, collar]
            return { ...prev, collars: newCollars }
        })
    }
    const toggleCuffFilter = (cuff: string) => {
        setSelectedFilters((prev) => {
            const newCuffs = prev.cuffs.includes(cuff) ? prev.cuffs.filter((c) => c !== cuff) : [...prev.cuffs, cuff]
            return { ...prev, cuffs: newCuffs }
        })
    }
    const toggleClosureFilter = (closure: string) => {
        setSelectedFilters((prev) => {
            const newClosures = prev.closures.includes(closure) ? prev.closures.filter((c) => c !== closure) : [...prev.closures, closure]
            return { ...prev, closures: newClosures }
        })
    }
    const togglePocketFilter = (pocket: string) => {
        setSelectedFilters((prev) => {
            const newPockets = prev.pockets.includes(pocket) ? prev.pockets.filter((p) => p !== pocket) : [...prev.pockets, pocket]
            return { ...prev, pockets: newPockets }
        })
    }
    const clearFilters = () => {
        setSelectedFilters({
            materials: [],
            styles: [],
            genders: [],
            sizes: [],
            colors: [],
            collars: [],
            cuffs: [],
            closures: [],
            pockets: [],
        })
        // Clear URL parameters
        router.push(window.location.pathname, { scroll: false })
    }
    const handleSortChange = (sortBy: string) => {
        setCurrentSort(sortBy)
        // Update URL with sort parameter
        const params = new URLSearchParams(window.location.search)
        params.set('sort', sortBy)
        router.push(`?${params.toString()}`, { scroll: false })
    }
    
    // Load more functionality
    const handleLoadMore = async () => {
        if (isLoadingMore || !hasMore) return
        
        setIsLoadingMore(true)
        
        try {
            const response = await fetch('/api/collections/load-more', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    materials: filterParams?.materials || [],
                    styles: filterParams?.styles || [],
                    colors: filterParams?.colors || [],
                    genders: filterParams?.genders || [],
                    collars: filterParams?.collars || [],
                    cuffs: filterParams?.cuffs || [],
                    closures: filterParams?.closures || [],
                    pockets: filterParams?.pockets || [],
                    page: loadMorePage,
                    limit: 40,
                    sort: currentSort
                }),
            })
            
            if (!response.ok) {
                throw new Error('Failed to load more products')
            }
            
            const data = await response.json()
            
            if (data.success && data.products?.length > 0) {
                setLoadedProducts(prev => [...prev, ...data.products])
                setLoadMorePage(prev => prev + 1)
                setHasMore(data.pagination?.hasNextPage || false)
            } else {
                setHasMore(false)
            }
        } catch (error) {
            console.error('Error loading more products:', error)
            setHasMore(false)
        } finally {
            setIsLoadingMore(false)
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            const s = params.get('sort') || 'popular'
            setCurrentSort(s)

            const sizes = params.get('sizes')?.split(',').filter(Boolean) || []
            const colors = params.get('colors')?.split(',').filter(Boolean) || []
            const materials = params.get('materials')?.split(',').filter(Boolean) || []
            const styles = params.get('styles')?.split(',').filter(Boolean) || []
            const genders = params.get('genders')?.split(',').filter(Boolean) || []
            const collars = params.get('collars')?.split(',').filter(Boolean) || []
            const cuffs = params.get('cuffs')?.split(',').filter(Boolean) || []
            const closures = params.get('closures')?.split(',').filter(Boolean) || []
            const pockets = params.get('pockets')?.split(',').filter(Boolean) || []

            setUrlSizes(sizes)
            setUrlColors(colors)
            setUrlMaterials(materials)
            setUrlStyles(styles)
            setUrlGenders(genders)

            // Update selected filters
            setSelectedFilters({
                sizes,
                colors,
                materials,
                styles,
                genders,
                collars,
                cuffs,
                closures,
                pockets,
            })
        }
    }, [])
    const updateFiltersInURL = (newFilters: { materials: string[], styles: string[], genders: string[], sizes: string[], colors: string[], collars: string[], cuffs: string[], closures: string[], pockets: string[] }) => {
        const params = new URLSearchParams(window.location.search)
        if (newFilters.materials.length > 0) {
            params.set('materials', newFilters.materials.join(','))
        } else {
            params.delete('materials')
        }
        if (newFilters.styles.length > 0) {
            params.set('styles', newFilters.styles.join(','))
        } else {
            params.delete('styles')
        }
        if (newFilters.genders.length > 0) {
            params.set('genders', newFilters.genders.join(','))
        } else {
            params.delete('genders')
        }
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
        if (newFilters.collars.length > 0) {
            params.set('collars', newFilters.collars.join(','))
        } else {
            params.delete('collars')
        }
        if (newFilters.cuffs.length > 0) {
            params.set('cuffs', newFilters.cuffs.join(','))
        } else {
            params.delete('cuffs')
        }
        if (newFilters.closures.length > 0) {
            params.set('closures', newFilters.closures.join(','))
        } else {
            params.delete('closures')
        }
        if (newFilters.pockets.length > 0) {
            params.set('pockets', newFilters.pockets.join(','))
        } else {
            params.delete('pockets')
        }
        router.push(`?${params.toString()}`, { scroll: false })
    }


    const handleColorSelect = (colorId: string, productId: string) => {
        setSelectedColors((prev) => ({
            ...prev,
            [productId]: colorId,
        }));
    };

    const handleSizeSelect = (productId: string, size: string) => {
        // Look for the product in all possible arrays
        const product = currentProducts.find(p => p.id === productId) || 
                       recentlyViewed.find(p => p.id === productId) ||
                       products.find(p => p.id === productId);
        
        if (product) {
            // Get the selected color for this product
            const selectedColorId = selectedColors[productId];
            const selectedColor = selectedColorId 
                ? product.colorDetails?.find(color => color.id === selectedColorId)?.name 
                : product.colorDetails?.[0]?.name || "Default";
            
            addToCart(product, size, selectedColor)
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('openCart'));
            }
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
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('route-loading:start'))
        }
        router.push(`/us/product/${slug}`)
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
            const productColors = ((p as any).colorDetails || (p as any).colors || []).map((c: any) => String(c.name || c).trim().toLowerCase())
            const productSizes = ((p as any).sizeDetails || (p as any).sizes || []).map((s: any) => String(s.name || s).trim().toLowerCase())
            const productMaterials = ((p as any).materials || []).map((m: any) => String(m.name || m).trim().toLowerCase())
            const productStyles = ((p as any).styles || []).map((s: any) => String(s.name || s).trim().toLowerCase())
            const productGender = normalizeGender((p as any).gender || '')

            let productCollars: string[] = []
            let productCuffs: string[] = []
            let productClosures: string[] = []
            let productPockets: string[] = []
            
            if ((p as any).specifications) {
                try {
                    const specifications = typeof (p as any).specifications === 'string' 
                        ? JSON.parse((p as any).specifications) 
                        : (p as any).specifications
                    
                    productCollars = specifications.collar ? specifications.collar.map((c: any) => String(c).trim().toLowerCase()) : []
                    productCuffs = specifications.cuffs ? specifications.cuffs.map((c: any) => String(c).trim().toLowerCase()) : []
                    productClosures = specifications.closure ? specifications.closure.map((c: any) => String(c).trim().toLowerCase()) : []
                    productPockets = specifications.pockets ? specifications.pockets.map((c: any) => String(c).trim().toLowerCase()) : []
                } catch (e) {
                }
            }

            const wantedMaterials = selectedFilters.materials.map(v => String(v).trim().toLowerCase())
            const wantedStyles = selectedFilters.styles.map(v => String(v).trim().toLowerCase())
            const wantedGenders = selectedFilters.genders.map(v => String(v).trim().toLowerCase())
            const wantedSizes = selectedFilters.sizes.map(v => String(v).trim().toLowerCase())
            const wantedColors = selectedFilters.colors.map(v => String(v).trim().toLowerCase())
            const wantedCollars = selectedFilters.collars.map(v => String(v).trim().toLowerCase())
            const wantedCuffs = selectedFilters.cuffs.map(v => String(v).trim().toLowerCase())
            const wantedClosures = selectedFilters.closures.map(v => String(v).trim().toLowerCase())
            const wantedPockets = selectedFilters.pockets.map(v => String(v).trim().toLowerCase())

            const matchesMaterials = wantedMaterials.length === 0 || wantedMaterials.some(material => productMaterials.includes(material))
            const matchesStyles = wantedStyles.length === 0 || wantedStyles.some(style => productStyles.includes(style))
            const matchesGenders = wantedGenders.length === 0 || wantedGenders.some(gender => normalizeGender(gender) === productGender)
            const matchesSizes = wantedSizes.length === 0 || wantedSizes.some(size => productSizes.includes(size))
            const matchesColors = wantedColors.length === 0 || wantedColors.some(color => productColors.includes(color))
            const matchesCollars = wantedCollars.length === 0 || wantedCollars.some(collar => productCollars.includes(collar))
            const matchesCuffs = wantedCuffs.length === 0 || wantedCuffs.some(cuff => productCuffs.includes(cuff))
            const matchesClosures = wantedClosures.length === 0 || wantedClosures.some(closure => productClosures.includes(closure))
            const matchesPockets = wantedPockets.length === 0 || wantedPockets.some(pocket => productPockets.includes(pocket))
            const matchesGender = categoryGender === '' || productGender === categoryGender

            return matchesMaterials && matchesStyles && matchesGenders && matchesSizes && matchesColors && matchesCollars && matchesCuffs && matchesClosures && matchesPockets && matchesGender
        }

        let filtered = loadedProducts.filter(filterBySelections)

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
        } else {
        }

        setFilteredProducts(filtered)
        setCurrentProducts(filtered) // Since we're not paginating, show all filtered products
    }, [loadedProducts, selectedFilters, currentSort])

    // Update visible products when filtered products change
    useEffect(() => {
        setVisibleProducts(currentProducts.map(p => p.id))
    }, [currentProducts])
    
    // Update loadedProducts when new products are loaded via load more
    useEffect(() => {
        if (loadedProducts.length !== products.length) {
            // Re-apply current filters to include newly loaded products
            const filterBySelections = (p: Product) => {
                // Use the same filtering logic as the main filter effect
                const productColors = ((p as any).colorDetails || (p as any).colors || []).map((c: any) => String(c.name || c).trim().toLowerCase())
                const productSizes = ((p as any).sizeDetails || (p as any).sizes || []).map((s: any) => String(s.name || s).trim().toLowerCase())
                const productMaterials = ((p as any).materials || []).map((m: any) => String(m.name || m).trim().toLowerCase())
                const productStyles = ((p as any).styles || []).map((s: any) => String(s.name || s).trim().toLowerCase())
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
                const productGender = normalizeGender((p as any).gender || '')

                // Parse specifications for collars, cuffs, closures, pockets
                let productCollars: string[] = []
                let productCuffs: string[] = []
                let productClosures: string[] = []
                let productPockets: string[] = []
                
                if ((p as any).specifications) {
                    try {
                        const specifications = typeof (p as any).specifications === 'string' 
                            ? JSON.parse((p as any).specifications) 
                            : (p as any).specifications
                        
                        productCollars = specifications.collar ? specifications.collar.map((c: any) => String(c).trim().toLowerCase()) : []
                        productCuffs = specifications.cuffs ? specifications.cuffs.map((c: any) => String(c).trim().toLowerCase()) : []
                        productClosures = specifications.closure ? specifications.closure.map((c: any) => String(c).trim().toLowerCase()) : []
                        productPockets = specifications.pockets ? specifications.pockets.map((c: any) => String(c).trim().toLowerCase()) : []
                    } catch (e) {
                        // If parsing fails, use empty arrays
                    }
                }

                const wantedMaterials = selectedFilters.materials.map(v => String(v).trim().toLowerCase())
                const wantedStyles = selectedFilters.styles.map(v => String(v).trim().toLowerCase())
                const wantedGenders = selectedFilters.genders.map(v => String(v).trim().toLowerCase())
                const wantedSizes = selectedFilters.sizes.map(v => String(v).trim().toLowerCase())
                const wantedColors = selectedFilters.colors.map(v => String(v).trim().toLowerCase())
                const wantedCollars = selectedFilters.collars.map(v => String(v).trim().toLowerCase())
                const wantedCuffs = selectedFilters.cuffs.map(v => String(v).trim().toLowerCase())
                const wantedClosures = selectedFilters.closures.map(v => String(v).trim().toLowerCase())
                const wantedPockets = selectedFilters.pockets.map(v => String(v).trim().toLowerCase())

                const matchesMaterials = wantedMaterials.length === 0 || wantedMaterials.some(material => productMaterials.includes(material))
                const matchesStyles = wantedStyles.length === 0 || wantedStyles.some(style => productStyles.includes(style))
                const matchesGenders = wantedGenders.length === 0 || wantedGenders.some(gender => normalizeGender(gender) === productGender)
                const matchesSizes = wantedSizes.length === 0 || wantedSizes.some(size => productSizes.includes(size))
                const matchesColors = wantedColors.length === 0 || wantedColors.some(color => productColors.includes(color))
                const matchesCollars = wantedCollars.length === 0 || wantedCollars.some(collar => productCollars.includes(collar))
                const matchesCuffs = wantedCuffs.length === 0 || wantedCuffs.some(cuff => productCuffs.includes(cuff))
                const matchesClosures = wantedClosures.length === 0 || wantedClosures.some(closure => productClosures.includes(closure))
                const matchesPockets = wantedPockets.length === 0 || wantedPockets.some(pocket => productPockets.includes(pocket))

                return matchesMaterials && matchesStyles && matchesGenders && matchesSizes && matchesColors && matchesCollars && matchesCuffs && matchesClosures && matchesPockets
            }
            
            const newFiltered = loadedProducts.filter(filterBySelections)
            setFilteredProducts(newFiltered)
            setCurrentProducts(newFiltered)
        }
    }, [loadedProducts, selectedFilters])
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

        // Find the proper slug for the current category
        const matchingKeywordCategory = keywordCategories.find(kc =>
            kc.id === category.id ||
            kc.name.toLowerCase() === category.name.toLowerCase()
        );
        const matchingRegularCategory = allCategories.find(c => c.id === category.id);
        const properSlug = matchingKeywordCategory?.slug ||
            matchingRegularCategory?.slug ||
            category.slug ||
            category.name.toLowerCase().replace(/\s+/g, '-');

        currentCategory = {
            categoryId: category.id,
            categoryName: category.name,
            imageUrl: imageUrl,
            slug: properSlug
        };
    }
    let categories: { name: string; icon: string; slug: string; categoryId: string; }[] = [];
    if (parsedCategoryContent?.otherCategories && parsedCategoryContent.otherCategories.length > 0) {
        categories = parsedCategoryContent.otherCategories.map((cat: any) => {
            const foundCategory = allCategories.find(c => c.id === cat.categoryId);
            // First try to find a matching keyword category by name or ID
            const matchingKeywordCategory = keywordCategories.find(kc =>
                kc.id === cat.categoryId ||
                kc.name.toLowerCase() === cat.categoryName.toLowerCase()
            );

            // Prioritize keyword category slug, then regular category slug, then generate one
            const categorySlug = matchingKeywordCategory?.slug ||
                foundCategory?.slug ||
                cat.categoryName.toLowerCase().replace(/\s+/g, '-');

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
        // When no otherCategories, prioritize keyword categories over regular categories
        const categoriesToUse = keywordCategories.length > 0 ? keywordCategories.slice(0, 5) : allCategories.slice(0, 5);
        categories = categoriesToUse.map(cat => {
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
                    onCategoryClick={(categorySlug) => {
                        const currentPath = window.location.pathname;
                        const targetPath = `/us/collections/${categorySlug}`;
                        
                        if (currentPath === targetPath) {
                            window.dispatchEvent(new CustomEvent('route-loading:end'));
                            return;
                        }
                        
                        router.push(targetPath);
                    }}
                    currentCategory={currentCategory || undefined}
                />
                <div className="mt-0.1 sm:mt-6 md:mt-8 lg:mt-8 xl:mt-8 mb-0 sm:mb-2 md:mb-6 lg:mb-6 xl:mb-6">
                    <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl font-bold text-gray-900">{category.name}</h1>
                </div>
            </div>
            <div className="mx-auto w-full px-2 sm:px-6 md:px-6 lg:px-8 xl:px-8 py-3 sm:py-3 md:py-6 lg:py-6 xl:py-6">
                <div ref={filterBarWrapperRef} data-filter-bar style={{ height: isFilterSticky ? `${layoutMetrics.filterBarHeight}px` : 'auto' }}>
                    <FilterBar
                        category={category}
                        hasActiveFilters={hasActiveFilters}
                        isFilterSticky={isFilterSticky}
                        sortDropdownOpen={sortDropdownOpen}
                        setSortDropdownOpen={setSortDropdownOpen}
                        setCategorySliderOpen={setCategorySliderOpen}
                        setFilterSidebarOpen={setFilterSidebarOpen}
                        setSizeModalOpen={setSizeModalOpen}
                        clearFilters={clearFilters}
                        selectedFilters={selectedFilters}
                        totalActiveFilters={totalActiveFiltersCount}
                        onSortChange={handleSortChange}
                        currentSort={currentSort}
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
                                {currentProducts.length === 0 
                                    ? "No products found" 
                                    : `Showing ${currentProducts.length} products`
                                }
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-4 lg:gap-5 xl:gap-6 gap-y-8 md:gap-y-4 lg:gap-y-5 xl:gap-y-6">
                                {currentProducts.map((product, index) => (
                                    <ProductCardWrapper
                                        key={`${product.id}-${index}`}
                                        product={product}
                                        index={index}
                                        isDesktop={isDesktop}
                                        hoveredProduct={hoveredProduct}
                                        setHoveredProduct={setHoveredProduct}
                                        selectedSizes={selectedSizes}
                                        selectedColors={selectedColors}
                                        handleSizeSelect={handleSizeSelect}
                                        handleColorSelect={handleColorSelect}
                                        handleClick={handleClick}
                                        addToRecentlyViewed={addToRecentlyViewed}
                                        wishlist={wishlist}
                                        setMobileCartModal={setMobileCartModal}
                                        loadingProducts={loadingProducts}
                                        visibleProducts={visibleProducts}
                                        wasDraggedRef={wasDraggedRef}
                                        openColorModal={{ isOpen: colorPopup?.productKey === `${product.id}-${index}` || false, product: colorPopup?.productKey === `${product.id}-${index}` ? product : null }}
                                        setOpenColorModal={(modal) => {
                                            if (modal.isOpen) {
                                                setColorPopup({ productKey: `${product.id}-${index}`, rect: { top: 0, left: 0, right: 0, bottom: 0, height: 0, width: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect })
                                            } else {
                                                setColorPopup(null)
                                            }
                                        }}
                                        productRefs={productRefs}
                                        onProductUpdate={(updatedProduct) => {
                                            setCurrentProducts(prev => {
                                                const newProducts = [...prev]
                                                // const productIndex = newProducts.findIndex(p => p.id === product.id)
                                                // if (productIndex !== -1) {
                                                //   newProducts[productIndex] = updatedProduct
                                                if (index < newProducts.length) {
                                                    newProducts[index] = updatedProduct
                                                }
                                                return newProducts
                                            })
                                            
                                            setFilteredProducts(prev => {
                                                const newProducts = [...prev]
                                                // const productIndex = newProducts.findIndex(p => p.id === product.id)
                                                // if (productIndex !== -1) {
                                                //   newProducts[productIndex] = updatedProduct
                                                if (index < newProducts.length) {
                                                    newProducts[index] = updatedProduct
                                                }
                                                return newProducts
                                            })
                                        }}
                                        setLoadingProducts={setLoadingProducts}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10">No products found in this category.</div>
                    )}
                </div>
                <div ref={paginationSectionRef}>
                    {hasMore && (
                        <div className="flex items-center justify-center mt-8 mb-4">
                            <button
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                className="px-8 py-3 bg-[#2b2b2b] text-white  hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                            >
                                {isLoadingMore ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Loading more...
                                    </div>
                                ) : (
                                    'Load More Products'
                                )}
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
                            selectedColors={selectedColors}
                            addToRecentlyViewed={addToRecentlyViewed}
                            handleClick={handleClick}
                            handleSizeSelect={handleSizeSelect}
                            handleColorSelect={handleColorSelect}
                            onAddToCartClick={(product) => setMobileCartModal({ isOpen: true, product })}
                        />
                    )}
                    {recentlyViewed.length > 0 && (
                        <RecentlyViewed
                            recentlyViewed={recentlyViewed}
                            hoveredProduct={hoveredProduct}
                            setHoveredProduct={setHoveredProduct}
                            selectedSizes={selectedSizes}
                            selectedColors={selectedColors}
                            addToRecentlyViewed={addToRecentlyViewed}
                            handleClick={handleClick}
                            handleSizeSelect={handleSizeSelect}
                            handleColorSelect={handleColorSelect}
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
                        <div className="h-full flex flex-col relative">
                            <button
                                onClick={() => setCategoriesSidebarOpen(false)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors z-10 text-gray-600 hover:text-gray-800"
                            >
                                ✕
                            </button>
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
                                                    router.push(`/us/collections/${categorySlug}`)
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
                    <SheetContent side="left" className="w-[90vw] max-w-[380px] p-0 z-[9999]" style={{ zIndex: 9999 }}>
                        <SheetHeader className="px-6 py-6 bg-white border-b border-gray-100">
                            <SheetTitle className="text-xl font-semibold text-gray-900">Filters</SheetTitle>
                        </SheetHeader>
                        <div className="h-full flex flex-col bg-gray-50">
                            {/* Active Filter Chips */}
                            {hasActiveFilters && (
                                <div className="px-6 py-3 bg-white border-b border-gray-100">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex flex-wrap gap-2 flex-1">
                                            {(['materials', 'styles', 'genders', 'sizes', 'colors', 'collars', 'cuffs', 'closures', 'pockets'] as const).map(group =>
                                                selectedFilters[group].map((value) => (
                                                    <span
                                                        key={`${group}-${value}`}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-100 text-gray-800 border border-gray-300"
                                                    >
                                                        {value}
                                                        <button
                                                            onClick={() => {
                                                                if (group === 'materials') toggleMaterialFilter(value)
                                                                if (group === 'styles') toggleStyleFilter(value)
                                                                if (group === 'genders') toggleGenderFilter(value)
                                                                if (group === 'sizes') toggleSizeFilter(value)
                                                                if (group === 'colors') toggleColorFilter(value)
                                                                if (group === 'collars') toggleCollarFilter(value)
                                                                if (group === 'cuffs') toggleCuffFilter(value)
                                                                if (group === 'closures') toggleClosureFilter(value)
                                                                if (group === 'pockets') togglePocketFilter(value)
                                                            }}
                                                            className="w-4 h-4  bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors flex items-center justify-center"
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
                                            onClick={clearFilters}
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
                                                key={material}
                                                onClick={() => toggleMaterialFilter(material)}
                                                className={cn(
                                                    "px-3 py-2 text-sm font-medium transition-colors border",
                                                    selectedFilters.materials.includes(material)
                                                        ? "bg-gray-900 text-white border-gray-900"
                                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                                )}
                                            >
                                                {material}
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
                                                key={style}
                                                onClick={() => toggleStyleFilter(style)}
                                                className={cn(
                                                    "px-3 py-2  text-sm font-medium transition-colors border",
                                                    selectedFilters.styles.includes(style)
                                                        ? "bg-gray-900 text-white border-gray-900"
                                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                                )}
                                            >
                                                {style}
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
                                                key={gender}
                                                onClick={() => toggleGenderFilter(gender)}
                                                className={cn(
                                                    "px-3 py-2  text-sm font-medium transition-colors border",
                                                    selectedFilters.genders.includes(gender)
                                                        ? "bg-gray-900 text-white border-gray-900"
                                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                                )}
                                            >
                                                {gender}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sizes */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-3">Sizes</h3>
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => toggleSizeFilter(size)}
                                                className={cn(
                                                    "px-2.5 py-1.5  text-xs font-semibold transition-colors border",
                                                    selectedFilters.sizes.includes(size)
                                                        ? "bg-gray-900 text-white border-gray-900"
                                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-3">Colors</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {colors.map((colorName) => (
                                            <button
                                                key={colorName}
                                                onClick={() => toggleColorFilter(colorName)}
                                                className={cn(
                                                    "flex items-center gap-2.5 px-3 py-2  text-sm font-medium transition-colors border",
                                                    selectedFilters.colors.includes(colorName)
                                                        ? "bg-gray-900 text-white border-gray-900"
                                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "w-3.5 h-3.5  border",
                                                        selectedFilters.colors.includes(colorName)
                                                            ? "border-white"
                                                            : "border-gray-300"
                                                    )}
                                                    style={{ backgroundColor: colorNameToValue.get(colorName) || colorName.toLowerCase() }}
                                                />
                                                {colorName}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-3">Collars</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {collars.map((collar) => (
                                            <button
                                                key={collar}
                                                onClick={() => toggleCollarFilter(collar)}
                                                className={cn(
                                                    "px-3 py-2 text-sm font-medium transition-colors border",
                                                    selectedFilters.collars.includes(collar)
                                                        ? "bg-gray-900 text-white border-gray-900"
                                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                                )}
                                            >
                                                {collar}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-3">Cuffs</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {cuffs.map((cuff) => (
                                            <button
                                                key={cuff}
                                                onClick={() => toggleCuffFilter(cuff)}
                                                className={cn(
                                                    "px-3 py-2 text-sm font-medium transition-colors border",
                                                    selectedFilters.cuffs.includes(cuff)
                                                        ? "bg-gray-900 text-white border-gray-900"
                                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                                )}
                                            >
                                                {cuff}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-3">Closures</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {closures.map((closure) => (
                                            <button
                                                key={closure}
                                                onClick={() => toggleClosureFilter(closure)}
                                                className={cn(
                                                    "px-3 py-2 text-sm font-medium transition-colors border",
                                                    selectedFilters.closures.includes(closure)
                                                        ? "bg-gray-900 text-white border-gray-900"
                                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                                )}
                                            >
                                                {closure}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-3">Pockets</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {pockets.map((pocket) => (
                                            <button
                                                key={pocket}
                                                onClick={() => togglePocketFilter(pocket)}
                                                className={cn(
                                                    "px-3 py-2 text-sm font-medium transition-colors border",
                                                    selectedFilters.pockets.includes(pocket)
                                                        ? "bg-gray-900 text-white border-gray-900"
                                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                                )}
                                            >
                                                {pocket}
                                            </button>
                                        ))}
                                    </div>
                                </div> */}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-200 bg-white p-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={clearFilters}
                                        className="flex-1 px-3 py-2 border border-gray-300 text-gray-700  text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setFilterSidebarOpen(false)}
                                        className="flex-1 px-3 py-2 bg-gray-900 text-white  text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                                    >
                                        Apply ({currentProducts.length})
                                    </button>
                                </div>
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
          /* removed global red pulse animation */
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
                    selectedColorId={
                        selectedColors[mobileCartModal.product.id] || 
                        (mobileCartModal.product as any).colorDetails?.[0]?.id || 
                        (mobileCartModal.product as any).colors?.[0]?.id || 
                        ''
                    }
                />
            )}

            {/* SEO: Hidden category links for search engines */}
            <div className="sr-only" aria-hidden="true">
                <nav aria-label="Category Navigation">
                    <span className="sr-only">Available Categories</span>
                    {keywordCategories.map((cat, index) => (
                        <Link 
                            key={cat.id || index}
                            href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fineystjackets.com/us'}/collections/${cat.slug}`}
                            className="sr-only"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </nav>
            </div>

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
                relatedCategories={categories.map(cat => ({
                    id: cat.categoryId || cat.slug || '',
                    name: cat.name || '',
                    slug: cat.slug || cat.categoryId || '',
                    imageUrl: cat.icon || '',
                    description: ''
                }))}
                currentCategory={{
                    id: category.id,
                    name: category.name,
                    slug: category.slug || '',
                    imageUrl: category.currentCategory?.imageUrl,
                    description: ''
                }}
                onCategorySelect={(selectedCategory) => {
                    router.push(`/us/collections/${selectedCategory.slug}`);
                    setCategorySliderOpen(false);
                }}
            />
        </section>
    )
}

const CategoryPageClient: React.FC<CategoryPageClientProps> = (props) => {
    return (
        <CategoryPageClientContent {...props} />
    )
}

export default CategoryPageClient