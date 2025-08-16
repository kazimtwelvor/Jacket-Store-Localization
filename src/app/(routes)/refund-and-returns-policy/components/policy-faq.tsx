"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"

export default function PolicyFAQ() {
  const [isMounted, setIsMounted] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = [
    {
      question: "How long do I have to return an item?",
      answer:
        "You have 30 days from the date of delivery to initiate a return. After this period, returns may be accepted as store credit at our discretion.",
    },
    {
      question: "Do I have to pay for return shipping?",
      answer:
        "For standard returns, customers are responsible for return shipping costs. However, if you received a damaged or incorrect item, we'll provide a prepaid return label.",
    },
    {
      question: "How long will it take to receive my refund?",
      answer:
        "Once we receive and inspect your return, refunds are typically processed within 1-2 business days. It may take an additional 5-7 business days for the refund to appear on your statement, depending on your financial institution.",
    },
    {
      question: "Can I exchange an item instead of returning it?",
      answer:
        "Yes, you can request an exchange for a different size or color of the same item. For different items, we recommend returning the original purchase and placing a new order.",
    },
    {
      question: "What if my item arrives damaged?",
      answer:
        "Please contact our customer service team within 48 hours of delivery with photos of the damaged item. We'll arrange for a return or replacement at no cost to you.",
    },
    {
      question: "Can I return a gift?",
      answer:
        "Yes, gift returns are processed as store credit. You'll need the order number or gift receipt to initiate the return.",
    },
  ]

  // Non-JavaScript fallback
  if (!isMounted) {
    return (
      <div className="bg-white rounded-xl border border-[#2b2b2b] shadow-sm overflow-hidden">
        <div className="bg-[#2b2b2b] p-4 border-b border-[#2b2b2b] flex items-center gap-2">
          <span className="h-5 w-5 text-[#2b2b2b]">❓</span>
          <h3 className="font-semibold text-[#2b2b2b]">Frequently Asked Questions</h3>
        </div>

        <div className="divide-y divide-[#2b2b2b]">
          {faqs.map((faq, index) => (
            <div key={index} className="overflow-hidden">
              <div className="w-full px-4 py-3 flex justify-between items-center text-left">
                <span className="font-medium text-[#333333]">{faq.question}</span>
              </div>
              <div className="px-4 pb-4 text-sm text-[#666666]">{faq.answer}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Enhanced version with JavaScript
  return (
    <motion.div
      className="bg-white rounded-xl border border-[#2b2b2b] shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="bg-[#2b2b2b] p-4 border-b border-[#2b2b2b] flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-[#2b2b2b]" />
        <h3 className="font-semibold text-[#2b2b2b]">Frequently Asked Questions</h3>
      </div>

      <div className="divide-y divide-[#2b2b2b]">
        {faqs.map((faq, index) => (
          <div key={index} className="overflow-hidden">
            <button
              onClick={() => toggleFaq(index)}
              className="w-full px-4 py-3 flex justify-between items-center hover:bg-[#2b2b2b]/20 transition-colors text-left"
            >
              <span className="font-medium text-[#333333]">{faq.question}</span>
              <ChevronDown
                className={`h-5 w-5 text-[#2b2b2b] transition-transform ${openIndex === index ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-sm text-[#666666]">{faq.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
