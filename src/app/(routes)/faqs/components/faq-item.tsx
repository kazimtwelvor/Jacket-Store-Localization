"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp } from "lucide-react"

interface FAQItemProps {
  question: string
  answer: string
  delay?: number
  initiallyOpen?: boolean
}

export default function FAQItem({ question, answer, delay = 0, initiallyOpen = false }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Non-JavaScript fallback
  if (!isMounted) {
    return (
      <div className="relative bg-[#eaeaea] rounded-lg shadow-sm border border-[#2b2b2b] overflow-hidden">
        <div className="flex justify-between items-center w-full p-5 text-left font-medium">
          <span className="text-base font-medium text-gray-900">{question}</span>
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-black-500 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="p-5 pt-0 text-black">
            <p className="py-4">{answer}</p>
          </div>
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black-500"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative bg-white rounded-lg shadow-sm border border-black overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-5 text-left focus:outline-none"
      >
        <span className="text-base font-medium text-gray-900">{question}</span>
        <motion.div
          animate={{ backgroundColor: isOpen ? "#2b2b2b" : "#f6f6ff6" }}
          className="flex items-center justify-center h-8 w-8 rounded-full text-black"
        >
          <ChevronUp
            className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "text-white" : "text-black"}`}
            style={{ transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }}
          />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 text-gray-600">
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="py-4"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-black-500"></div>
    </motion.div>
  )
}
