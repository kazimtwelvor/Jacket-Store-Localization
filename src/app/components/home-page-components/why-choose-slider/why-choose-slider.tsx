
"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { avertaBlack } from "@/src/lib/fonts"

const slides = [
    {
        id: 1,
        title: "UNMATCHED CRAFTSMANSHIP",
        description:
            "Hours of artisan detail go into every jacket. From reinforced stitching to premium hardware, we build jackets that stand the test of time.",
        features: [
            "Reinforced stitching techniques",
            "Premium YKK zippers",
            "Quality lining materials",
            "Artisan-level attention to detail",
        ],
        imageUrl: "https://jacket.us.com/uploads/2025/craftmanship_banner_2.webp",
    },
    {
        id: 3,
        title: "PREMIUM MATERIALS",
        description:
            "We don't mass-produce. We craft. Every FINEYST jacket starts with ethically sourced full-grain leather, precision cuts, and hours of artisan detail.",
        features: [
            "Ethically sourced full-grain leather",
            "Premium lambskin and suede options",
            "Distressed finishes for authentic look",
            "Quality tested for durability",
        ],
        imageUrl: "/images/option_1.webp",
    },
    {
        id: 2,
        title: "TAILORED FIT",
        description:
            "Whether you're buying a ready-to-wear bomber or designing a custom jacket from scratch, you're investing in precision-crafted fit.",
        features: [
            "Standard sizes available",
            "Made-to-measure options",
            "Perfect fit guarantee",
            "Custom sizing consultations",
        ],
        imageUrl: "https://jacket.us.com/uploads/2025/Tailored_fit_section_1.webp",
    },
    {
        id: 4,
        title: "USA FULFILLMENT",
        description:
            "Fast, reliable shipping with hassle-free returns. We stand behind every jacket we make with comprehensive customer support.",
        features: [
            "Free shipping across USA",
            "24-48 hour processing",
            "14-day easy returns",
            "Dedicated customer support",
        ],
        imageUrl: "/images/usa_fulfillment_banner.webp",
    },
]

export default function WhyChooseSlider() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setIsAutoPlaying(false)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        setIsAutoPlaying(false)
    }

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
        setIsAutoPlaying(false)
    }

    return (
        <section className="py-12 bg-black text-white relative">
            <div className="absolute inset-0 z-0 hidden md:block">
                <img
                    src={slides[currentSlide].imageUrl}
                    alt={slides[currentSlide].title}
                    className="w-full h-full object-contain object-right transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="absolute inset-0 z-10 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2b2b2b]/20 to-transparent"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.05%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
            </div>

            <div className="relative w-full z-20">
                <button
                    onClick={prevSlide}
                    className="absolute left-5 md:top-1/2 top-[68%] -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-none w-9 h-9 grid place-items-center transition-all duration-300 group z-30"
                >
                    <ChevronLeft className="w-5 h-5 text-white group-hover:text-[#2b2b2b]" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-6 md:top-1/2 top-[68%] -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-none w-9 h-9 grid place-items-center transition-all duration-300 group z-30"
                >
                    <ChevronRight className="w-5 h-5 text-white group-hover:text-[#2b2b2b]" />
                </button>

                <div className="relative">
                    <div className="min-h-[500px] flex items-center">
                        <div className="container mx-auto px-4">
                            <div className="md:hidden space-y-6">
                                <div className="text-center space-y-4 px-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <h2 className={`text-white font-bold text-2xl sm:text-3xl leading-tight text-center ${avertaBlack.className}`}>
                                            {slides[currentSlide].title}
                                        </h2>
                                    </div>

                                    <p className="text-gray-300 leading-relaxed text-center max-w-lg mx-auto">{slides[currentSlide].description}</p>
                                </div>

                                <div className="w-full h-64 sm:h-80 bg-gray-800 overflow-hidden">
                                    <img
                                        src={slides[currentSlide].imageUrl}
                                        alt={slides[currentSlide].title}
                                        className="w-full h-full object-cover object-right"
                                    />
                                </div>

                                <div className="space-y-2 pt-2 hidden">
                                    <h4 className={`text-xl font-semibold text-white ${avertaBlack.className}`}>Key Features:</h4>
                                    <div className="space-y-2">
                                        {slides[currentSlide].features.map((feature, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-[#2b2b2b] rounded-full flex-shrink-0"></div>
                                                <span className="text-gray-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:grid md:grid-cols-2 gap-8 items-center">
                                <div className="text-center md:text-left space-y-4">
                                    <div className="flex items-center gap-3 justify-center md:justify-start">
                                        <h2 className={`text-white font-bold text-[2.5rem] leading-none ${avertaBlack.className}`}>
                                            {slides[currentSlide].title}
                                        </h2>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed max-w-2xl">{slides[currentSlide].description}</p>
                                    <div className="space-y-2 pt-2 hidden xl:block">
                                        <h4 className={`text-xl font-semibold text-white ${avertaBlack.className}`}>KEY FEATURES:</h4>
                                        <div className="space-y-2">
                                            {slides[currentSlide].features.map((feature, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 bg-[#2b2b2b] rounded-full flex-shrink-0"></div>
                                                    <span className="text-gray-300">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:flex justify-center space-x-2 mt-8 relative z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white w-4" : "bg-gray-600 hover:bg-gray-500"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}