"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useSizeGuideContext } from "./size-guide-context"

export default function MeasurementGuide() {
  const { unit } = useSizeGuideContext()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const measurementSteps = [
    {
      title: "Chest / Bust",
      description:
        "Measure around the fullest part of your chest/bust, keeping the measuring tape horizontal and not too tight.",
      image: "/person-measuring-chest.png",
    },
    {
      title: "Waist",
      description:
        "Measure around your natural waistline, which is the narrowest part of your torso, typically above your belly button.",
      image: "/placeholder.svg?key=wwb77",
    },
    {
      title: "Hips",
      description: "Measure around the fullest part of your hips, usually about 8 inches below your waistline.",
      image: "/person-measuring-hips.png",
    },
    {
      title: "Inseam",
      description: "Measure from the crotch seam to the bottom of the leg along the inside of the leg.",
      image: "/measuring-inseam.png",
    },
  ]

  const tips = [
    "Use a soft measuring tape, not a metal one.",
    "Wear minimal clothing or measure directly against your skin.",
    "Stand straight with feet together when taking measurements.",
    "Keep the measuring tape snug but not tight.",
    "Have someone help you for more accurate measurements.",
    "Measure twice to ensure accuracy.",
  ]

  if (!isMounted) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">How to Measure</h3>
          <p className="text-muted-foreground max-w-3xl">
            Follow these simple steps to take accurate measurements for the perfect fit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {measurementSteps.map((step, index) => (
            <div key={index} className="bg-card rounded-lg border shadow-sm overflow-hidden">
              <div className="aspect-video relative bg-muted">
                <Image src={step.image || "/placeholder.svg"} alt={step.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/20 rounded-lg border p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">Measurement Tips</h3>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-black ">How to Measure</h3>
      <p className="text-[#666666] max-w-3xl mb-6">
        Follow these simple steps to take accurate measurements for the perfect fit.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {measurementSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg border border-[#2b2b2b] shadow-sm overflow-hidden"
          >
            <div className="aspect-video relative bg-[#f6f6f6]">
              <Image src={step.image || "/placeholder.svg"} alt={step.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">{step.title}</h3>
              <p className="text-[#666666]">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-[#2b2b2b] p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4 text-[#333333]">Measurement Tips</h3>
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <span className="text-white mr-2">•</span>
              <span className="text-[#666666]">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
