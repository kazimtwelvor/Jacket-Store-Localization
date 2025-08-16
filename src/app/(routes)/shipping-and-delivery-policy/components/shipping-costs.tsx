
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DollarSign, Percent, ShieldCheck } from "lucide-react"

export default function ShippingCosts() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const shippingRates = [
    { order: "Orders under $50", standard: "$5.99", express: "$12.99" },
    { order: "Orders $50-$100", standard: "$3.99", express: "$9.99" },
    { order: "Orders over $100", standard: "FREE", express: "$7.99" },
    { order: "International", standard: "$15.99", express: "$24.99" },
  ]

  if (!isMounted) {
    return (
      <section className="py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black-900 mb-4">Shipping Costs</h2>
          <p className="text-lg text-black-600 max-w-2xl mx-auto">
            Transparent shipping rates with free standard shipping on orders over $100.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-[#eaeaea]">
            <div className="overflow-hidden">
              <div className="relative overflow-x-auto rounded-lg">
                <table className="w-full text-left">
                  <thead className="bg-[#eaeaea] text-black-700">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Order Value</th>
                      <th className="px-6 py-3 font-semibold">Standard</th>
                      <th className="px-6 py-3 font-semibold">Express</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shippingRates.map((rate, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#eaeaea]/30"}>
                        <td className="px-6 py-4 font-medium">{rate.order}</td>
                        <td className="px-6 py-4">{rate.standard}</td>
                        <td className="px-6 py-4">{rate.express}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {[
              {
                title: "Free Shipping Threshold",
                description: "Enjoy free standard shipping on all domestic orders over $100.",
              },
              {
                title: "Promotional Discounts",
                description: "Watch for special promotions that may include discounted or free shipping.",
              },
              {
                title: "Shipping Protection",
                description: "All packages include basic shipping protection against loss or damage.",
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-[#eaeaea] flex">
                <div className="mr-4 flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#eaeaea] flex items-center justify-center"></div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black-900 mb-1">{item.title}</h3>
                  <p className="text-black-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-black-900 mb-4">Shipping Costs</h2>
        <p className="text-lg text-black-600 max-w-2xl mx-auto">
          Transparent shipping rates with free standard shipping on orders over $100.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl p-8 shadow-lg border border-[#eaeaea]"
        >
          <div className="overflow-hidden">
            <div className="relative overflow-x-auto rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-[#eaeaea] text-black-700">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Order Value</th>
                    <th className="px-6 py-3 font-semibold">Standard</th>
                    <th className="px-6 py-3 font-semibold">Express</th>
                  </tr>
                </thead>
                <tbody>
                  {shippingRates.map((rate, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#eaeaea]/30"}>
                      <td className="px-6 py-4 font-medium">{rate.order}</td>
                      <td className="px-6 py-4">{rate.standard}</td>
                      <td className="px-6 py-4">{rate.express}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6"
        >
          {[
            {
              icon: DollarSign,
              title: "Free Shipping Threshold",
              description: "Enjoy free standard shipping on all domestic orders over $100.",
            },
            {
              icon: Percent,
              title: "Promotional Discounts",
              description: "Watch for special promotions that may include discounted or free shipping.",
            },
            {
              icon: ShieldCheck,
              title: "Shipping Protection",
              description: "All packages include basic shipping protection against loss or damage.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-md border border-[#eaeaea] flex"
            >
              <div className="mr-4 flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#eaeaea] flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-black" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black-900 mb-1">{item.title}</h3>
                <p className="text-black-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
