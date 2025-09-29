"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Globe, MapPin } from "lucide-react"

export default function DeliveryZones() {
  const [isMounted, setIsMounted] = useState(false)
  const [activeZone, setActiveZone] = useState("domestic")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const zones = {
    domestic: {
      title: "Domestic Shipping",
      description: "Fast and reliable shipping across the United States",
      deliveryTimes: [
        { region: "East Coast", time: "3-4 business days" },
        { region: "Midwest", time: "3-4 business days" },
        { region: "West Coast", time: "3-4 business days" },
        { region: "Alaska & Hawaii", time: "5-7 business days" },
      ],
    },
    international: {
      title: "International Shipping",
      description: "Global shipping to over 180 countries",
      deliveryTimes: [
        { region: "Canada & Mexico", time: "5-10 business days" },
        { region: "Europe", time: "7-14 business days" },
        { region: "Asia & Australia", time: "10-15 business days" },
        { region: "Rest of World", time: "14-21 business days" },
      ],
    },
  }

  if (!isMounted) {
    return (
      <section className="py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black-900 mb-4">Delivery Zones</h2>
          <p className="text-lg text-black-600 max-w-2xl mx-auto">
            We ship to locations worldwide with varying delivery timeframes based on your region.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-black-100">
          <div className="flex flex-col md:flex-row">
            {/* Zone selector */}
            <div className="md:w-1/3 bg-grey p-6">
              <div className="space-y-4">
                <button className="w-full text-left px-4 py-3 rounded-lg bg-[#2b2b2b] text-white flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="font-medium">Domestic Shipping</span>
                </button>

                <button className="w-full text-left px-4 py-3 rounded-lg bg-white text-black-700 hover:bg-grey flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  <span className="font-medium">International Shipping</span>
                </button>
              </div>
            </div>

            {/* Zone details */}
            <div className="md:w-2/3 p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-black-900 mb-2">Domestic Shipping</h3>
                <p className="text-black-600">Fast and reliable shipping across the United States</p>
              </div>

              <div className="overflow-hidden">
                <div className="relative overflow-x-auto rounded-lg">
                  <table className="w-full text-left">
                    <thead className="bg-[#eaeaea] text-black-700">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Region</th>
                        <th className="px-6 py-3 font-semibold">Estimated Delivery</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zones.domestic.deliveryTimes.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#eaeaea]/30"}>
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
              {zones.international.deliveryTimes.map((item, index) => (
                <tr key={index}>
                  <td>{item.region}</td>
                  <td>{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
        <h2 className="text-3xl md:text-4xl font-bold text-black-900 mb-4">Delivery Zones</h2>
        <p className="text-lg text-black-600 max-w-2xl mx-auto">
          We ship to locations worldwide with varying delivery timeframes based on your region.
        </p>
      </motion.div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-black-100">
        <div className="flex flex-col md:flex-row">
          {/* Zone selector */}
          <div className="md:w-1/3 bg-[#eaeaea] p-6">
            <div className="space-y-4">
              <button
                onClick={() => setActiveZone("domestic")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center ${
                  activeZone === "domestic" ? "bg-[#2b2b2b] text-white" : "bg-white text-black-700 hover:bg-[#eaeaea]"
                }`}
              >
                <MapPin className="w-5 h-5 mr-2" />
                <span className="font-medium">Domestic Shipping</span>
              </button>

              <button
                onClick={() => setActiveZone("international")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center ${
                  activeZone === "international" ? "bg-[#2b2b2b] text-white" : "bg-white text-black-700 hover:bg-[#eaeaea]"
                }`}
              >
                <Globe className="w-5 h-5 mr-2" />
                <span className="font-medium">International Shipping</span>
              </button>
            </div>
          </div>

          {/* Zone details */}
          <motion.div
            key={activeZone}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="md:w-2/3 p-8"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-black-900 mb-2">{zones[activeZone as keyof typeof zones].title}</h3>
              <p className="text-black-600">{zones[activeZone as keyof typeof zones].description}</p>
            </div>

            <div className="overflow-hidden">
              <div className="relative overflow-x-auto rounded-lg">
                <table className="w-full text-left">
                  <thead className="bg-[#eaeaea] text-black-700">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Region</th>
                      <th className="px-6 py-3 font-semibold">Estimated Delivery</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones[activeZone as keyof typeof zones].deliveryTimes.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#eaeaea]/30"}>
                        <td className="px-6 py-4 font-medium">{item.region}</td>
                        <td className="px-6 py-4">{item.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
