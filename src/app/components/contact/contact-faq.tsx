"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FAQItem {
  question: string
  answer: string
}

const faqItemsLeft: FAQItem[] = [
  {
    question: "What are your shipping options?",
    answer:
      "We offer standard shipping (3-5 business days), express shipping (1-2 business days), and international shipping (7-14 business days). Free shipping is available on orders over $100.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive a confirmation email with a tracking number. You can also track your order by logging into your account on our website.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Please visit our Returns page for more information.",
  },
]

const faqItemsRight: FAQItem[] = [
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship to most countries worldwide. International shipping typically takes 7-14 business days, and customs fees may apply depending on your location.",
  },
  {
    question: "How can I change or cancel my order?",
    answer:
      "You can request changes or cancellations within 1 hour of placing your order by contacting our customer service team. After this window, we may not be able to modify orders that have entered processing.",
  },
  {
    question: "Do you have a loyalty program?",
    answer:
      "Yes, our Rewards program allows you to earn points on every purchase that can be redeemed for discounts on future orders. You also receive exclusive access to member-only sales.",
  },
]

export default function ContactFAQ() {
  const [openIndexLeft, setOpenIndexLeft] = useState<number | null>(null)
  const [openIndexRight, setOpenIndexRight] = useState<number | null>(null)

  const toggleFAQLeft = (index: number) => {
    setOpenIndexLeft(openIndexLeft === index ? null : index)
  }

  const toggleFAQRight = (index: number) => {
    setOpenIndexRight(openIndexRight === index ? null : index)
  }

  return (
    <section className="py-8 overflow-hidden">
      <section className="max-w-6xl mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <section className="space-y-4">
            {faqItemsLeft.map((item, index) => (
              <section key={`left-${index}`} className="relative">
                <section
                  className={`border rounded-lg overflow-hidden bg-white transition-all duration-300 ${
                    openIndexLeft === index ? "shadow-md" : "hover:shadow-sm"
                  }`}
                >
                  <section className="absolute left-0 top-0 bottom-0 w-1 bg-[#EAEAEA] rounded-l-lg" />
                  <button
                    className="flex justify-between items-center w-full p-4 pl-5 text-left font-medium"
                    onClick={() => toggleFAQLeft(index)}
                  >
                    <span>{item.question}</span>
                    <motion.section
                      animate={{ rotate: openIndexLeft === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center justify-center h-6 w-6 rounded-full ${
                        openIndexLeft === index ? "bg-[#EAEAEA] text-white" : "bg-gray-100"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.section>
                  </button>
                  <AnimatePresence>
                    {openIndexLeft === index && (
                      <motion.section
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <section className="px-4 py-5 text-gray-600 border-t border-gray-100 min-h-[80px] flex items-center">
                          <p className="my-2">{item.answer}</p>
                        </section>
                      </motion.section>
                    )}
                  </AnimatePresence>
                </section>
              </section>
            ))}
          </section>

          <section className="space-y-4">
            {faqItemsRight.map((item, index) => (
              <section key={`right-${index}`} className="relative">
                <section
                  className={`border rounded-lg overflow-hidden bg-white transition-all duration-300 ${
                    openIndexRight === index ? "shadow-md" : "hover:shadow-sm"
                  }`}
                >
                  <section className="absolute left-0 top-0 bottom-0 w-1 bg-[#EAEAEA] rounded-l-lg" />
                  <button
                    className="flex justify-between items-center w-full p-4 pl-5 text-left font-medium"
                    onClick={() => toggleFAQRight(index)}
                  >
                    <span>{item.question}</span>
                    <motion.section
                      animate={{ rotate: openIndexRight === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center justify-center h-6 w-6 rounded-full ${
                        openIndexRight === index ? "bg-[#EAEAEA] text-white" : "bg-gray-100"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.section>
                  </button>
                  <AnimatePresence>
                    {openIndexRight === index && (
                      <motion.section
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <section className="px-4 py-5 text-gray-600 border-t border-gray-100 min-h-[80px] flex items-center">
                          <p className="my-2">{item.answer}</p>
                        </section>
                      </motion.section>
                    )}
                  </AnimatePresence>
                </section>
              </section>
            ))}
          </section>
        </section>
      </section>
    </section>
  )
}
