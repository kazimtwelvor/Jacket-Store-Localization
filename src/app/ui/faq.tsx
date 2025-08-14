"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { avertaBlack, avertaBold } from "@/src/lib/fonts"

interface FAQItem {
    question: string
    answer: string
}

interface FAQProps {
    items: FAQItem[]
    title?: string
    className?: string
    containerClassName?: string
    maxColumns?: 1 | 2
}

export default function FAQ({
    items,
    className = "",
    containerClassName = "",
    maxColumns = 2
}: FAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const leftItems = maxColumns === 2 ? items.slice(0, Math.ceil(items.length / 2)) : items
    const rightItems = maxColumns === 2 ? items.slice(Math.ceil(items.length / 2)) : []

    const renderFAQItem = (item: FAQItem, index: number, isOpen: boolean, onToggle: () => void) => (
        <section key={index} className={`relative ${avertaBold.className} bg-transparent`}>
            <section
                className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${isOpen ? "shadow-md" : "hover:shadow-sm"
                    }`}
            >
                <section className="absolute left-0 top-0 bottom-0 w-1 bg-[#EAEAEA] rounded-l-lg" />
                <button
                    className="flex justify-between items-center w-full p-4 pl-5 text-left font-medium"
                    onClick={onToggle}
                >
                    <span>{item.question}</span>
                    <motion.section
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-center justify-center h-6 w-6 rounded-full ${isOpen ? "bg-black text-white" : "bg-[#F6F6F6]"
                            }`}
                    >
                        <ChevronDown className="h-4 w-4" />
                    </motion.section>
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.section
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <section className="px-4 py-5 bg-[#F6F6F6] text-gray-600 border-t border-gray-100 min-h-[80px] flex items-center">
                                <p className="my-2">{item.answer}</p>
                            </section>
                        </motion.section>
                    )}
                </AnimatePresence>
            </section>
        </section>
    )

    return (
        <section className={`py-8 overflow-hidden ${className}`}>
            <section className={`max-w-6xl mx-auto ${containerClassName}`}>
                <section className={`grid grid-cols-1 ${maxColumns === 2 ? 'md:grid-cols-2' : ''} gap-6 md:gap-8`}>
                    <section className="space-y-4">
                        {leftItems.map((item, index) =>
                            renderFAQItem(
                                item,
                                index,
                                openIndex === index,
                                () => toggleFAQ(index)
                            )
                        )}
                    </section>

                    {maxColumns === 2 && rightItems.length > 0 && (
                        <section className="space-y-4">
                            {rightItems.map((item, index) =>
                                renderFAQItem(
                                    item,
                                    index + leftItems.length,
                                    openIndex === index + leftItems.length,
                                    () => toggleFAQ(index + leftItems.length)
                                )
                            )}
                        </section>
                    )}
                </section>
            </section>
        </section>
    )
}
