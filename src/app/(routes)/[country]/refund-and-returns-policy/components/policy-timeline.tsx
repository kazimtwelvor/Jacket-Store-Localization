"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, CheckCircle, HelpCircle } from "lucide-react"

export default function PolicyTimeline() {
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
        delayChildren: 0.2,
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

  const timelineItems = [
    {
      day: "Day 1-2",
      title: "Return Initiated",
      description:
        "You request a return through your account and receive a confirmation email with shipping instructions.",
      icon: <Clock className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      iconBg: "bg-blue-500",
      staticIcon: "⏱️",
    },
    {
      day: "Day 3-7",
      title: "Return in Transit",
      description:
        "Your package is on its way back to our warehouse. You can track its progress using the provided tracking number.",
      icon: <Clock className="h-5 w-5" />,
      color: "bg-amber-100 text-amber-700 border-amber-200",
      iconBg: "bg-amber-500",
      staticIcon: "🚚",
    },
    {
      day: "Day 8-9",
      title: "Return Received & Inspected",
      description:
        "We've received your return and our team is inspecting the items to ensure they meet our return criteria.",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "bg-red-100 text-red-700 border-red-200",
      iconBg: "bg-red-500",
      staticIcon: "🔍",
    },
    {
      day: "Day 10-12",
      title: "Refund Processed",
      description:
        "Your refund has been approved and processed. The amount will be credited back to your original payment method.",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "bg-green-100 text-green-700 border-green-200",
      iconBg: "bg-green-500",
      staticIcon: "✅",
    },
    {
      day: "Day 13-17",
      title: "Refund Completed",
      description:
        "The refund should now appear on your account statement. The exact timing depends on your financial institution.",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "bg-red-100 text-red-700 border-red-200",
      iconBg: "bg-[#2b2b2b]",
      staticIcon: "💰",
    },
  ]

  // Non-JavaScript fallback
  if (!isMounted) {
    return (
      <section id="timeline" className="scroll-mt-24">
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8">Refund Timeline</h2>

        <div className="relative border border-border rounded-xl p-6 bg-white shadow-sm">
          <div className="space-y-8">
            {timelineItems.map((item, index) => (
              <div key={index} className="relative">
                {index < timelineItems.length - 1 && (
                  <div className="absolute top-12 bottom-0 left-6 w-0.5 bg-gray-200" />
                )}

                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md z-10 ${item.iconBg}`}
                  >
                    <span className="text-white">{item.staticIcon}</span>
                  </div>

                  <div className={`flex-1 p-4 rounded-lg border ${item.color}`}>
                    <div className="font-semibold text-sm mb-1">{item.day}</div>
                    <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                    <p className="text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
            <span className="text-blue-500 flex-shrink-0 mt-0.5">ℹ️</span>
            <div>
              <p className="text-blue-800 text-sm">
                <strong>Timeline Note:</strong> The above timeline is an estimate and may vary depending on shipping
                times, volume of returns, and your financial institution's processing times. International returns may
                take longer.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Enhanced version with JavaScript
  return (
    <motion.section
      id="timeline"
      className="scroll-mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <motion.h2 className="text-3xl font-bold tracking-tight text-foreground mb-8" variants={itemVariants}>
        Refund Timeline
      </motion.h2>

      <motion.div className="relative border border-border rounded-xl p-6 bg-white shadow-sm" variants={itemVariants}>
        <div className="space-y-8">
          {timelineItems.map((item, index) => (
            <motion.div key={index} className="relative" variants={itemVariants}>
              {index < timelineItems.length - 1 && (
                <div className="absolute top-12 bottom-0 left-6 w-0.5 bg-gray-200" />
              )}

              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-full ${item.iconBg} flex items-center justify-center flex-shrink-0 shadow-md z-10`}
                >
                  <span className="text-white">{item.icon}</span>
                </div>

                <div className={`flex-1 p-4 rounded-lg border ${item.color}`}>
                  <div className="font-semibold text-sm mb-1">{item.day}</div>
                  <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                  <p className="text-sm">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3"
          variants={itemVariants}
        >
          <HelpCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-800 text-sm">
              <strong>Timeline Note:</strong> The above timeline is an estimate and may vary depending on shipping
              times, volume of returns, and your financial institution's processing times. International returns may
              take longer.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
