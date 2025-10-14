"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Calendar, Truck } from "lucide-react"

export default function OrderProcessingInfo() {
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

  if (!isMounted) {
    return (
      <section className="py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black-900 mb-4">Order Processing Information</h2>
          <p className="text-lg text-black-600 max-w-2xl mx-auto">
            Important details about how we process your orders and shipping timelines.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-black-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#eaeaea] flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black-900">Standard Processing</h3>
              </div>
              <p className="text-black-600 text-lg">
                <strong>1-3 business days</strong> after order placement
              </p>
              <p className="text-black-600 mt-2">
                All orders are carefully processed and prepared for shipment within this timeframe.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-black-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#eaeaea] flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black-900">Order Cut-Off Time</h3>
              </div>
              <p className="text-black-600 text-lg">
                Orders placed after <strong>5:00 PM (GMT-05:00)</strong> Eastern Standard Time (New York)
              </p>
              <p className="text-black-600 mt-2">
                will be processed the next business day.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-[#f5f5f5] rounded-xl p-6 border border-black-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-[#eaeaea] flex items-center justify-center mr-3">
                <Truck className="w-4 h-4 text-black" />
              </div>
              <h3 className="text-lg font-bold text-black-900">Standard Shipping Timeline</h3>
            </div>
            <p className="text-black-700">
              Once your order is processed, standard shipping delivery takes <strong>3-4 business days</strong> to most locations within the United States.
            </p>
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
        <h2 className="text-3xl md:text-4xl font-bold text-black-900 mb-4">Order Processing Information</h2>
        <p className="text-lg text-black-600 max-w-2xl mx-auto">
          Important details about how we process your orders and shipping timelines.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-black-100"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#eaeaea] flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black-900">Standard Processing</h3>
            </div>
            <p className="text-black-600 text-lg">
              <strong>1-3 business days</strong> after order placement
            </p>
            <p className="text-black-600 mt-2">
              All orders are carefully processed and prepared for shipment within this timeframe.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-black-100"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#eaeaea] flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black-900">Order Cut-Off Time</h3>
            </div>
            <p className="text-black-600 text-lg">
              Orders placed after <strong>5:00 PM (GMT-05:00)</strong> Eastern Standard Time (New York)
            </p>
            <p className="text-black-600 mt-2">
              will be processed the next business day.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-8 bg-[#f5f5f5] rounded-xl p-6 border border-black-100"
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-[#eaeaea] flex items-center justify-center mr-3">
              <Truck className="w-4 h-4 text-black" />
            </div>
            <h3 className="text-lg font-bold text-black-900">Standard Shipping Timeline</h3>
          </div>
          <p className="text-black-700">
            Once your order is processed, standard shipping delivery takes <strong>3-4 business days</strong> to most locations within the United States.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
