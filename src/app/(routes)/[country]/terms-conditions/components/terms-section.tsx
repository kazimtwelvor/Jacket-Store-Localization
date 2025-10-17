"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, CheckCircle } from "lucide-react"
import type { TermsSection } from "../data/terms-data-by-country"

interface TermsSectionProps {
  sectionId: string
  section: TermsSection
  isActive: boolean
  isCompleted: boolean
  isExpanded: boolean
  toggleExpand: () => void
}

export default function TermsSection({
  sectionId,
  section,
  isActive,
  isCompleted,
  isExpanded,
  toggleExpand,
}: TermsSectionProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Non-JavaScript fallback - always expanded
  if (!isMounted) {
    return (
      <div className="border rounded-lg">
        <div className="p-4">
          <div className="flex items-center">
            <div className="h-5 w-5 rounded-full mr-2 flex-shrink-0 bg-slate-300" />
            <h3 className="text-xl font-semibold">{section.title}</h3>
          </div>
        </div>
        <div className="p-4 pt-0 border-t">
          {section.content.map((paragraph, idx) => (
            <p key={idx} className="mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}

          {section.subsections && (
            <div className="mt-6 space-y-4">
              {section.subsections.map((subsection, idx) => (
                <div key={idx}>
                  <h4 className="text-lg font-semibold mb-2">{subsection.title}</h4>
                  {subsection.content.map((paragraph, pidx) => (
                    <p key={pidx} className="mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ))}

                  {/* List items */}
                  {subsection.listItems && (
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      {subsection.listItems.map((item, lidx) => (
                        <li key={lidx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`border border-[#2b2b2b] rounded-lg transition-colors ${isActive ? "border-[#2b2b2b]/30 bg-[#eaeaea]/30" : "border-[#2b2b2b]"}`}
    >
      <motion.div className="cursor-pointer" whileHover={{ backgroundColor: "rgba(248, 240, 240, 0.2)" }}>
        <div className="p-4 flex justify-between items-center" onClick={toggleExpand}>
          <div className="flex items-center">
            {isCompleted ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <div
                className={`h-5 w-5 rounded-full mr-2 flex-shrink-0 ${isActive ? "bg-[#eaeaea]" : "bg-[#eaeaea]"}`}
              />
            )}
            <h3 className="text-xl font-semibold text-[#333333]">{section.title}</h3>
          </div>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="h-5 w-5 text-[#666666]" />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-[#2b2b2b]">
              {section.content.map((paragraph, idx) => (
                <motion.p
                  key={idx}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="mb-4 last:mb-0 text-[#333333]"
                >
                  {paragraph}
                </motion.p>
              ))}

              {section.subsections && (
                <div className="mt-6 space-y-4">
                  {section.subsections.map((subsection, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: (section.content.length + idx) * 0.1 }}
                    >
                      <h4 className="text-lg font-semibold mb-2 text-[#2b2b2b]">{subsection.title}</h4>
                      {subsection.content.map((paragraph, pidx) => (
                        <p key={pidx} className="mb-2 last:mb-0 text-[#333333]">
                          {paragraph}
                        </p>
                      ))}

                      {/* List items */}
                      {subsection.listItems && (
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-[#333333]">
                          {subsection.listItems.map((item, lidx) => (
                            <li key={lidx}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
