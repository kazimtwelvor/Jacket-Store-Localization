
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, MessageSquare, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { ShippingPolicyData } from "../data/shipping-data-by-country"

interface ShippingContactProps {
  shippingData?: ShippingPolicyData
}

export default function ShippingContact({ shippingData }: ShippingContactProps) {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleContactAction = (type: string) => {
    const contactEmail = shippingData?.contactEmail || "info@fineystjackets.com"
    switch (type) {
      case "email":
        window.location.href = `mailto:${contactEmail}`
        break
      case "phone":
        window.location.href = "tel:+18888400885"
        break
      case "chat":
        alert("")
        break
      default:
        break
    }
  }

  const contactOptions = shippingData?.contactOptions || [
    {
      icon: "Mail",
      title: "Email Us",
      description: "Get a response within 24 hours",
      contact: "info@fineystjackets.com",
      action: "Send Email",
      type: "email",
    },
    {
      icon: "Phone",
      title: "Call Us",
      description: "Available Mon-Fri, 9am-5pm EST",
      contact: "+1 (888) 840-0885",
      action: "Call Now",
      type: "phone",
    },
    {
      icon: "MessageSquare",
      title: "Live Chat",
      description: "Get instant assistance",
      contact: "Available 24/7",
      action: "Start Chat",
      type: "chat",
    },
  ]

  if (!isMounted) {
    return (
      <section className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our customer service team is here to assist you with any shipping or delivery questions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-3 divide-x divide-gray-100">
            {contactOptions.map((item, index) => (
              <div
                key={index}
                className="p-8 bg-white hover:border-gray-300 transition-colors duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    {item.icon === "Mail" && <Mail className="w-7 h-7 text-gray-600" />}
                    {item.icon === "Phone" && <Phone className="w-7 h-7 text-gray-600" />}
                    {item.icon === "MessageSquare" && <MessageSquare className="w-7 h-7 text-gray-600" />}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <p className="font-medium text-gray-800 mb-6">{item.contact}</p>
                  <button className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-200 transition-colors duration-200">
                    {item.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Need Help?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our customer service team is here to assist you with any shipping or delivery questions.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
      >
        <div className="grid md:grid-cols-3 divide-x divide-gray-200">
          {contactOptions.map((item, index) => (
            <div
              key={index}
              className="p-8 bg-white hover:bg-gray-50 transition-colors duration-300 relative"
            >
              {/* Vertical divider between columns using Tailwind's divide-x */}
              {index < contactOptions.length - 1 && (
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200"></div>
              )}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  {item.icon === "Mail" && <Mail className="w-7 h-7 text-gray-600" />}
                  {item.icon === "Phone" && <Phone className="w-7 h-7 text-gray-600" />}
                  {item.icon === "MessageSquare" && <MessageSquare className="w-7 h-7 text-gray-600" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <p className="font-medium text-gray-800 mb-6">{item.contact}</p>
                <button
                  onClick={() => handleContactAction(item.type || "email")}
                  className="px-6 py-2 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-800 hover:text-white transition-colors duration-200"
                >
                  {item.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}