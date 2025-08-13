"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

export default function PolicyEligibility() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const eligibleItems = [
    "Unworn clothing with original tags attached",
    "Unworn shoes in original box",
    "Accessories in original packaging",
    "Items purchased at full price or with discounts",
    "Items purchased within the last 30 days",
  ]

  const ineligibleItems = [
    "Worn, washed, or damaged items",
    "Items without original tags or packaging",
    "Intimate apparel and swimwear",
    "Final sale items marked as non-returnable",
    "Gift cards and promotional items",
  ]

  // Non-JavaScript fallback
  if (!isMounted) {
    return (
      <section id="eligibility" className="scroll-mt-24">
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8">Return Eligibility</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100 shadow-sm">
            <h3 className="flex items-center text-xl font-semibold text-green-700 mb-4">
              <span className="mr-2">✓</span> Eligible for Return
            </h3>

            <ul className="space-y-3">
              {eligibleItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border border-red-100 shadow-sm">
            <h3 className="flex items-center text-xl font-semibold text-red-700 mb-4">
              <span className="mr-2">✕</span> Not Eligible for Return
            </h3>

            <ul className="space-y-3">
              {ineligibleItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2 mt-0.5 flex-shrink-0">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-lg">
          <p className="text-amber-800 text-sm">
            <strong>Note:</strong> All returns are subject to inspection. Items that do not meet our return criteria may
            be sent back to you or may receive a partial refund.
          </p>
        </div>
      </section>
    )
  }

  // Enhanced version with JavaScript
  return (
    <motion.section
      id="eligibility"
      className="scroll-mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <motion.h2 className="text-3xl font-bold tracking-tight text-foreground mb-8" variants={itemVariants}>
        Return Eligibility
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100 shadow-sm"
          variants={itemVariants}
        >
          <h3 className="flex items-center text-xl font-semibold text-green-700 mb-4">
            <Check className="mr-2 h-5 w-5" /> Eligible for Return
          </h3>

          <ul className="space-y-3">
            {eligibleItems.map((item, index) => (
              <motion.li key={index} className="flex items-start" variants={itemVariants}>
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border border-red-100 shadow-sm"
          variants={itemVariants}
        >
          <h3 className="flex items-center text-xl font-semibold text-red-700 mb-4">
            <X className="mr-2 h-5 w-5" /> Not Eligible for Return
          </h3>

          <ul className="space-y-3">
            {ineligibleItems.map((item, index) => (
              <motion.li key={index} className="flex items-start" variants={itemVariants}>
                <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-lg" variants={itemVariants}>
        <p className="text-amber-800 text-sm">
          <strong>Note:</strong> All returns are subject to inspection. Items that do not meet our return criteria may
          be sent back to you or may receive a partial refund.
        </p>
      </motion.div>
    </motion.section>
  )
}
