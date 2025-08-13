"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Info } from "lucide-react"

export default function PolicyExceptions() {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const exceptions = [
    {
      title: "Sale Items",
      description:
        "Items purchased during special sales events may have modified return periods. Check the product page or your order confirmation for details.",
    },
    {
      title: "International Returns",
      description:
        "International customers are responsible for return shipping costs and any customs duties or taxes incurred during the return process.",
    },
    {
      title: "Damaged or Defective Items",
      description:
        "If you receive a damaged or defective item, please contact customer service within 48 hours of delivery with photos of the damage.",
    },
    {
      title: "Exchange Requests",
      description:
        "For size or color exchanges, we recommend placing a new order for the desired item and returning the original purchase for a refund.",
    },
    {
      title: "Gift Returns",
      description:
        "Returns for gifts will be issued as store credit to the gift recipient. The original purchaser will not be notified.",
    },
  ]

  // Non-JavaScript fallback
  if (!isMounted) {
    return (
      <section id="exceptions" className="scroll-mt-24">
        <h2 className="text-3xl font-bold tracking-tight text-[#2b2b2b] mb-8">Special Circumstances & Exceptions</h2>

        <div className="bg-white rounded-xl border border-[#2b2b2b] shadow-sm overflow-hidden">
          <div className="bg-[#EAEAEA] p-4 border-b border-[#2b2b2b] flex items-center gap-3">
            <span className="h-5 w-5 text-[#2b2b2b]">⚠️</span>
            <h3 className="font-semibold text-[#2b2b2b]">
              Please note the following exceptions to our standard policy:
            </h3>
          </div>

          <div className="divide-y divide-[#2b2b2b]">
            {exceptions.map((exception, index) => (
              <div key={index} className="p-5">
                <h4 className="font-medium text-lg mb-1 text-[#2b2b2b]">{exception.title}</h4>
                <p className="text-[#333333]">{exception.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-5 bg-[#EAEAEA] border border-[#2b2b2b] rounded-lg flex items-start gap-3">
          <span className="h-5 w-5 text-[#2b2b2b] flex-shrink-0 mt-0.5">ℹ️</span>
          <div>
            <h4 className="font-medium mb-1 text-[#2b2b2b]">Policy Changes</h4>
            <p className="text-sm text-[#333333]">
              We reserve the right to modify this policy at any time. Any changes will be effective immediately upon
              posting to this page. Returns will be processed according to the policy in effect at the time of purchase.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Enhanced version with JavaScript
  return (
    <motion.section
      id="exceptions"
      className="scroll-mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <motion.h2 className="text-3xl font-bold tracking-tight text-[#2b2b2b] mb-8" variants={itemVariants}>
        Special Circumstances & Exceptions
      </motion.h2>

      <motion.div
        className="bg-white rounded-xl border border-[#2b2b2b] shadow-sm overflow-hidden"
        variants={itemVariants}
      >
        <div className="bg-[#EAEAEA] p-4 border-b border-[#2b2b2b] flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-[#2b2b2b]" />
          <h3 className="font-semibold text-[#2b2b2b]">Please note the following exceptions to our standard policy:</h3>
        </div>

        <div className="divide-y divide-[#2b2b2b]">
          {exceptions.map((exception, index) => (
            <motion.div
              key={index}
              className="p-5"
              variants={itemVariants}
              whileHover={{ backgroundColor: "rgba(248,240,240,0.2)" }}
            >
              <h4 className="font-medium text-lg mb-1 text-[#2b2b2b]">{exception.title}</h4>
              <p className="text-[#333333]">{exception.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mt-8 p-5 bg-[#EAEAEA] border border-[#2b2b2b] rounded-lg flex items-start gap-3"
        variants={itemVariants}
      >
        <Info className="h-5 w-5 text-[#2b2b2b] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium mb-1 text-[#2b2b2b]">Policy Changes</h4>
          <p className="text-sm text-[#333333]">
            We reserve the right to modify this policy at any time. Any changes will be effective immediately upon
            posting to this page. Returns will be processed according to the policy in effect at the time of purchase.
          </p>
        </div>
      </motion.div>
    </motion.section>
  )
}
