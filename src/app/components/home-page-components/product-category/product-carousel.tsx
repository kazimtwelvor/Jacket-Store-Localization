
"use client"
import { useState, useEffect, useRef, useMemo, useLayoutEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, useMotionValue, animate } from "framer-motion"
import { cn } from "@/src/app/lib/utils"
import getProducts from "@/src/app/actions/get-products"
import Currency from "@/src/app/ui/currency"
import { avertaBlack, avertaBold } from "@/src/lib/fonts"
import { useRouter } from "next/navigation"

export interface Product {
    id: string
    name: string
    price: number
    slug: string
    salePrice?: number
    originalPrice?: number
    images: { url: string }[]
    imageUrl?: string
    gender?: string
}

interface ProductCarouselProps {
    title?: string
    items?: Product[]
}

const CATEGORIES = ["MEN", "WOMEN"] as const
type Category = typeof CATEGORIES[number]

const SPRING_OPTIONS = {
    type: "spring",
    stiffness: 700,
    damping: 50,
} as const

function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false)
    useEffect(() => {
        const media = window.matchMedia(query)
        if (media.matches !== matches) setMatches(media.matches)
        const listener = () => setMatches(media.matches)
        media.addEventListener("change", listener)
        return () => media.removeEventListener("change", listener)
    }, [query, matches])
    return matches
}

export default function ProductCarousel({ title = "HAND-PICKED FOR YOU", items = [] }: ProductCarouselProps) {
    const router = useRouter()
    const [activeCategory, setActiveCategory] = useState<Category>("MEN")
    const [productItems, setProductItems] = useState<Product[]>(items)
    const [loading, setLoading] = useState(true)
    const trackRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const isTransitioning = useRef(false)
    const [isJumping, setIsJumping] = useState(false)
    const isMobile = useMediaQuery("(max-width: 768px)")
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchStartY, setTouchStartY] = useState<number | null>(null)
    const [isScrolling, setIsScrolling] = useState(false)

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true)
            setProductItems([])
            try {
                const result = await getProducts({
                    genders: activeCategory === 'MEN' ? 'Male' : 'Female',
                    limit: 10,
                })
                const convertedProducts = (result.products || []).map((product: any) => {
                    const transformedImages = product.images?.map((img: any) => ({
                        url: img.url || img.image?.url || "/placeholder.svg"
                    })) || []
                    return {
                        id: product.id,
                        name: product.name,
                        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                        slug: product.slug || `product-${product.id}`,
                        salePrice: product.salePrice ? parseFloat(product.salePrice as string) : undefined,
                        originalPrice: product.originalPrice ? parseFloat(product.originalPrice as string) : undefined,
                        images: transformedImages,
                        imageUrl: product.imageUrl,
                        gender: product.gender,
                    } as Product
                })
                setProductItems(convertedProducts)
            } catch (error) {
                console.error('Error fetching products:', error)
                setProductItems([])
            } finally {
                setLoading(false)
            }
        }
        fetchCategoryProducts()
    }, [activeCategory])

    const canLoop = productItems.length > 1
    const BUFFER = canLoop ? Math.min(productItems.length, 3) : 0

    const displayItems = useMemo(() => {
        if (!canLoop) return productItems
        return [
            ...productItems.slice(-BUFFER),
            ...productItems,
            ...productItems.slice(0, BUFFER),
        ]
    }, [canLoop, productItems, BUFFER])

    const [activeIndex, setActiveIndex] = useState(canLoop ? BUFFER : 0)

    const getOffsetForIndex = useCallback((index: number): number => {
        if (isMobile || !trackRef.current || !trackRef.current.children[index]) return 0
        const track = trackRef.current
        const activeCard = track.children[index] as HTMLElement
        const trackWidth = track.offsetWidth
        const cardWidth = activeCard.offsetWidth
        const cardLeft = activeCard.offsetLeft
        return trackWidth / 2 - cardLeft - cardWidth / 2
    }, [isMobile]);

    useEffect(() => {
        const newIndex = canLoop ? BUFFER : 0;
        setActiveIndex(newIndex);
        x.set(getOffsetForIndex(newIndex));
    }, [activeCategory, canLoop, BUFFER, getOffsetForIndex, x])

    const handleJump = useCallback(() => {
        if (!canLoop) {
            isTransitioning.current = false
            return
        }

        const isAtCloneEnd = activeIndex >= productItems.length + BUFFER
        const isAtCloneStart = activeIndex < BUFFER

        if (isAtCloneEnd || isAtCloneStart) {
            setIsJumping(true)
            const newIndex = isAtCloneStart
                ? activeIndex + productItems.length
                : activeIndex - productItems.length
            setActiveIndex(newIndex)
        } else {
            isTransitioning.current = false
        }
    }, [canLoop, productItems.length, BUFFER, activeIndex]);

    useLayoutEffect(() => {
        if (isMobile || isJumping) return

        const offset = getOffsetForIndex(activeIndex)
        if (!isFinite(offset)) return

        if (Math.abs(x.get() - offset) < 1) {
            isTransitioning.current = false;
            return;
        }

        const animation = animate(x, offset, {
            ...SPRING_OPTIONS,
            onComplete: handleJump,
        })

        return () => animation.stop()
    }, [activeIndex, x, isJumping, isMobile, handleJump, getOffsetForIndex])

    useLayoutEffect(() => {
        if (isJumping) {
            const targetOffset = getOffsetForIndex(activeIndex);
            x.set(targetOffset);

            const timer = setTimeout(() => {
                setIsJumping(false);
                isTransitioning.current = false;
            }, 0);

            return () => clearTimeout(timer);
        }
    }, [isJumping, activeIndex, getOffsetForIndex, x]);


    const nextSlide = () => {
        if (isTransitioning.current || !canLoop) return
        isTransitioning.current = true
        setActiveIndex(prev => prev + 1)
    }

    const prevSlide = () => {
        if (isTransitioning.current || !canLoop) return
        isTransitioning.current = true
        setActiveIndex(prev => prev - 1)
    }

    const getImageUrl = (product: Product) => {
        return product.images?.[0]?.url || product.imageUrl || "/placeholder.svg"
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        if (isTransitioning.current || !canLoop) return
        setTouchStart(e.targetTouches[0].clientX)
        setTouchStartY(e.targetTouches[0].clientY)
        setIsScrolling(false)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStart === null || touchStartY === null) return
        const touchCurrent = e.targetTouches[0].clientX
        const touchCurrentY = e.targetTouches[0].clientY
        const distanceX = Math.abs(touchStart - touchCurrent)
        const distanceY = Math.abs(touchStartY - touchCurrentY)

        if (distanceX > 10 && distanceX > distanceY) {
            setIsScrolling(true)
        }
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null || touchStartY === null) return
        const touchEnd = e.changedTouches[0].clientX
        const touchEndY = e.changedTouches[0].clientY
        const distanceX = touchStart - touchEnd
        const distanceY = Math.abs(touchStartY - touchEndY)

        if (Math.abs(distanceX) > 50 && Math.abs(distanceX) > distanceY) {
            distanceX > 0 ? nextSlide() : prevSlide()
        }

        // Reset scrolling state after a delay
        setTimeout(() => setIsScrolling(false), 100)
        setTouchStart(null)
        setTouchStartY(null)
    }

    const widthExpression = 'calc(23% - 14px)'

    return (
        <section className="w-full flex justify-center bg-white pb-8 sm:pb-12 md:pb-16">
            <div className="w-full max-w-[2000px] overflow-hidden relative">
                <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 text-[#2b2b2b] ${avertaBlack.className}`}>{title}</h2>
                <div className="flex justify-center -mt-2 mb-4 md:mb-6 gap-1">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className="px-2 text-base font-medium transition-colors text-gray-700 hover:text-[#2b2b2b]"
                            aria-pressed={activeCategory === category}
                        >
                            <span
                                className={cn(
                                    `${avertaBold.className} inline-block border-b-2 pb-0.5 transition-colors`,
                                    activeCategory === category
                                        ? "border-[#2b2b2b] text-[#2b2b2b]"
                                        : "border-transparent"
                                )}
                            >
                                {category}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                    <div className="overflow-hidden relative min-h-[600px]">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-50 w-full h-full">
                                <div className="flex flex-col items-center gap-6">
                                    <div className="w-20 h-20 border-4 border-dashed rounded-full animate-spin border-[#2b2b2b]"></div>
                                    <p className="text-gray-700 font-semibold text-lg">Loading products...</p>
                                </div>
                            </div>
                        ) : productItems.length === 0 ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-50 w-full h-full">
                                <p className="text-gray-500 text-lg">No products available for this category.</p>
                            </div>
                        ) : isMobile ? (
                            <div
                                className="relative flex items-center justify-center h-[550px] overflow-hidden"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                style={{ touchAction: 'pan-y' }}
                            >
                                {displayItems.map((product, i) => {
                                    const isCenter = i === activeIndex
                                    const isPrev = i === activeIndex - 1
                                    const isNext = i === activeIndex + 1
                                    const animateProps = isCenter
                                        ? { x: '0%', scale: 1.04, opacity: 1, zIndex: 3, y: 20 }
                                        : isPrev
                                            ? { x: '-100%', scale: 0.85, opacity: 1, zIndex: 2, y: 10 }
                                            : isNext
                                                ? { x: '100%', scale: 0.85, opacity: 1, zIndex: 2, y: 10 }
                                                : i < activeIndex
                                                    ? { x: '-130%', scale: 0.7, opacity: 0, zIndex: 1, y: 10 }
                                                    : { x: '130%', scale: 0.7, opacity: 0, zIndex: 1, y: 10 }

                                    return (
                                        <motion.div
                                            key={`${product.id}-${i}`}
                                            className="absolute top-0 bottom-0 w-[65%] max-w-[280px]"
                                            animate={animateProps}
                                            transition={isJumping ? { duration: 0 } : SPRING_OPTIONS}
                                            onAnimationComplete={() => i === activeIndex && handleJump()}
                                        >
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <motion.div
                                                    className="relative cursor-pointer group overflow-hidden w-full"
                                                    style={{ aspectRatio: '252.7 / 383.3' }}
                                                    onTap={() => {
                                                        if (isScrolling) return
                                                        if (!isCenter) {
                                                            if (isTransitioning.current) return
                                                            isTransitioning.current = true
                                                            setActiveIndex(i)
                                                                                                                } else {
                                                            router.push(`/product/${product.slug}`)
                                                        }
                                                    }}
                                                >
                                                    <img
                                                        src={getImageUrl(product)}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.currentTarget.src = "/placeholder.svg" }}
                                                        draggable="false"
                                                    />
                                                </motion.div>
                                                <div className="text-center mt-3 sm:mt-4 w-full px-1">
                                                    <h3 className="font-semibold text-xs sm:text-sm text-gray-800 whitespace-nowrap overflow-hidden ">{product.name}</h3>
                                                    <div className="flex justify-center items-center gap-1 sm:gap-2 text-sm sm:text-base mt-1">
                                                        {product.salePrice ? (
                                                            <>
                                                                <div className="text-red-800 font-bold">
                                                                    <Currency value={product.salePrice} />
                                                                </div>
                                                                <div className="text-gray-500 line-through text-sm">
                                                                    <Currency value={product.originalPrice || product.price} />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-red-800 font-bold">
                                                                <Currency value={product.price} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="py-4 sm:py-6 md:py-8 overflow-hidden">
                                <motion.div
                                    ref={trackRef}
                                    className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4"
                                    style={{ x }}
                                    onWheel={(e) => {
                                        e.preventDefault()
                                        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                                            if (e.deltaX > 0) {
                                                nextSlide()
                                            } else {
                                                prevSlide()
                                            }
                                        }
                                    }}

                                >
                                    {displayItems.map((product, i) => {
                                        const isCenter = i === activeIndex
                                        const VISUAL_GAP = '2px'
                                        const M = `calc((${VISUAL_GAP} - 0.17 * ${widthExpression}) / 2)`
                                        const delta = `calc(0.05 * ${widthExpression})`
                                        let marginLeft = M
                                        let marginRight = M
                                        if (isCenter) {
                                            marginLeft = `calc(${M} + ${delta})`
                                            marginRight = `calc(${M} + ${delta})`
                                        } else if (i === activeIndex - 1) {
                                            marginRight = `calc(${M} + ${delta})`
                                        } else if (i === activeIndex + 1) {
                                            marginLeft = `calc(${M} + ${delta})`
                                        }

                                        return (
                                            <div
                                                key={`${product.id}-${i}`}
                                                className="flex-shrink-0 cursor-pointer"
                                                style={{ width: widthExpression, marginLeft, marginRight }}
                                                onClick={() => {
                                                    if (isScrolling) return
                                                    router.push(`/product/${product.slug}`)
                                                }}
                                            >
                                                <motion.div
                                                    animate={{ scale: isCenter ? 1.05 : 0.85, y: isCenter ? 20 : 10 }}
                                                    transition={isJumping ? { duration: 0 } : SPRING_OPTIONS}
                                                >
                                                    <div className="relative group overflow-hidden bg-gray-100" style={{ aspectRatio: '280/420' }}>
                                                        <img
                                                            src={getImageUrl(product)}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            onError={(e) => { e.currentTarget.src = "/placeholder.svg" }}
                                                            draggable="false"
                                                        />
                                                    </div>
                                                    <div className="text-center mt-2 sm:mt-3 md:mt-4 px-1 sm:px-2">
                                                        <h3 className={`font-bold text-xs sm:text-sm md:text-base text-black uppercase leading-tight mb-1 whitespace-nowrap overflow-hidden  group-hover:text-[#2b2b2b] transition-colors ${avertaBlack.className}`}>
                                                            {product.name}
                                                        </h3>
                                                        <div className="flex justify-center items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base">
                                                            {product.salePrice ? (
                                                                <>
                                                                    <div className="text-black font-bold">
                                                                        <Currency value={product.salePrice} />
                                                                    </div>
                                                                    <div className="text-gray-500 line-through text-sm">
                                                                        <Currency value={product.originalPrice || product.price} />
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="text-black font-bold">
                                                                    <Currency value={product.price} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        )
                                    })}
                                </motion.div>
                            </div>
                        )}
                    </div>

                    <button
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black text-white p-2 md:p-3 shadow-lg hover:bg-gray-800 transition-all duration-300 z-10 hidden md:flex"
                        onClick={prevSlide}
                        disabled={!canLoop && activeIndex === 0}
                        aria-label="Previous"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white p-2 md:p-3 shadow-lg hover:bg-gray-800 transition-all duration-300 z-10 hidden md:flex"
                        onClick={nextSlide}
                        disabled={!canLoop && activeIndex === productItems.length - 1}
                        aria-label="Next"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </section>
    )
}