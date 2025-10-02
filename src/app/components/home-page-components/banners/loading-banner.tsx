"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { LoadingBannerProps } from "./types"

export const LoadingBanner = ({ heroImages, currentImageIndex }: LoadingBannerProps) => {
    return (
        <section
            className="w-full text-white overflow-hidden holiday-sale-banner relative will-change-transform z-5"
            style={{ backgroundColor: "#efefef" }}
        >
            <div className="absolute inset-0 overflow-hidden bg-[#000000]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url('${heroImages[currentImageIndex].src}')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: 1,
                            scale: 1
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{
                            duration: 1.5,
                            ease: "linear"
                        }}
                        role="img"
                        aria-label={heroImages[currentImageIndex].alt}
                    />
                </AnimatePresence>
            </div>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="md:hidden py-24 sm:py-28 text-center flex flex-col items-center justify-center mx-auto">
                    <h1 className="text-[48px] sm:text-[54px] font-bold mb-5 leading-tight tracking-tight text-center w-full">
                        FINEYST SALE
                    </h1>
                    <p className="text-sm sm:text-base px-6 mb-10 mx-auto text-center w-full" style={{ fontFamily: 'var(--font-averta-default)' }}>
                        UP TO <span className="font-bold">50%</span> OFF + CODE: STREET <span className="font-black">15</span>
                    </p>
                    <div className="flex justify-center gap-5 w-full">
                        <Link href="/us/shop" aria-label="Shop men's collection">
                            <span className="bg-white text-[#ffffffff] font-bold py-3 px-8 text-sm uppercase block">SHOP MEN</span>
                        </Link>
                        <Link href="/us/shop" aria-label="Shop women's collection">
                            <span className="bg-white text-[#2b2b2b] font-bold py-3 px-8 text-sm uppercase block">
                                SHOP WOMEN
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="hidden md:block py-24 sm:py-32 md:py-40 lg:py-48 text-center relative">
                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 tracking-tight" style={{ fontFamily: 'var(--font-averta-black)' }}>
                            FINEYST SALE
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 md:mb-10 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-averta-default)' }}>
                            UP TO <span className="font-black">50%</span> OFF + CODE: STREET<span className="font-black">15</span>
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5">
                            <Link href="/us/shop" aria-label="Shop men's collection">
                                <span className="bg-white text-black font-bold py-4 px-8 md:px-10 text-sm md:text-base uppercase w-full sm:w-auto min-w-[180px] inline-block">
                                    Shop Men
                                </span>
                            </Link>
                            <Link href="/us/shop" aria-label="Shop women's collection">
                                <span className="bg-white text-black font-bold py-4 px-8 md:px-10 text-sm md:text-base uppercase w-full sm:w-auto min-w-[180px] inline-block">
                                    Shop Women
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
