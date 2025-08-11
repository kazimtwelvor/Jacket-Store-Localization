"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import ResponsiveContainer from "@/src/app/ui/responsive-container"

export default function SlideBanners() {
    const bannerRef = useRef(null)
    const [isMounted, setIsMounted] = useState(false)
    const [imagePath, setImagePath] = useState("/images/banner.png")
    const [imageError, setImageError] = useState(false)

    const possiblePaths = [
        "/images/banner.webp",
        "/images/banner.png",
        "/holiday-banner-background.webp",
        "/holiday-banner-background.jpg",
        "/HERO-BANNER.webp",
        "/HERO-BANNER.jpg",
        "/hero-banner.webp",
        "/hero-banner.jpg",
    ]

    useEffect(() => {
        setIsMounted(true)

        const existingBanners = document.querySelectorAll(".holiday-sale-banner")
        if (existingBanners.length > 1) {
            if (bannerRef.current) {
                (bannerRef.current as HTMLElement).remove()
            }
        }

        const preloadImage = () => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = '/images/banner.webp';
            link.type = 'image/webp';
            document.head.appendChild(link);

            const linkMobile = document.createElement('link');
            linkMobile.rel = 'preload';
            linkMobile.as = 'image';
            linkMobile.href = '/images/banner-mobile.webp';
            linkMobile.type = 'image/webp';
            document.head.appendChild(linkMobile);
        };

        preloadImage();

        const checkImage = (path: string) => {
            return new Promise((resolve) => {
                const img = new Image()
                img.onload = () => resolve(true)
                img.onerror = () => resolve(false)
                img.src = path
            })
        }

        const findWorkingPath = async () => {
            for (const path of possiblePaths) {
                const exists = await checkImage(path)
                if (exists) {
                    setImagePath(path)
                    setImageError(false)
                    return
                }
            }
            setImageError(true)
        }

        findWorkingPath()
    }, [])

    const backgroundStyle = imageError
        ? { backgroundColor: "#ffffffff", zIndex: 5 }
        : {
            backgroundImage: `url('/images/banner.webp'), url('/images/banner-small.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 5,
        }

    const mobileBackgroundStyle = {
        backgroundImage: `url('/images/banner.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "90% center",
        backgroundRepeat: "no-repeat",
        zIndex: 5,
    }

    if (!isMounted) {
        return (
            <section
                className="w-full text-white overflow-hidden holiday-sale-banner relative will-change-transform z-5"
                style={{ backgroundColor: "#2b2b2b" }}
            >
                <section className="absolute inset-0 "></section>
                <section className="container mx-auto px-4 relative z-10">
                    <section className="md:hidden py-24 sm:py-28 text-center flex flex-col items-center justify-center mx-auto">
                        <h1 className="text-[48px] sm:text-[54px] font-bold mb-5 leading-tight tracking-tight text-center w-full" >
                            FINEYST SALE
                        </h1>

                        <p className="text-sm sm:text-base px-6 mb-10 mx-auto text-center w-full" style={{ fontFamily: 'var(--font-averta-default)' }}>
                            UP TO <span className="font-bold">50%</span> OFF + CODE: STREET<span className="font-black">15</span>
                        </p>

                        <section className="flex justify-center gap-5 w-full">
                            <Link href="/shop">
                                <span className="bg-white text-[#ffffffff] font-bold py-3 px-8 text-sm uppercase block">SHOP MEN</span>
                            </Link>
                            <Link href="/shop">
                                <span className="bg-white text-[#2b2b2b] font-bold py-3 px-8 text-sm uppercase block">
                                    SHOP WOMEN
                                </span>
                            </Link>
                        </section>
                    </section>

                    <section className="hidden md:block py-24 sm:py-32 md:py-40 lg:py-48 text-center relative">
                        <section className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 tracking-tight" style={{ fontFamily: 'var(--font-averta-black)' }}>
                                FINEYST SALE
                            </h2>

                            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 md:mb-10 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-averta-default)' }}>
                                UP TO <span className="font-black">50%</span> OFF + CODE: STREET<span className="font-black">15</span>
                            </p>

                            <section className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5">
                                <Link href="/sale/men">
                                    <span className="bg-white text-black font-bold py-4 px-8 md:px-10 text-sm md:text-base uppercase w-full sm:w-auto min-w-[180px] inline-block">
                                        Shop Men
                                    </span>
                                </Link>
                                <Link href="/sale/women">
                                    <span className="bg-white text-black font-bold py-4 px-8 md:px-10 text-sm md:text-base uppercase w-full sm:w-auto min-w-[180px] inline-block">
                                        Shop Women
                                    </span>
                                </Link>
                            </section>
                        </section>
                    </section>
                </section>
            </section>
        )
    }

    return (
        <>
            <section
                ref={bannerRef}
                id="holiday-sale-banner-mobile"
                className="md:hidden w-full text-white overflow-hidden holiday-sale-banner relative transform-gpu z-5"
                style={mobileBackgroundStyle}
            >
                <section className="absolute inset-0 bg-black/20"></section>

                <ResponsiveContainer>
                    <section
                        className="py-24 sm:py-28 text-center flex flex-col items-center justify-end mx-auto min-h-[600px] sm:min-h-[720px] relative z-10 transform-gpu pb-16"
                        style={{ width: "100%", maxWidth: "480px" }}
                    >
                        <motion.h1
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0 }}
                            className="text-[36px] sm:text-[48px] font-bold mb-5 leading-tight tracking-tight text-center w-full"
                            style={{ fontFamily: 'var(--font-averta-black)' }}
                        >
                            FINEYST SALE
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0 }}
                            style={{ fontFamily: 'var(--font-averta-default)' }}
                            className="text-sm sm:text-base px-6 mb-10 mx-auto text-center w-full"
                        >
                            UP TO <span className="font-black">50%</span> OFF + CODE: STREET<span className="font-black">15</span>
                        </motion.p>

                        <motion.section
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0 }}
                            className="flex justify-center gap-5 w-full"
                        >
                            <Link href="/shop">
                                <button className=" bg-[#2b2b2b] text-white font-bold py-3 px-8 text-sm uppercase block min-w-[120px]">
                                    SHOP MEN
                                </button>
                            </Link>
                            <Link href="/shop">
                                <button className="bg-[#2b2b2b] text-white font-bold py-3 px-8 text-sm uppercase block min-w-[120px]">
                                    SHOP WOMEN
                                </button>
                            </Link>
                        </motion.section>
                    </section>
                </ResponsiveContainer>
            </section>

            <section
                className="hidden md:block w-full text-white overflow-hidden holiday-sale-banner relative will-change-transform z-5"
                style={backgroundStyle}
            >
                <section className="absolute inset-0"></section>

                <ResponsiveContainer>
                    <section className="py-24 sm:py-32 md:py-40 lg:py-48 text-center relative">
                        <section className="relative z-10">
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6 md:mb-8 tracking-tight"
                                style={{ fontFamily: 'var(--font-averta-bold)' }}
                            >
                                FINEYST SALE
                            </motion.section>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                style={{ fontFamily: 'var(--font-averta-default)' }}
                                className="text-sm sm:text-base md:text-lg text-black lg:text-xl mb-8 md:mb-10 max-w-3xl mx-auto"
                            >
                                UP TO <span className="font-black">50%</span> OFF + CODE: STREET<span className="font-black">15</span>
                            </motion.p>

                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5"
                            >
                                <Link href="/shop">
                                    <button className="relative overflow-hidden bg-[#2b2b2b] text-white font-bold py-4 px-8 md:px-10 text-sm md:text-base uppercase w-full sm:w-auto min-w-[180px] hover:shadow-lg transition-all duration-300 group">
                                        <span className="relative z-10">Shop Men</span>
                                        <section className="absolute inset-0 w-0 bg-[#2b2b2b] transition-all duration-300 group-hover:w-full"></section>
                                    </button>
                                </Link>
                                <Link href="/shop">
                                    <button className="relative overflow-hidden bg-[#2b2b2b] text-white font-bold py-4 px-8 md:px-10 text-sm md:text-base uppercase w-full sm:w-auto min-w-[180px] hover:shadow-lg transition-all duration-300 group">
                                        <span className="relative z-10">Shop Women</span>
                                        <section className="absolute inset-0 w-0 bg-[#2b2b2b] transition-all duration-300 group-hover:w-full"></section>
                                    </button>
                                </Link>
                            </motion.section>
                        </section>
                    </section>
                </ResponsiveContainer>
            </section>
        </>
    )
}