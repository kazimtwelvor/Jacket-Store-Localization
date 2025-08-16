"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Truck, Zap, Plane } from "lucide-react"

export default function ShippingMethods() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const shippingMethods = [
    {
      icon: Truck,
      title: "Standard Shipping",
      description: "Delivery within 5-7 business days",
      features: ["Tracking included", "Signature on delivery optional", "Available for most locations"],
    },
    {
      icon: Zap,
      title: "Express Shipping",
      description: "Delivery within 2-3 business days",
      features: ["Priority handling", "Tracking included", "Signature on delivery"],
    },
    {
      icon: Plane,
      title: "International Shipping",
      description: "Delivery within 7-14 business days",
      features: ["Customs clearance assistance", "Tracking included", "Available for 180+ countries"],
    },
  ]

  if (!isMounted) {
    return (
      <section className="pt-6 pb-12">
        <div className="mb-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black-900 mb-3">Shipping Methods</h2>
          <p className="text-lg text-black-600 max-w-2xl mx-auto">
            Choose the shipping option that best suits your needs, from standard to express delivery.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {shippingMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg border border-black-100">
              <div className="w-14 h-14 rounded-full bg-[#eaeaea] flex items-center justify-center mb-6"></div>
              <h3 className="text-xl font-bold text-black-900 mb-3">{method.title}</h3>
              <p className="text-black-600 mb-6">{method.description}</p>
              <ul className="space-y-2">
                {method.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-black-700">
                    <span className="w-2 h-2 bg-[#eaeaea] rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="pt-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-6 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-black-900 mb-3">Shipping Methods</h2>
        <p className="text-lg text-black-600 max-w-2xl mx-auto">
          Choose the shipping option that best suits your needs, from standard to express delivery.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-8"
      >
        {shippingMethods.map((method, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-black-100"
          >
            <div className="w-14 h-14 rounded-full bg-[#eaeaea] flex items-center justify-center mb-6">
              <method.icon className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-xl font-bold text-black-900 mb-3">{method.title}</h3>
            <p className="text-black-600 mb-6">{method.description}</p>
            <ul className="space-y-2">
              {method.features.map((feature, i) => (
                <li key={i} className="flex items-center text-black">
                  <span className="w-2 h-2 bg-[#eaeaea] rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}