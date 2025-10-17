"use client"

import { motion } from "framer-motion"
import { PrivacySection as PrivacySectionType } from "../data/privacy-policy-data"

interface PrivacySectionProps {
  section: PrivacySectionType
  sectionId: string
}

export default function PrivacySection({ section, sectionId }: PrivacySectionProps) {
  return (
    <motion.div
      id={sectionId}
      className="scroll-mt-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md mb-8 border border-black hover:shadow-lg transition-shadow">
        <h3 className="text-2xl font-bold mb-4 border-black">{section.title}</h3>
        
        {/* Main content */}
        {section.content.map((paragraph, index) => (
          <p key={index} className="text-gray-600 mb-4">
            {paragraph}
          </p>
        ))}
        
        {/* Subsections */}
        {section.subsections && section.subsections.map((subsection, index) => (
          <div key={index} className="mt-6">
            <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-800">
              {subsection.title}
            </h4>
            
            {subsection.content.map((paragraph, pIndex) => (
              <p key={pIndex} className="text-gray-600 mb-4">
                {paragraph}
              </p>
            ))}
            
            {subsection.listItems && (
              <ul className="list-disc pl-6 mt-2 mb-4 text-gray-600">
                {subsection.listItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
