"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface BlogItem {
    id: string
    title: string
    excerpt?: string
    description?: string
    image: string
    link: string
    author?: string
    date?: string
    category?: string
    readTime?: string
}

const BlogsShowcase = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [visibleItems, setVisibleItems] = useState(3)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)
    const [mouseStart, setMouseStart] = useState<number | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState(0)
    const [hasDragged, setHasDragged] = useState(false)
    const carouselRef = useRef<HTMLDivElement>(null)
    const [scrollAmount, setScrollAmount] = useState(0)
    const [isDesktop, setIsDesktop] = useState(false)

    const blogItems: BlogItem[] = [
        {
            id: "tech-innovation-2024",
            title: "The Future of Technology Innovation",
            excerpt: "Exploring Tomorrow's Tech",
            description: "Discover how emerging technologies are reshaping our digital landscape.",
            image: "https://jacket.us.com/uploads/2025/women-wearing-leather-jacket-homepage.jpg",
            link: "/blog/tech-innovation-2024",
            author: "John Smith",
            date: "Dec 15, 2024",
            category: "Technology",
            readTime: "5 min read",
        },
        {
            id: "business-strategy-guide",
            title: "Strategic Business Growth in 2025",
            excerpt: "Growth Strategies",
            description: "Essential strategies for scaling your business in the modern economy.",
            image: "https://jacket.us.com/uploads/2025/Whisk_5a021bacd5.jpg",
            link: "/blog/business-strategy-guide",
            author: "Sarah Johnson",
            date: "Dec 12, 2024",
            category: "Business",
            readTime: "8 min read",
        },
        {
            id: "design-trends-2025",
            title: "Design Trends Shaping 2025",
            excerpt: "Creative Vision",
            description: "The latest design trends that will define the creative landscape ahead.",
            image: "https://jacket.us.com/uploads/2025/aviator_2.jpg",
            link: "/blog/design-trends-2025",
            author: "Mike Chen",
            date: "Dec 10, 2024",
            category: "Design",
            readTime: "6 min read",
        },
        {
            id: "sustainability-impact",
            title: "Sustainability in Modern Business",
            excerpt: "Green Innovation",
            description: "How sustainable practices are becoming essential for business success.",
            image: "/images/blog-sustainability.webp",
            link: "/blog/sustainability-impact",
            author: "Emma Davis",
            date: "Dec 8, 2024",
            category: "Sustainability",
            readTime: "7 min read",
        },
        {
            id: "digital-transformation",
            title: "Digital Transformation Essentials",
            excerpt: "Tech Evolution",
            description: "Navigate the digital revolution with proven transformation strategies.",
            image: "/images/blog-digital.webp",
            link: "/blog/digital-transformation",
            author: "Alex Rodriguez",
            date: "Dec 5, 2024",
            category: "Technology",
            readTime: "9 min read",
        },
        {
            id: "leadership-insights",
            title: "Leadership in the Digital Age",
            excerpt: "Modern Leadership",
            description: "Essential leadership skills for navigating today's complex business environment.",
            image: "/images/blog-leadership.webp",
            link: "/blog/leadership-insights",
            author: "Lisa Thompson",
            date: "Dec 3, 2024",
            category: "Leadership",
            readTime: "6 min read",
        }
    ]

    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 1024)
        }

        const calculateLayout = () => {
            setTimeout(() => {
                if (carouselRef.current && !isDesktop) {
                    const viewport = carouselRef.current.querySelector(
                        ".overflow-hidden",
                    ) as HTMLElement | null
                    const itemElement = viewport?.querySelector(
                        ".group",
                    ) as HTMLElement | null
                    const motionDiv = itemElement?.parentElement as HTMLElement | null

                    if (viewport && itemElement && motionDiv) {
                        const viewportWidth = viewport.offsetWidth
                        const itemWidth = itemElement.offsetWidth
                        const motionDivStyle = window.getComputedStyle(motionDiv)
                        const gap = parseFloat(motionDivStyle.gap) || 0
                        const totalItemWidth = itemWidth + gap

                        if (totalItemWidth > 0) {
                            setScrollAmount(totalItemWidth)
                            const newVisibleItems = Math.max(1, Math.floor(viewportWidth / totalItemWidth))
                            setVisibleItems(newVisibleItems)
                        }
                    }
                }
            }, 50)
        }

        checkDesktop()
        calculateLayout()

        const handleResize = () => {
            checkDesktop()
            calculateLayout()
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [isDesktop])

    useEffect(() => {
        const maxIndex = Math.max(0, blogItems.length - visibleItems)
        if (currentIndex > maxIndex) {
            setCurrentIndex(maxIndex)
        }
    }, [blogItems.length, visibleItems, currentIndex])

    const handleNext = () => {
        if (isAnimating || currentIndex + visibleItems >= blogItems.length) return
        setIsAnimating(true)
        setCurrentIndex((prev) => prev + 1)
        setTimeout(() => setIsAnimating(false), 500)
    }

    const handlePrev = () => {
        if (isAnimating || currentIndex <= 0) return
        setIsAnimating(true)
        setCurrentIndex((prev) => prev - 1)
        setTimeout(() => setIsAnimating(false), 500)
    }

    const handleDotClick = (index: number) => {
        if (isAnimating) return
        setIsAnimating(true)
        setCurrentIndex(index)
        setTimeout(() => setIsAnimating(false), 300)
    }

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStart(e.targetTouches[0].clientX)
        e.stopPropagation()
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!touchStart) return
        const currentTouch = e.targetTouches[0].clientX
        const diff = Math.abs(currentTouch - touchStart)

        if (diff > 10) {
            e.preventDefault()
        }

        setTouchEnd(currentTouch)
        e.stopPropagation()
    }

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation()
        if (!touchStart || !touchEnd) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > 50
        const isRightSwipe = distance < -50

        if (isLeftSwipe || isRightSwipe) {
            e.preventDefault()
            if (isLeftSwipe) {
                handleNext()
            } else if (isRightSwipe) {
                handlePrev()
            }
        }

        setTouchStart(null)
        setTouchEnd(null)
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if ('ontouchstart' in window) return

        e.preventDefault()
        setMouseStart(e.clientX)
        setIsDragging(true)
        setDragOffset(0)
        setHasDragged(false)
    }

    const handleMouseUp = () => {
        if (!isDragging) {
            return
        }

        setIsDragging(false)

        const isLeftDrag = dragOffset < -50
        const isRightDrag = dragOffset > 50

        if (isLeftDrag && currentIndex + visibleItems < blogItems.length) {
            handleNext()
        } else if (isRightDrag && currentIndex > 0) {
            handlePrev()
        }

        setDragOffset(0)
        setMouseStart(null)
    }

    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging || !mouseStart) return
            e.preventDefault()
            const currentOffset = e.clientX - mouseStart
            setDragOffset(currentOffset)
            if (Math.abs(currentOffset) > 5) {
                setHasDragged(true)
            }
        }

        const handleGlobalMouseUp = () => {
            if (isDragging) {
                handleMouseUp()
            }
        }

        if (isDragging) {
            document.addEventListener("mousemove", handleGlobalMouseMove)
            document.addEventListener("mouseup", handleGlobalMouseUp)
            document.body.style.userSelect = "none"
        }

        return () => {
            document.removeEventListener("mousemove", handleGlobalMouseMove)
            document.removeEventListener("mouseup", handleGlobalMouseUp)
            document.body.style.userSelect = ""
        }
    }, [isDragging, mouseStart, currentIndex, visibleItems, blogItems.length, handleMouseUp])

    return (
        <section className="w-full bg-white flex justify-end overflow-hidden py-16 md:py-24">
            <section className="w-full max-w-[1896px] py-0 m-0 pl-4 md:pl-8 lg:pl-12">
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-6 text-black" style={{ fontFamily: 'AvertaPe Black' }}>
                        <span className="text-[#2b2b2b]">LATEST</span>
                        <span className="text-black"> INSIGHTS</span>
                    </h2>
                    <p className="text-gray-600 max-w-3xl mx-auto px-4 text-lg leading-relaxed">Discover our latest articles, insights, and stories that matter. Stay informed with our expert perspectives on industry trends and innovations.</p>
                </motion.section>

                {isDesktop ? (
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8 lg:px-12">
                        {blogItems.slice(0, 3).map((item) => (
                            <motion.section
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="group"
                            >
                                <Link href={item.link}>
                                    <section className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                        <section className="relative w-full aspect-[4/3] overflow-hidden">
                                            <Image
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.title}
                                                fill
                                                unoptimized
                                                sizes="(max-width: 1024px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />

                                            <section className="absolute top-4 left-4">
                                                <span className="bg-[#2b2b2b] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
                                                    {item.category}
                                                </span>
                                            </section>
                                        </section>

                                        <section className="p-6">
                                            <section className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                                                <span>{item.author}</span>
                                                <span>•</span>
                                                <span>{item.date}</span>
                                                <span>•</span>
                                                <span>{item.readTime}</span>
                                            </section>

                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#2b2b2b] transition-colors duration-300">
                                                {item.title}
                                            </h3>

                                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                                {item.description}
                                            </p>

                                            <section className="flex items-center text-[#2b2b2b] font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                                                <span>Read More</span>
                                                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                                            </section>
                                        </section>
                                    </section>
                                </Link>
                            </motion.section>
                        ))}
                    </section>
                ) : (
                    <section
                        className="relative"
                        ref={carouselRef}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{ touchAction: 'pan-y' }}
                    >
                        <section className="overflow-hidden">
                            <motion.section
                                className="flex gap-3 sm:gap-4 md:gap-5 cursor-grab active:cursor-grabbing"
                                animate={{
                                    x: -currentIndex * scrollAmount + (typeof window !== 'undefined' && 'ontouchstart' in window ? 0 : dragOffset),
                                }}
                                transition={isDragging ? { duration: 0, type: "tween" } : { type: "spring", stiffness: 300, damping: 30 }}
                                onMouseDown={handleMouseDown}
                                style={{ cursor: isDragging ? "grabbing" : "grab" }}
                            >
                                {blogItems.slice(0, 3).map((item) => (
                                    <section
                                        key={item.id}
                                        className="group flex-shrink-0"
                                        style={{ userSelect: "none" }}
                                        onMouseUp={handleMouseUp}
                                        onContextMenu={(e) => hasDragged && e.preventDefault()}
                                    >
                                        <Link
                                            href={item.link}
                                            onClick={(e) => {
                                                if (hasDragged) {
                                                    e.preventDefault()
                                                }
                                            }}
                                            draggable="false"
                                        >
                                            <section className="bg-white shadow-md overflow-hidden w-[270px] sm:w-[270px] md:w-[320px]">
                                                <section className="relative w-full aspect-[4/3] overflow-hidden">
                                                    <Image
                                                        src={item.image || "/placeholder.svg"}
                                                        alt={item.title}
                                                        fill
                                                        unoptimized
                                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                        className="object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none select-none"
                                                        draggable={false}
                                                        onDragStart={(e) => e.preventDefault()}
                                                    />

                                                    <section className="absolute top-4 left-4">
                                                        <span className="bg-[#2b2b2b] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                                            {item.category}
                                                        </span>
                                                    </section>
                                                </section>

                                                <section className="p-4 bg-white">
                                                    <section className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                                                        <span>{item.author}</span>
                                                        <span>•</span>
                                                        <span>{item.date}</span>
                                                    </section>

                                                    <section className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300 mb-3">
                                                        <h3
                                                            className="text-black text-base md:text-lg font-bold text-left transition-all duration-500 line-clamp-2 group-hover:text-[#2b2b2b]"
                                                            style={{ fontFamily: "AvertaPe" }}
                                                        >
                                                            {item.title}
                                                        </h3>
                                                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-[#2b2b2b] opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 flex-shrink-0" />
                                                    </section>

                                                    <p className="text-gray-600 text-sm md:text-base line-clamp-3">
                                                        {item.description}
                                                    </p>
                                                </section>
                                            </section>
                                        </Link>
                                    </section>
                                ))}
                            </motion.section>
                        </section>
                    </section>
                )}

                <section className="text-center mt-12 md:mt-16">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-bold text-lg hover:bg-[#2b2b2b] transition-colors duration-300"
                    >
                        VIEW ALL ARTICLES
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </section>
            </section>
        </section>
    )
}

export default BlogsShowcase