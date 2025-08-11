"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { avertaBold, avertaDefault } from "@/src/lib/fonts"

export default function WelcomeAccordionSection() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [readMoreExpanded, setReadMoreExpanded] = useState(false)

    const [accordions, setAccordions] = useState({
        expensive: false,
        bestLeather: false,
        rightStyle: false,
        colors: false,
    })

    const toggleAccordion = (key: string) => {
        setAccordions((prev) => ({
            ...prev,
            [key]: !(prev as any)[key],
        }))
    }

    const toggleMainAccordion = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setIsExpanded(!isExpanded)
        setTimeout(() => {
            setIsAnimating(false)
        }, 700)
    }

    return (
        <section className="w-full pt-4 sm:pt-5 lg:pt-8 px-3 sm:px-4 lg:px-6">
            <section className="max-w-7xl mx-auto">
                <section className="text-center mb-4 sm:mb-6">

                    <h2 className={`${avertaBold.className} font-bold text-2xl sm:text-3xl md:text-4xl text-[#2b2b2b] mb-3 sm:mb-4 leading-tight `}>
                        WELCOME TO FINEYST
                    </h2>
                    <p className={`${avertaDefault.className} text-sm sm:text-base lg:text-lg text-gray-700 max-w-3xl mx-auto mb-3 sm:mb-4 px-2 sm:px-0`}>
                        Your Destination for Timeless, Custom, and Everyday Leather Jackets
                    </p>

                    <section className="flex justify-center mb-4 sm:mb-6">
                        <button
                            onClick={toggleMainAccordion}
                            className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-all duration-300 focus:outline-none active:scale-95"
                            aria-expanded={isExpanded}
                            aria-controls="accordion-content"
                        >
                            <ChevronDown
                                className={`w-6 h-5 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-500 ease-in-out ${isExpanded ? "rotate-180" : ""
                                    }`}
                                aria-hidden="true"
                            />
                        </button>
                    </section>
                </section>

                <section
                    id="accordion-content"
                    className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    style={{
                        maxHeight: isExpanded ? "none" : "0px",
                    }}
                    aria-hidden={!isExpanded}
                >
                    <section className=" rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
                        <section className="max-w-4xl mx-auto">
                            <section className="text-center mb-8 sm:mb-10">
                                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-0 px-2 sm:px-0">
                                    At FINEYST, we craft authentic leather jackets with real cowhide, lambskin, goatskin, and suede—built for durability, comfort, and lasting style.
                                    {!readMoreExpanded && (
                                        <button
                                            onClick={() => setReadMoreExpanded(true)}
                                            className="ml-1 text-[#b01e23] font-medium underline hover:opacity-80 transition"
                                        >
                                            Read more
                                        </button>
                                    )}
                                </p>

                                <section className={`transition-all duration-500 ${readMoreExpanded ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 overflow-hidden opacity-0"} px-2 sm:px-0`}>
                                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
                                        Explore biker, bomber, custom, cropped, and trench styles in men's, women's, and unisex fits. Choose from classic black, deep brown, or standout shades like burgundy, olive, and distressed finishes.
                                    </p>
                                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8">
                                        Each jacket is hand-finished to wear well and age even better.
                                    </p>
                                </section>
                            </section>

                            <section className="mb-8 sm:mb-10">
                                <h3 className="text-base sm:text-lg text-black mb-4 sm:mb-6 text-center px-2 sm:px-0">
                                    Things to Know About Leather Jackets
                                </h3>

                                <section className="space-y-3 sm:space-y-4">
                                    <section className="rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleAccordion("expensive")}
                                            className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none active:bg-gray-300"
                                            aria-expanded={accordions.expensive}
                                        >
                                            <section className="flex items-center justify-between">
                                                <h4 className="text-sm sm:text-base text-gray-800 pr-2">Why Are Leather Jackets Expensive?</h4>
                                                <ChevronDown
                                                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${accordions.expensive ? "rotate-180" : ""}`}
                                                />
                                            </section>
                                        </button>
                                        <section
                                            className={`overflow-hidden transition-all duration-300 ${accordions.expensive ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
                                        >
                                            <section className="px-4 sm:px-6 py-3 sm:py-4">
                                                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                                                    A real leather jacket is more than a garment — it's an investment. Here's why prices vary:
                                                </p>
                                                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>High-Quality Leather:</strong> Full-grain cowhide and lambskin are premium hides
                                                            that last for years, age beautifully, and offer unmatched strength and texture.
                                                        </section>
                                                    </li>
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Skilled Craftsmanship:</strong> Our jackets are handmade by expert artisans using
                                                            traditional methods — precision cutting, reinforced stitching, and detailed finishing.
                                                        </section>
                                                    </li>
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Time-Intensive Production:</strong> From ethical sourcing to tanning to
                                                            construction, each jacket takes time — especially for complex or custom pieces.
                                                        </section>
                                                    </li>
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Hardware & Lining Quality:</strong> We only use durable zippers, breathable
                                                            linings, and solid inner structure — because longevity matters.
                                                        </section>
                                                    </li>
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Brand Transparency:</strong> Unlike fast fashion, we don't cut corners — FINEYST
                                                            prioritizes real leather, ethical labor, and transparent practices.
                                                        </section>
                                                    </li>
                                                </ul>
                                            </section>
                                        </section>
                                    </section>

                                    <section className="rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleAccordion("bestLeather")}
                                            className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none active:bg-gray-300"
                                            aria-expanded={accordions.bestLeather}
                                        >
                                            <section className="flex items-center justify-between">
                                                <h4 className="text-sm sm:text-base text-gray-800 pr-2">What's the Best Leather for Jackets?</h4>
                                                <ChevronDown
                                                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${accordions.bestLeather ? "rotate-180" : ""}`}
                                                />
                                            </section>
                                        </button>
                                        <section
                                            className={`overflow-hidden transition-all duration-300 ${accordions.bestLeather ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
                                        >
                                            <section className="px-4 sm:px-6 py-3 sm:py-4">
                                                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">It depends on the fit, feel, and use case:</p>
                                                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Cowhide:</strong> Rugged, weather-resistant, ideal for biker and bomber jackets.
                                                        </section>
                                                    </li>
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Lambskin:</strong> Lightweight, buttery soft, best for fitted and everyday wear.
                                                        </section>
                                                    </li>
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Goatskin:</strong> Durable and flexible with a pebbled finish.
                                                        </section>
                                                    </li>
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Suede:</strong> Smooth, matte texture for streetwear or vintage aesthetics.
                                                        </section>
                                                    </li>
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Distressed & Washed Leathers:</strong> Adds character and edge with worn-in looks.
                                                        </section>
                                                    </li>
                                                </ul>
                                                <p className="text-[#b01e23] font-semibold mt-3 sm:mt-4 text-sm sm:text-base">
                                                    At FINEYST, we use only full-grain hides — no PU or bonded leather. Every jacket is made to
                                                    endure.
                                                </p>
                                            </section>
                                        </section>
                                    </section>

                                    <section className="rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleAccordion("rightStyle")}
                                            className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none active:bg-gray-300"
                                            aria-expanded={accordions.rightStyle}
                                        >
                                            <section className="flex items-center justify-between">
                                                <h4 className="text-sm sm:text-base text-gray-800 pr-2">What Style Is Right for You?</h4>
                                                <ChevronDown
                                                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${accordions.rightStyle ? "rotate-180" : ""}`}
                                                />
                                            </section>
                                        </button>
                                        <section
                                            className={`overflow-hidden transition-all duration-300 ${accordions.rightStyle ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
                                        >
                                            <section className="px-4 sm:px-6 py-3 sm:py-4">
                                                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">Our range covers both classic and modern looks:</p>
                                                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Biker Jackets:</strong> Asymmetrical zip, attitude built in
                                                        </section>
                                                    </li>
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Bomber Jackets:</strong> Heritage aviation meets everyday comfort
                                                        </section>
                                                    </li>
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Racer Jackets:</strong> Minimalist, close-cut, versatile
                                                        </section>
                                                    </li>
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Trench & Long Coats:</strong> Full-coverage, structured silhouettes
                                                        </section>
                                                    </li>
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Cropped, Oversized, Custom:</strong> Fashion-forward and personalized
                                                        </section>
                                                    </li>
                                                </ul>
                                                <p className="text-sm sm:text-base text-gray-700 mt-3 sm:mt-4">
                                                    We make jackets for men, women, and all body types — because leather belongs to everyone.
                                                </p>
                                            </section>
                                        </section>
                                    </section>

                                    <section className="rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleAccordion("colors")}
                                            className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none active:bg-gray-300"
                                            aria-expanded={accordions.colors}
                                        >
                                            <section className="flex items-center justify-between">
                                                <h4 className="text-sm sm:text-base text-gray-800 pr-2">Popular Colors We Offer</h4>
                                                <ChevronDown
                                                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${accordions.colors ? "rotate-180" : ""}`}
                                                />
                                            </section>
                                        </button>
                                        <section
                                            className={`overflow-hidden transition-all duration-300 ${accordions.colors ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}
                                        >
                                            <section className="px-4 sm:px-6 py-3 sm:py-4">
                                                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Black:</strong> Always in, forever iconic
                                                        </section>
                                                    </li>
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Brown & Tan:</strong> Timeless and rugged
                                                        </section>
                                                    </li>
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Burgundy / Red / Olive:</strong> For standout personalities
                                                        </section>
                                                    </li>
                                                    <li className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                                                        <section>
                                                            <strong>Two-tone / Distressed:</strong> Vintage feel, modern attitude
                                                        </section>
                                                    </li>
                                                </ul>
                                            </section>
                                        </section>
                                    </section>
                                </section>
                            </section>
                        </section>
                    </section>
                </section>
            </section>
        </section>
    )
}