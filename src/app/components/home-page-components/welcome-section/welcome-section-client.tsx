"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { avertaBlack, avertaBold, avertaDefault } from "@/src/lib/fonts"

interface AccordionContent {
    key: string
    title: string
    content: {
        intro?: string
        points: Array<{
            title: string
            description: string
        }>
        closing?: string
    }
}

interface WelcomeContentData {
    title: string
    subtitle: string
    description: string
    readMoreText: string
    closingText: string
    sectionTitle: string
    accordions: AccordionContent[]
}

interface WelcomeAccordionSectionClientProps {
    contentData: WelcomeContentData
}

export default function WelcomeAccordionSectionClient({ contentData }: WelcomeAccordionSectionClientProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [readMoreExpanded, setReadMoreExpanded] = useState(false)

    const [accordions, setAccordions] = useState<Record<string, boolean>>(
        contentData.accordions.reduce((acc, accordion) => {
            acc[accordion.key] = false
            return acc
        }, {} as Record<string, boolean>)
    )

    const toggleAccordion = (key: string) => {
        setAccordions((prev) => ({
            ...prev,
            [key]: !prev[key],
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
        <section className={`${avertaDefault.className} w-full pt-4 sm:pt-5 lg:pt-8 px-3 sm:px-4 lg:px-6`}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-4 sm:mb-6">
                    <h2 className={`${avertaBlack.className} text-2xl sm:text-3xl md:text-5xl text-[#2b2b2b] mb-3 sm:mb-4 leading-tight px-2 sm:px-0`}>
                        {contentData.title}
                    </h2>
                    <p className={`${avertaDefault.className} text-sm sm:text-base lg:text-lg text-gray-700 max-w-3xl mx-auto mb-3 sm:mb-4 px-2 sm:px-0 leading-relaxed`}>
                        {contentData.subtitle}
                    </p>

                    <div className="flex justify-center mb-4 sm:mb-6">
                        <button
                            onClick={toggleMainAccordion}
                            className="flex items-center justify-center p-3 sm:p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-all duration-300 focus:outline-none active:scale-95 touch-manipulation"
                            aria-expanded={isExpanded}
                            aria-controls="accordion-content"
                        >
                            <ChevronDown
                                className={`w-6 h-6 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-500 ease-in-out ${isExpanded ? "rotate-180" : ""
                                    }`}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </div>

                <div
                    id="accordion-content"
                    className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    style={{
                        maxHeight: isExpanded ? "none" : "0px",
                    }}
                    aria-hidden={!isExpanded}
                >
                    <div className="rounded-xl shadow-lg p-3 sm:p-6 lg:p-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-0 px-2 sm:px-0">
                                    {contentData.description}
                                    {!readMoreExpanded && (
                                        <button
                                            onClick={() => setReadMoreExpanded(true)}
                                            className="ml-1 text-black underline hover:opacity-80 transition font-bold touch-manipulation"
                                        >
                                            Read more
                                        </button>
                                    )}
                                </p>

                                <div className={`transition-all duration-500 ${readMoreExpanded ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 overflow-hidden opacity-0"} px-2 sm:px-0`}>
                                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
                                        {contentData.readMoreText}
                                    </p>
                                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8">
                                        {contentData.closingText}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6 sm:mb-8 lg:mb-10">
                                <h3 className={`${avertaBlack.className} text-lg sm:text-xl text-black mb-4 sm:mb-6 text-center px-2 sm:px-0`}>
                                    {contentData.sectionTitle}
                                </h3>

                                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                                    {contentData.accordions.map((accordion) => (
                                        <div key={accordion.key} className="rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => toggleAccordion(accordion.key)}
                                                className="w-full px-3 sm:px-6 py-4 sm:py-4 text-left bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none active:bg-gray-300 touch-manipulation min-h-[60px] sm:min-h-0 flex items-center"
                                                aria-expanded={accordions[accordion.key]}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <h4 className={`${avertaBlack.className} text-base sm:text-lg text-gray-800 pr-2 leading-tight`}>
                                                        {accordion.title}
                                                    </h4>
                                                    <ChevronDown
                                                        className={`w-5 h-5 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${accordions[accordion.key] ? "rotate-180" : ""}`}
                                                    />
                                                </div>
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${accordions[accordion.key] ? "max-h-[800px] sm:max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
                                            >
                                                <div className="px-3 sm:px-6 py-3 sm:py-4">
                                                    {accordion.content.intro && (
                                                        <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-3 sm:mb-4">
                                                            {accordion.content.intro}
                                                        </p>
                                                    )}
                                                    <ul className="space-y-3 sm:space-y-3 text-sm sm:text-base text-gray-600">
                                                        {accordion.content.points.map((point, index) => (
                                                            <li key={index} className="flex items-start gap-2 sm:gap-3">
                                                                <span className="text-[#2b2b2b] font-bold flex-shrink-0 mt-0.5">•</span>
                                                                <div>
                                                                    <strong className={`${avertaBold.className}`}>{point.title}</strong> {point.description}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    {accordion.content.closing && (
                                                        <p className="text-[#2b2b2b] font-semibold mt-3 sm:mt-4 text-sm sm:text-base">
                                                            {accordion.content.closing}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
