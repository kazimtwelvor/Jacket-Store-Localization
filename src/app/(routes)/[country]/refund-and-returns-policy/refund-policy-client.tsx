"use client"

import { useState, useEffect } from "react"
import PolicyHero from "./components/policy-hero"
import PolicyEligibility from "./components/policy-eligibility"
import PolicyProcess from "./components/policy-process"
import PolicyTimeline from "./components/policy-timeline"
import PolicyExceptions from "./components/policy-exceptions"
import PolicyFAQ from "./components/policy-faq"
import PolicyContact from "./components/policy-contact"
import { BgGridPattern } from "./components/bg-grid-pattern"

export default function RefundPolicyClient() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="bg-white min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#2b2b2b] via-white to-[#2b2b2b]">
        <BgGridPattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <PolicyHero />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-16">
            <PolicyEligibility />
            <PolicyProcess />
            <PolicyTimeline />
            <PolicyExceptions />
          </div>

          <div className="space-y-8">
            <div className="lg:sticky lg:top-24">
              <PolicyFAQ />
              <PolicyContact />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
