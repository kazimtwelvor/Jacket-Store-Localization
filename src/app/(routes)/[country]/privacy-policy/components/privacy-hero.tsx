"use client"

import { motion } from "framer-motion"
import { PrivacyPolicyData } from "../data/privacy-policy-data"

interface PrivacyHeroProps {
  policyData: PrivacyPolicyData
}

export default function PrivacyHero({ policyData }: PrivacyHeroProps) {
  return (
    <motion.div
      className="max-w-3xl mx-auto text-center pt-16 mb-16"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl md:text-6xl font-bold text-[#2b2b2b] mb-6">
        {policyData.title}
      </h1>
      <p className="text-lg md:text-xl text-[#1B1B1B] mb-4">
        {policyData.description}
      </p>
      {/* <p className="text-sm text-gray-500">
        Last updated: {policyData.lastUpdated}
      </p> */}
    </motion.div>
  )
}
