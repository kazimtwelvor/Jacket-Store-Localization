"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

export default function ShippingFAQ() {
  const [isMounted, setIsMounted] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null) // No FAQ open by default

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = [
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a shipping confirmation email with a tracking number and link. You can also track your order by logging into your account and viewing your order history.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to over 180 countries worldwide. International shipping rates and delivery times vary by location. Please note that customers are responsible for any customs fees, import taxes, or duties that may apply.",
    },
    {
      question: "What if my package is lost or damaged?",
      answer:
        "If your package is lost or damaged during transit, please contact our customer service team within 14 days of the expected delivery date. We'll work with the shipping carrier to locate your package or process a replacement shipment.",
    },
    {
      question: "Can I change my shipping address after placing an order?",
      answer:
        "We can only change the shipping address if the order hasn't been processed yet. Please contact our customer service team immediately if you need to update your shipping address. Once an order has been shipped, we cannot redirect it to a different address.",
    },
    {
      question: "Do you offer expedited shipping options?",
      answer:
        "Yes, we offer express shipping options at checkout for customers who need their orders more quickly. Express shipping typically delivers within 2-3 business days for domestic orders, depending on your location.",
    },
  ]

  if (!isMounted) {
    return (
      <section className="py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-black-600 max-w-2xl mx-auto">
            Find answers to common questions about our shipping and delivery process.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border border-black rounded-lg overflow-hidden">
              <button className="w-full px-6 py-4 text-left bg-white flex justify-between items-center">
                <span className="font-medium text-black-900">{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-black" />
              </button>
            </div>
          ))}
        </div>

        {/* Hidden content for SEO */}
        <div className="sr-only" aria-hidden="true">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-black-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-black-600 max-w-2xl mx-auto">
          Find answers to common questions about our shipping and delivery process.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            key={index}
            className="mb-4 border border-black rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left bg-white hover:bg-[#eaeaea] transition-colors duration-200 flex justify-between items-center"
            >
              <span className="font-medium text-black-900">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-black transition-transform duration-300 ${
                  openIndex === index ? "transform rotate-180" : ""
                }`}
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
                  <div className="px-6 py-4 bg-white text-black-600 border-t border-black">{faq.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
