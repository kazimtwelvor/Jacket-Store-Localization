"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, MessageSquare, Phone } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ShippingContact() {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleContactAction = (type: string) => {
    switch (type) {
      case "email":
        router.push("mailto:support@fashionstore.com")
        break
      case "phone":
        router.push("tel:+18001234567")
        break
      case "chat":
        alert("Live chat would open here. This is a placeholder.")
        break
      default:
        break
    }
  }

  const contactOptions = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get a response within 24 hours",
      contact: "support@fashionstore.com",
      action: "Send Email",
      type: "email",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Available Mon-Fri, 9am-5pm EST",
      contact: "+1 (800) 123-4567",
      action: "Call Now",
      type: "phone",
    },
    {
      icon: MessageSquare,
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
          <h2 className="text-3xl md:text-4xl font-bold text-black-900 mb-4">Need Help?</h2>
          <p className="text-lg text-black-600 max-w-2xl mx-auto">
            Our customer service team is here to assist you with any shipping or delivery questions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-3">
            {contactOptions.map((item, index) => (
              <div
                key={index}
                className="p-8 bg-white border border-black-100 hover:border-black-300 transition-colors duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[#eaeaea] flex items-center justify-center mb-4"></div>
                  <h3 className="text-xl font-bold text-black-900 mb-2">{item.title}</h3>
                  <p className="text-black-600 mb-4">{item.description}</p>
                  <p className="font-medium text-black-800 mb-6">{item.contact}</p>
                  <button className="px-6 py-2 bg-[#2b2b2b] text-white rounded-md hover:bg-[#eaeaea] transition-colors duration-200">
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
        <h2 className="text-3xl md:text-4xl font-bold text-black-900 mb-4">Need Help?</h2>
        <p className="text-lg text-black-600 max-w-2xl mx-auto">
          Our customer service team is here to assist you with any shipping or delivery questions.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="grid md:grid-cols-3">
          {contactOptions.map((item, index) => (
            <div
              key={index}
              className="p-8 bg-white border border-black-100 hover:border-black-300 transition-colors duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#eaeaea] flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-black-600" />
                </div>
                <h3 className="text-xl font-bold text-black-900 mb-2">{item.title}</h3>
                <p className="text-black-600 mb-4">{item.description}</p>
                <p className="font-medium text-black-800 mb-6">{item.contact}</p>
                <button
                  onClick={() => handleContactAction(item.type)}
                  className="px-6 py-2 bg-[#EAEAEA] text-black rounded-md hover:bg-[#2B2B2B] transition-colors duration-200"
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
