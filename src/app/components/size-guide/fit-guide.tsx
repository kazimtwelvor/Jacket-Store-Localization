"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function FitGuide() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const fitTypes = [
    {
      title: "Slim Fit",
      description:
        "Our slim fit is tailored close to the body with a narrower cut through the chest, waist, and hips. Ideal for a modern, streamlined look.",
      image: "/images/size-guide/slim-fit.webp",
      bestFor: ["Lean or athletic builds", "Modern, fashion-forward style", "Layering under jackets"],
    },
    {
      title: "Regular Fit",
      description:
        "Our regular fit offers a balanced cut that's neither too tight nor too loose. Comfortable through the chest, waist, and hips with room to move.",
      image: "/images/size-guide/regular-fit.webp",
      bestFor: ["Most body types", "Everyday wear", "Business casual settings"],
    },
    {
      title: "Relaxed Fit",
      description:
        "Our relaxed fit provides a generous cut with extra room through the chest, waist, and hips for maximum comfort and ease of movement.",
      image: "/images/size-guide/relaxed-fit.webp",
      bestFor: ["Fuller figures", "Comfort-focused style", "Casual, laid-back looks"],
    },
    {
      title: "Oversized Fit",
      description:
        "Our oversized fit features an extra roomy cut throughout for a trendy, statement-making silhouette that's both comfortable and stylish.",
      image: "/images/size-guide/oversized-fit.webp",
      bestFor: ["Street style looks", "Layered outfits", "Making a fashion statement"],
    },
  ]

  if (!isMounted) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Fit Guide</h2>
          <p className="text-muted-foreground max-w-3xl">
            Understand the different fits we offer to find the style that suits you best.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {fitTypes.map((fit, index) => (
            <div key={index} className="bg-card rounded-lg border shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative">
                  <div className="aspect-[2/3] relative bg-muted">
                    <Image src={fit.image || "/placeholder.svg"} alt={fit.title} fill className="object-cover" />
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-semibold mb-2">{fit.title}</h3>
                  <p className="text-muted-foreground mb-4">{fit.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">Best For:</h4>
                    <ul className="space-y-1">
                      {fit.bestFor.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/20 rounded-lg border p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">Fit Tips</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span className="text-muted-foreground">
                If you're between sizes, size up for a relaxed fit or size down for a more fitted look.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span className="text-muted-foreground">
                Consider your body type when choosing a fit. Different fits flatter different body shapes.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span className="text-muted-foreground">
                Remember that fabrics with stretch will provide more give and comfort regardless of the fit.
              </span>
            </li>
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
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-white">Fit Guide</h2>
      <p className="text-[#666666] max-w-3xl mb-6">
        Understand the different fits we offer to find the style that suits you best.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {fitTypes.map((fit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg border border-[#2b2b2b] shadow-sm overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 relative">
                <div className="aspect-[2/3] relative bg-white">
                  <Image src={fit.image || "/placeholder.svg"} alt={fit.title} fill className="object-cover" />
                </div>
              </div>
              <div className="md:w-2/3 p-6">
                <h3 className="text-xl font-semibold mb-2 text-[#333333]">{fit.title}</h3>
                <p className="text-[#666666] mb-4">{fit.description}</p>
                <div>
                  <h4 className="font-medium mb-2 text-[#333333]">Best For:</h4>
                  <ul className="space-y-1">
                    {fit.bestFor.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-white mr-2">•</span>
                        <span className="text-[#666666]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-[#2b2b2b] p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4 text-[#333333]">Fit Tips</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            <span className="text-[#666666]">
              If you're between sizes, size up for a relaxed fit or size down for a more fitted look.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            <span className="text-[#666666]">
              Consider your body type when choosing a fit. Different fits flatter different body shapes.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            <span className="text-[#666666]">
              Remember that fabrics with stretch will provide more give and comfort regardless of the fit.
            </span>
          </li>
        </ul>
      </div>
    </motion.div>
  )
}
