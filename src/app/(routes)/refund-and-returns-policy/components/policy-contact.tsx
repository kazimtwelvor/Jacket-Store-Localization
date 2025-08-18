"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, MessageSquare, Phone } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PolicyContact() {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleContactAction = (type: "email" | "phone" | "chat") => {
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
    }
  }

  if (!isMounted) {
    return (
      <div className="mt-8 bg-white rounded-xl border border-[#2b2b2b] shadow-sm overflow-hidden">
        <div className="bg-[#2b2b2b] p-4 border-b border-[#2b2b2b]">
          <h3 className="font-semibold text-[#2b2b2b]">Need Help?</h3>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-sm text-[#666666]">
            If you have any questions about our return policy or need assistance with a return, our customer service
            team is here to help.
          </p>

          <div className="space-y-3 pt-2">
            <a
              href="mailto:support@fashionstore.com"
              className="flex items-center p-3 rounded-lg border border-[#2b2b2b] hover:border-[#2b2b2b] transition-colors"
            >
              <span className="h-5 w-5 text-[#2b2b2b] mr-3">✉️</span>
              <div>
                <div className="font-medium text-[#333333]">Email Support</div>
                <div className="text-sm text-[#666666]">support@fashionstore.com</div>
              </div>
            </a>

            <a
              href="tel:+18001234567"
              className="flex items-center p-3 rounded-lg border border-[#2b2b2b] hover:border-[#2b2b2b] transition-colors"
            >
              <span className="h-5 w-5 text-[#2b2b2b] mr-3">📞</span>
              <div>
                <div className="font-medium text-[#333333]">Call Us</div>
                <div className="text-sm text-[#666666]">1-800-123-4567 (Mon-Fri, 9am-6pm EST)</div>
              </div>
            </a>

            <button className="w-full flex items-center p-3 rounded-lg border border-[#2b2b2b] hover:border-[#2b2b2b] transition-colors">
              <span className="h-5 w-5 text-[#2b2b2b] mr-3">💬</span>
              <div>
                <div className="font-medium text-[#333333]">Live Chat</div>
                <div className="text-sm text-[#666666]">Available 24/7 for quick assistance</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="mt-8 bg-white rounded-xl border border-[#2b2b2b] shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="bg-[#2b2b2b] p-4 border-b border-[#2b2b2b]">
        <h3 className="font-semibold text-[#2b2b2b]">Need Help?</h3>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-sm text-[#666666]">
          If you have any questions about our return policy or need assistance with a return, our customer service team
          is here to help.
        </p>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => handleContactAction("email")}
            className="w-full flex items-center p-3 rounded-lg border border-[#2b2b2b] hover:border-[#2b2b2b] hover:bg-[#2b2b2b]/30 transition-colors"
          >
            <Mail className="h-5 w-5 text-[#2b2b2b] mr-3" />
            <div>
              <div className="font-medium text-[#333333]">Email Support</div>
              <div className="text-sm text-[#666666]">support@fashionstore.com</div>
            </div>
          </button>

          <button
            onClick={() => handleContactAction("phone")}
            className="w-full flex items-center p-3 rounded-lg border border-[#2b2b2b] hover:border-[#2b2b2b] hover:bg-[#2b2b2b]/30 transition-colors"
          >
            <Phone className="h-5 w-5 text-[#2b2b2b] mr-3" />
            <div>
              <div className="font-medium text-[#333333]">Call Us</div>
              <div className="text-sm text-[#666666]">1-800-123-4567 (Mon-Fri, 9am-6pm EST)</div>
            </div>
          </button>

          <button
            onClick={() => handleContactAction("chat")}
            className="w-full flex items-center p-3 rounded-lg border border-[#2b2b2b] hover:border-[#2b2b2b] hover:bg-[#2b2b2b]/30 transition-colors"
          >
            <MessageSquare className="h-5 w-5 text-[#2b2b2b] mr-3" />
            <div>
              <div className="font-medium text-[#333333]">Live Chat</div>
              <div className="text-sm text-[#666666]">Available 24/7 for quick assistance</div>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
