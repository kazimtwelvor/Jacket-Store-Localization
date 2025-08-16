"use client"

import { useEffect, useState } from "react"
import PolicyHero from "./components/policy-hero"
import ShippingMethods from "./components/shipping-methods"
import DeliveryZones from "./components/delivery-zones"
import ShippingTimeline from "./components/shipping-timeline"
import ShippingCosts from "./components/shipping-costs"
import ShippingFAQ from "./components/shipping-faq"
import ShippingContact from "./components/shipping-contact"
import { motion } from "framer-motion"

export default function ShippingPolicyClient() {
  const [isMounted, setIsMounted] = useState(false)

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0)
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <section className="min-h-screen bg-white">
        <div className="relative overflow-hidden bg-gradient-to-b from-red-50 to-white border-b border-red-100">
          <div className="relative z-10 container mx-auto px-4 pt-16 pb-8 md:pt-20 md:pb-8 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Shipping & Delivery Policy
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                Fast, reliable shipping to your doorstep, anywhere in the world
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { text: "Fast Shipping" },
                  { text: "Secure Packaging" },
                  { text: "Global Delivery" },
                  { text: "Real-time Tracking" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-3 shadow-md"></div>
                    <p className="font-medium text-gray-800">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pt-0 pb-8 max-w-7xl">
          {/* Static versions of all components */}
          <div className="pt-6 pb-12">
            <div className="mb-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Shipping Methods</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the shipping option that best suits your needs, from standard to express delivery.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Standard Shipping",
                  description: "Delivery within 5-7 business days",
                  features: ["Tracking included", "Signature on delivery optional", "Available for most locations"],
                },
                {
                  title: "Express Shipping",
                  description: "Delivery within 2-3 business days",
                  features: ["Priority handling", "Tracking included", "Signature on delivery"],
                },
                {
                  title: "International Shipping",
                  description: "Delivery within 7-14 business days",
                  features: ["Customs clearance assistance", "Tracking included", "Available for 180+ countries"],
                },
              ].map((method, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg border border-red-100">
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-6"></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{method.title}</h3>
                  <p className="text-gray-600 mb-6">{method.description}</p>
                  <ul className="space-y-2">
                    {method.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="py-16">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Delivery Zones</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We ship to locations worldwide with varying delivery timeframes based on your region.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-red-100">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-red-50 p-6">
                  <div className="space-y-4">
                    <button className="w-full text-left px-4 py-3 rounded-lg bg-[#2b2b2b] text-white flex items-center">
                      <span className="font-medium">Domestic Shipping</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg bg-white text-gray-700 flex items-center">
                      <span className="font-medium">International Shipping</span>
                    </button>
                  </div>
                </div>

                <div className="md:w-2/3 p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Domestic Shipping</h3>
                    <p className="text-gray-600">Fast and reliable shipping across the United States</p>
                  </div>

                  <div className="overflow-hidden">
                    <div className="relative overflow-x-auto rounded-lg">
                      <table className="w-full text-left">
                        <thead className="bg-red-50 text-gray-700">
                          <tr>
                            <th className="px-6 py-3 font-semibold">Region</th>
                            <th className="px-6 py-3 font-semibold">Estimated Delivery</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { region: "East Coast", time: "3-5 business days" },
                            { region: "Midwest", time: "3-5 business days" },
                            { region: "West Coast", time: "4-6 business days" },
                            { region: "Alaska & Hawaii", time: "5-7 business days" },
                          ].map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-red-50/30"}>
                              <td className="px-6 py-4 font-medium">{item.region}</td>
                              <td className="px-6 py-4">{item.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hidden content for SEO */}
            <div className="sr-only" aria-hidden="true">
              <h3>International Shipping</h3>
              <p>Global shipping to over 180 countries</p>
              <table>
                <thead>
                  <tr>
                    <th>Region</th>
                    <th>Estimated Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Canada & Mexico</td>
                    <td>5-10 business days</td>
                  </tr>
                  <tr>
                    <td>Europe</td>
                    <td>7-14 business days</td>
                  </tr>
                  <tr>
                    <td>Asia & Australia</td>
                    <td>10-15 business days</td>
                  </tr>
                  <tr>
                    <td>Rest of World</td>
                    <td>14-21 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="py-16">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shipping Process</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From the moment you place your order to delivery at your doorstep, here's what happens.
              </p>
            </div>

            <div className="relative">
              <div
                className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-red-200 transform -translate-x-1/2 origin-top"
                style={{ height: "calc(100% - 80px)" }}
              ></div>

              <div className="relative z-10">
                {[
                  {
                    title: "Order Placed",
                    description: "Your order is confirmed and payment is processed",
                  },
                  {
                    title: "Order Processing",
                    description: "Items are picked, packed and prepared for shipping",
                  },
                  {
                    title: "Order Shipped",
                    description: "Your package is on its way with tracking information sent to you",
                  },
                  {
                    title: "Order Delivered",
                    description: "Your package has been delivered to your specified address",
                  },
                ].map((step, index) => (
                  <div key={index} className="mb-16 last:mb-0">
                    <div className="flex flex-col md:flex-row items-center">
                      <div
                        className={`
                        relative z-10 flex items-center justify-center w-16 h-16 rounded-full 
                        bg-white border-2 border-red-200 shadow-md mb-4 md:mb-0
                        ${index % 2 === 0 ? "md:order-1 md:ml-8" : "md:order-3 md:mr-8"}
                      `}
                      ></div>

                      <div
                        className={`
                        bg-white rounded-xl p-6 shadow-lg border border-red-100 max-w-md
                        ${index % 2 === 0 ? "md:order-2 md:text-left" : "md:order-2 md:text-right"}
                        text-center md:text-left
                      `}
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>

                      <div
                        className={`hidden md:block md:w-1/2 ${index % 2 === 0 ? "md:order-3" : "md:order-1"}`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
                          <th className="px-6 py-3 font-semibold">Standard</th>
                          <th className="px-6 py-3 font-semibold">Express</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { order: "Orders under $50", standard: "$5.99", express: "$12.99" },
                          { order: "Orders $50-$100", standard: "$3.99", express: "$9.99" },
                          { order: "Orders over $100", standard: "FREE", express: "$7.99" },
                          { order: "International", standard: "$15.99", express: "$24.99" },
                        ].map((rate, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-red-50/30"}>
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

          <div className="py-16">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about our shipping and delivery process.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {[
                {
                  question: "How can I track my order?",
                  answer:
                    "Once your order ships, you'll receive a shipping confirmation email with a tracking number and link. You can also track your order by logging into your account and viewing your order history.",
                },
                {
                  question: "Do you ship internationally?",
                  answer:
                    "Yes, we ship to over 180 countries worldwide. International shipping rates and delivery times vary by location. Please note that customers are responsible for any customs fees, import taxes, or duties that may apply.",
                },
                {
                  question: "What if my package is lost or damaged?",
                  answer:
                    "If your package is lost or damaged during transit, please contact our customer service team within 14 days of the expected delivery date. We'll work with the shipping carrier to locate your package or process a replacement shipment.",
                },
                {
                  question: "Can I change my shipping address after placing an order?",
                  answer:
                    "We can only change the shipping address if the order hasn't been processed yet. Please contact our customer service team immediately if you need to update your shipping address. Once an order has been shipped, we cannot redirect it to a different address.",
                },
                {
                  question: "Do you offer expedited shipping options?",
                  answer:
                    "Yes, we offer express shipping options at checkout for customers who need their orders more quickly. Express shipping typically delivers within 2-3 business days for domestic orders, depending on your location.",
                },
              ].map((faq, index) => (
                <div key={index} className="mb-4 border border-red-100 rounded-lg overflow-hidden">
                  <button className="w-full px-6 py-4 text-left bg-white flex justify-between items-center">
                    <span className="font-medium text-gray-900">{faq.question}</span>
                  </button>
                  {index === 0 && <div className="px-6 py-4 bg-red-50/50 text-gray-600">{faq.answer}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Need Help?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our customer service team is here to assist you with any shipping or delivery questions.
              </p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-3">
                {[
                  {
                    title: "Email Us",
                    description: "Get a response within 24 hours",
                    contact: "support@fashionstore.com",
                    action: "Send Email",
                  },
                  {
                    title: "Call Us",
                    description: "Available Mon-Fri, 9am-5pm EST",
                    contact: "+1 (800) 123-4567",
                    action: "Call Now",
                  },
                  {
                    title: "Live Chat",
                    description: "Get instant assistance",
                    contact: "Available 24/7",
                    action: "Start Chat",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-8 bg-white border border-gray-800 hover:border-red-300 transition-colors duration-300"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4"></div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <p className="font-medium text-gray-800 mb-6">{item.contact}</p>
                      <button className="px-6 py-2 bg-[#2b2b2b] text-white rounded-md hover:bg-red-700 transition-colors duration-200">
                        {item.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <PolicyHero />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="container mx-auto px-4 pt-0 pb-8 max-w-7xl"
      >
        <ShippingMethods />
        <DeliveryZones />
        <ShippingTimeline />
        <ShippingCosts />
        <ShippingFAQ />
        <ShippingContact />
      </motion.div>
    </motion.div>
  )
}
