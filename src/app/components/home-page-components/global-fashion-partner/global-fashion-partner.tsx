"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { avertaBlack } from "@/src/lib/fonts"

const GlobalFashionPartners = () => {
    const partners = [
        { brand: "Forbes", logoUrl: "/images/featured-images/forbes.webp", testimonial: "Leading the luxury outerwear market with exceptional craftsmanship", specialty: "Business & Luxury" },
        { brand: "CNN", logoUrl: "/images/featured-images/CNN.webp", testimonial: "Premium quality jackets that define modern fashion", specialty: "Fashion & Style Coverage" },
        { brand: "New York Times", logoUrl: "/images/featured-images/newyork-times.webp", testimonial: "Setting trends in contemporary jacket design and quality", specialty: "Fashion Editorial" },
        { brand: "Reddit", logoUrl: "/images/featured-images/reddit.webp", testimonial: "Community favorite for quality and authentic fashion discussions", specialty: "Community Reviews" },
        { brand: "Google News", logoUrl: "/images/featured-images/google-news.webp", testimonial: "Breaking news in fashion with innovative jacket collections", specialty: "News & Updates" },
        { brand: "Blogger", logoUrl: "/images/featured-images/blogger.webp", testimonial: "Featured by top fashion bloggers for exceptional style", specialty: "Fashion Blogging" },
        { brand: "Medium", logoUrl: "/images/featured-images/medium.webp", testimonial: "In-depth stories about sustainable fashion and quality craftsmanship", specialty: "Fashion Stories" },
        { brand: "Bloom", logoUrl: "/images/featured-images/bloom.webp", testimonial: "Showcasing the finest in contemporary outerwear design", specialty: "Lifestyle & Fashion" }
    ]

    const [currentPartner, setCurrentPartner] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [hoveredBrand, setHoveredBrand] = useState<number | null>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: 'start', slidesToScroll: 2 },
        [Autoplay({ delay: 4000, stopOnInteraction: false })]
    )


    useEffect(() => {
        if (isAutoPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentPartner((prev) => (prev + 1) % partners.length)
                if (emblaApi) emblaApi.scrollNext()
            }, 4000)
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isAutoPlaying, partners.length, emblaApi])



    return (
        <section className="bg-gradient-to-br from-white to-gray-50 py-12 md:py-16 lg:py-20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5"></div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center mb-6 md:mb-8"
                    style={{ fontFamily: 'AvertaPe' }}
                >
                    <span className={`text-black ${avertaBlack.className}`}>AS FEATURED IN</span>
                </motion.h2>

                <div className="relative mb-6 md:mb-8">
                    <div className="md:hidden">
                        <div className="embla overflow-hidden" ref={emblaRef}>
                            <div className="embla__container flex">
                                {partners.map((partner, index) => (
                                    <div key={index} className="embla__slide flex-[0_0_45%] min-w-0 mr-2">
                                        <div className="flex justify-center">
                                            <img
                                                src={partner.logoUrl}
                                                alt={partner.brand}
                                                width={120}
                                                height={56}
                                                className="h-14 object-contain"
                                                style={{ imageRendering: 'crisp-edges' }}
                                                loading="eager"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none'
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex justify-center items-center space-x-4 md:space-x-6 overflow-hidden">
                        <AnimatePresence mode="wait">
                            {partners.map((partner, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                    className="group cursor-pointer relative"
                                    onMouseEnter={() => setHoveredBrand(index)}
                                    onMouseLeave={() => setHoveredBrand(null)}
                                >
                                    <img
                                        src={partner.logoUrl}
                                        alt={partner.brand}
                                        width={120}
                                        height={64}
                                        className={`h-12 md:h-16 object-contain transition-all duration-500 ${index === currentPartner ? 'scale-110 opacity-100' : ''
                                            }`}
                                        style={{
                                            opacity: index === currentPartner ? 1 : 0.6,
                                            filter: index === currentPartner ? 'brightness(1.1)' : 'none'
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                        }}
                                    />
                                    <AnimatePresence>
                                        {hoveredBrand === index && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-20"
                                            >
                                                {partner.specialty}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="relative hidden md:block">
                    <div className="flex items-center justify-center">
                        <div className="flex-1 text-center relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentPartner}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    className="relative"
                                >

                                    <p className="text-2xl lg:text-3xl font-light text-gray-800 mb-4 leading-relaxed">
                                        "{partners[currentPartner].testimonial}"
                                    </p>
                                    <p className="text-lg md:text-xl text-[#2b2b2b] font-semibold mb-2">
                                        — {partners[currentPartner].brand}
                                    </p>
                                    <p className="text-sm text-gray-500 italic">
                                        {partners[currentPartner].specialty}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex justify-center space-x-2 mt-6">
                                {partners.map((_, index) => (
                                    <motion.button
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentPartner ? 'bg-[#2b2b2b] w-8' : 'bg-gray-300'
                                            }`}
                                        onClick={() => setCurrentPartner(index)}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default GlobalFashionPartners