"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Truck, Package, Globe, Clock } from "lucide-react"
import { BgGridPattern } from "./bg-grid-pattern"
import { ShippingPolicyData } from "../data/shipping-data-by-country"

interface PolicyHeroProps {
  shippingData?: ShippingPolicyData
}

export default function PolicyHero({ shippingData }: PolicyHeroProps) {
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
        ease: "easeOut" as const,
      },
    }),
  }

  if (!isMounted) {
    return (
      <div className="relative overflow-hidden bg-[#f6f6f6] ">
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-20 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold text-black  mb-6">
              {shippingData?.title || "Shipping & Delivery Policy"}
            </h1>
            <p className="text-lg md:text-xl text-black  mb-10">
              {shippingData?.description || "Fast, reliable shipping to your doorstep, anywhere in the world"}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {(shippingData?.heroFeatures || ["Fast Shipping", "Secure Packaging", "Global Delivery", "Real-time Tracking"]).map((feature, i) => (
                <div key={i} className="flex flex-col items-center  ">
                  <div className="w-16 h-16 rounded-full bg-[#eaeaea] flex items-center justify-center mb-4 shadow-md"></div>
                  <p className="font-medium text-black">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden bg-[#f6f6f6] ">
      <BgGridPattern/>

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-20 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6"
          >
            {shippingData?.title || "Shipping & Delivery Policy"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-black  b-12  mb-9"
          >
            {shippingData?.description || "Fast, reliable shipping to your doorstep, anywhere in the world"}
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {(shippingData?.heroFeatures || ["Fast Shipping", "Secure Packaging", "Global Delivery", "Real-time Tracking"]).map((feature, i) => {
              const iconMap = {
                "Fast Shipping": Truck,
                "Secure Packaging": Package,
                "Global Delivery": Globe,
                "Reliable Delivery": Globe,
                "Real-time Tracking": Clock,
              }
              const IconComponent = iconMap[feature as keyof typeof iconMap] || Package
              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#eaeaea]  flex items-center justify-center  mb-4 shadow-md">
                    <IconComponent className="w-8 h-8 text-black"/>
                  </div>
                  <p className="font-medium text-[#2b2b2b] ">{feature}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"
      />
    </div>
  )
}
