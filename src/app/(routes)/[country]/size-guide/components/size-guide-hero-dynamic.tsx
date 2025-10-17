"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Ruler, Users, CheckCircle, Shirt } from "lucide-react"
import { SizeGuideData } from "../data/size-guide-data-by-country"

interface SizeGuideHeroDynamicProps {
  sizeGuideData?: SizeGuideData
}

export default function SizeGuideHeroDynamic({ sizeGuideData }: SizeGuideHeroDynamicProps) {
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

  const iconMap = {
    "Ruler": Ruler,
    "Users": Users,
    "CheckCircle": CheckCircle,
    "Shirt": Shirt,
  }

  const defaultData = {
    title: "Complete Size Guide for Jackets & Outerwear",
    description: "Find your perfect fit with our comprehensive sizing guide",
    heroFeatures: [
      { icon: "Ruler", text: "Accurate Sizing" },
      { icon: "Users", text: "All Body Types" },
      { icon: "CheckCircle", text: "Perfect Fit" },
      { icon: "Shirt", text: "Easy Guide" },
    ]
  }

  const data = sizeGuideData || defaultData

  if (!isMounted) {
    return (
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
          {data.title}
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          {data.description}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {data.heroFeatures.map((item, i) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Ruler
            return (
              <div key={i} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-3 shadow-md">
                  <IconComponent className="w-7 h-7 text-[#2b2b2b]" />
                </div>
                <p className="font-medium text-gray-800">{item.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="text-center max-w-3xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg md:text-xl text-[#333333] mb-6"
      >
        {data.description}
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {data.heroFeatures.map((item, i) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Ruler
          return (
            <motion.div
              key={i}
              custom={i}
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#EAEAEA] flex items-center justify-center mb-3 shadow-md">
                <IconComponent className="w-7 h-7 text-[#2b2b2b]" />
              </div>
              <p className="font-medium text-[#2b2b2b]">{item.text}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
