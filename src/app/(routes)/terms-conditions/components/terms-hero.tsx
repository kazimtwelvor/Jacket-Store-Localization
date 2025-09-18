"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TermsHeroProps {
  completionPercentage?: number
}

export default function TermsHero({ completionPercentage }: TermsHeroProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Non-JavaScript fallback
  if (!isMounted) {
    return (
      <div className="relative bg-white">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'url()',
          }}
        />

        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-3xl md:text-5xl font-bold mb-4 text-black pt-8 md:pt-0">Terms & Conditions</p>
            <p className="text-lg text-[#666666] mb-8 max-w-3xl mx-auto">
              Our commitment to transparency and fairness. These terms outline our relationship and responsibilities to
              each other.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-black flex items-center">
                <div className="mr-4 bg-white p-3 rounded-full">
                  <div className="h-6 w-6 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-black">Last Updated</h3>
                  <p className="text-sm text-[#666666]">April 20, 2025</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg  flex items-center">
                <div className="mr-4 bg-[#eaeaea] p-3 rounded-full">
                  <div className="h-6 w-6 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
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
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-[#333333]">Privacy Compliant</h3>
                  <p className="text-sm text-[#666666]">GDPR & CCPA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-[#f8f8f8]">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%239C92AC" fillOpacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
        }}
      />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <p className="text-3xl md:text-5xl font-bold mb-4 text-[#2b2b2b] pt-8 md:pt-0">Terms & Conditions</p>
            <p className="text-lg text-[#666666] mb-8 max-w-3xl mx-auto">
              Our commitment to transparency and fairness. These terms outline our relationship and responsibilities to
              each other.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#2b2b2b] flex items-center">
              <div className="mr-4 bg-[#eaeaea] p-3 rounded-full">
                <div className="h-6 w-6 text-[#2b2b2b]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[#333333]">Last Updated</h3>
                <p className="text-sm text-[#666666]">April 20, 2025</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#2b2b2b] flex items-center">
              <div className="mr-4 bg-[#eaeaea] p-3 rounded-full">
                <div className="h-6 w-6 text-[#2b2b2b]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
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
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[#333333]">Privacy Compliant</h3>
                <p className="text-sm text-[#666666]">GDPR & CCPA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
