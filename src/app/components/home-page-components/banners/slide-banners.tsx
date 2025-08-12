"use client"

import { useEffect, useRef, useState } from "react"
import { SlideBannerProps } from "./types"
import { AnimatedBackground } from "./animated-background"
import { MobileBannerContent } from "./mobile-banner-content"
import { DesktopBannerContent } from "./desktop-banner-content"
import { LoadingBanner } from "./loading-banner"

export default function SlideBanners({
    heroImages = [
        { src: "/images/hero-banner-2.webp", alt: "Hero banner showcasing fine jackets collection" },
        { src: "/images/banner.webp", alt: "Banner featuring premium leather jackets" }
    ],
    interval = 5000,
    className = ""
}: SlideBannerProps) {
    const bannerRef = useRef(null)
    const [isMounted, setIsMounted] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
        setIsMounted(true)

        const existingBanners = document.querySelectorAll(".holiday-sale-banner")
        if (existingBanners.length > 1) {
            if (bannerRef.current) {
                (bannerRef.current as HTMLElement).remove()
            }
        }

        const preloadImages = () => {
            heroImages.forEach(image => {
                const link = document.createElement('link')
                link.rel = 'preload'
                link.as = 'image'
                link.href = image.src
                link.type = 'image/webp'
                document.head.appendChild(link)
            })
        }

        preloadImages()

        const imageInterval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
        }, interval)

        return () => {
            clearInterval(imageInterval)
        }
    }, [heroImages.length, interval])

    if (!isMounted) {
        return <LoadingBanner heroImages={heroImages} currentImageIndex={currentImageIndex} />
    }

    return (
        <>
            <section
                ref={bannerRef}
                id="holiday-sale-banner-mobile"
                className={`md:hidden w-full text-white overflow-hidden holiday-sale-banner relative transform-gpu z-5 ${className}`}
            >
                <AnimatedBackground images={heroImages} currentIndex={currentImageIndex} />
                <section className="absolute inset-0 bg-black/20"></section>
                <MobileBannerContent />
            </section>

            <section
                className={`hidden md:block w-full text-white overflow-hidden holiday-sale-banner relative will-change-transform z-5 ${className}`}
            >
                <AnimatedBackground images={heroImages} currentIndex={currentImageIndex} />
                <section className="absolute inset-0"></section>
                <DesktopBannerContent />
            </section>
        </>
    )
}