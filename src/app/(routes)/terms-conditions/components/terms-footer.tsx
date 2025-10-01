"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { FileText, Shield, HelpCircle } from "lucide-react"

export default function TermsFooter() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Non-JavaScript fallback
  if (!isMounted) {
    return (
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/privacy-policy" className="block">
          <div className="bg-white p-6 rounded-lg border shadow-sm hover:border-primary/20 h-full">
            <div className="flex items-center mb-3">
              <div className="h-5 w-5 mr-2 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="font-semibold">Privacy Policy</h3>
            </div>
            <p className="text-sm text-slate-600">Learn how we collect, use, and protect your personal information.</p>
          </div>
        </Link>

        <Link href="/us/faqs" className="block">
          <div className="bg-white p-6 rounded-lg border shadow-sm hover:border-primary/20 h-full">
            <div className="flex items-center mb-3">
              <div className="h-5 w-5 mr-2 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3 className="font-semibold">FAQs</h3>
            </div>
            <p className="text-sm text-slate-600">Find answers to frequently asked questions about our services.</p>
          </div>
        </Link>

        <Link href="/us/contact-us" className="block">
          <div className="bg-white p-6 rounded-lg border shadow-sm hover:border-primary/20 h-full">
            <div className="flex items-center mb-3">
              <div className="h-5 w-5 mr-2 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3 className="font-semibold">Contact Support</h3>
            </div>
            <p className="text-sm text-slate-600">
              Need help understanding our terms? Our support team is here to help.
            </p>
          </div>
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <Link href="/privacy-policy" className="block">
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(176, 30, 35, 0.1)" }}
          transition={{ duration: 0.2 }}
          className="bg-white p-6 rounded-lg border border-[#2b2b2b] shadow-sm hover:border-[#2b2b2b]/20 h-full"
        >
          <div className="flex items-center mb-3">
            <Shield className="h-5 w-5 mr-2 text-[#2b2b2b]" />
            <h3 className="font-semibold text-[#333333]">Privacy Policy</h3>
          </div>
          <p className="text-sm text-[#666666]">Learn how we collect, use, and protect your personal information.</p>
        </motion.div>
      </Link>

      <Link href="/us/faqs" className="block">
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(176, 30, 35, 0.1)" }}
          transition={{ duration: 0.2 }}
          className="bg-white p-6 rounded-lg border border-[#2b2b2b] shadow-sm hover:border-[#2b2b2b]/20 h-full"
        >
          <div className="flex items-center mb-3">
            <HelpCircle className="h-5 w-5 mr-2 text-[#2b2b2b]" />
            <h3 className="font-semibold text-[#333333]">FAQs</h3>
          </div>
          <p className="text-sm text-[#666666]">Find answers to frequently asked questions about our services.</p>
        </motion.div>
      </Link>

      <Link href="/us/contact-us" className="block">
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(176, 30, 35, 0.1)" }}
          transition={{ duration: 0.2 }}
          className="bg-white p-6 rounded-lg border border-[#2b2b2b] shadow-sm hover:border-[#2b2b2b]/20 h-full"
        >
          <div className="flex items-center mb-3">
            <FileText className="h-5 w-5 mr-2 text-[#2b2b2b]" />
            <h3 className="font-semibold text-[#333333]">Contact Support</h3>
          </div>
          <p className="text-sm text-[#666666]">Need help understanding our terms? Our support team is here to help.</p>
        </motion.div>
      </Link>
    </motion.div>
  )
}
