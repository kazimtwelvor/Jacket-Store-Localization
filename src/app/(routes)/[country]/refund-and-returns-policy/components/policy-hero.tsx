"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCcw, ArrowLeftRight, CreditCard, Clock } from "lucide-react"

export default function PolicyHero() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const iconVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  if (!isMounted) {
    return (
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">Returns & Refund Policy</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">Easy returns and hassle-free refunds on eligible orders</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { text: "30-Day Returns" },
            { text: "Easy Process" },
            { text: "Free Returns" },
            { text: "Fast Refunds" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-3 shadow-md"></div>
              <p className="font-medium text-gray-800">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="text-center max-w-3xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2b2b2b] mb-4"
      >
        Returns & Refund Policy
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg md:text-xl text-[#333333] mb-6"
      >
        Easy returns and hassle-free refunds on eligible orders
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: Clock, text: "30-Day Returns" },
          { icon: ArrowLeftRight, text: "Easy Process" },
          { icon: RefreshCcw, text: "Free Returns" },
          { icon: CreditCard, text: "Fast Refunds" },
        ].map((item, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-full bg-[#2b2b2b] flex items-center justify-center mb-3 shadow-md">
              <item.icon className="w-7 h-7 text-white" />
            </div>
            <p className="font-medium text-[#333333]">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
