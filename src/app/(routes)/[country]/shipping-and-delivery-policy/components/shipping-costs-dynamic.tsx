"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShippingPolicyData } from "../data/shipping-data-by-country"

interface ShippingCostsDynamicProps {
  shippingData: ShippingPolicyData
}

export default function ShippingCostsDynamic({ shippingData }: ShippingCostsDynamicProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shipping Costs</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transparent shipping rates with free standard shipping on orders over $100.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-red-100">
            <div className="overflow-hidden">
              <div className="relative overflow-x-auto rounded-lg">
                <table className="w-full text-left">
                  <thead className="bg-red-50 text-gray-700">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Order Value</th>
                      <th className="px-6 py-3 font-semibold">Standard Shipping</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shippingData.shippingRates.map((rate, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-red-50/30"}>
                        <td className="px-6 py-4 font-medium">{rate.order}</td>
                        <td className="px-6 py-4">{rate.standard}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {shippingData.shippingFeatures.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-red-100 flex">
                <div className="mr-4 flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"></div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shipping Costs</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transparent shipping rates with free standard shipping on orders over $100.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl p-8 shadow-lg border border-red-100"
        >
          <div className="overflow-hidden">
            <div className="relative overflow-x-auto rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-red-50 text-gray-700">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Order Value</th>
                    <th className="px-6 py-3 font-semibold">Standard Shipping</th>
                  </tr>
                </thead>
                <tbody>
                  {shippingData.shippingRates.map((rate, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-red-50/30"}>
                      <td className="px-6 py-4 font-medium">{rate.order}</td>
                      <td className="px-6 py-4">{rate.standard}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid gap-6"
        >
          {shippingData.shippingFeatures.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-md border border-red-100 flex"
            >
              <div className="mr-4 flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"></div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
