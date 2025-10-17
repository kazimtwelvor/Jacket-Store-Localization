"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Menu, X, Check } from "lucide-react"

import { TermsData } from "../data/terms-data-by-country"

interface TermsNavigationProps {
  termsData: TermsData
  activeSection: string
  completedSections: string[]
  scrollToSection: (sectionId: string) => void
}

export default function TermsNavigation({
  termsData,
  activeSection,
  completedSections,
  scrollToSection,
}: TermsNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Calculate completion percentage - exactly 7% per section
  const completedCount = completedSections.length
  const totalSections = Object.keys(termsData.sections).length
  const completionPercentage = completedCount >= totalSections ? 100 : completedCount * 7

  // Close mobile drawer when section is selected
  const handleSectionClick = (sectionId: string) => {
    scrollToSection(sectionId)
    setIsOpen(false)
  }

  if (!isMounted) {
    return null // Return nothing during SSR to prevent hydration mismatch
  }

  return (
    <>
      {/* Mobile Navigation Toggle */}
      {/* <div className="fixed bottom-16 right-4 lg:hidden z-30">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white text-white p-3 rounded-full shadow-lg hover:bg-white transition-colors"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div> */}

      {/* Mobile Navigation Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? "0%" : "100%" }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-xl z-40 lg:hidden overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-[#2b2b2b]">Table of Contents</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-white"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5 text-black" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-black">Completion</span>
              <span className="text-sm font-mediumtext-[#2b2b2b]">{completionPercentage}%</span>
            </div>
            <div className="h-2 bg-[#2b2b2b]  rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>

          <nav>
            <ul className="space-y-1">
              {Object.entries(termsData.sections).map(([sectionId, section]) => {
                const isCompleted = completedSections.includes(sectionId)
                const isActive = activeSection === sectionId

                return (
                  <li key={sectionId}>
                    <button
                      onClick={() => handleSectionClick(sectionId)}
                      className={`w-full text-left p-3 rounded-md flex items-center ${
                        isActive
                          ? "bg-white text-[#2b2b2b] font-medium"
                          : "hover:bg-white transition-colors text-[#2b2b2b]"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full mr-3 flex items-center justify-center flex-shrink-0 ${
                          isCompleted ? "bg-green-500" : isActive ? "bg-white" : "bg-white"
                        }`}
                      >
                        {isCompleted && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span>{section.title}</span>
                      {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </motion.div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-1/4 self-start sticky top-24">
        <div className="bg-white rounded-lg shadow-sm border border-[#2b2b2b] p-6">
          <span className="text-xl font-bold mb-4 text-[#2b2b2b]">Table of Contents</span>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-mediumtext-[#2b2b2b]">Completion</span>
              <span className="text-sm font-mediumtext-[#2b2b2b]">{completionPercentage}%</span>
            </div>
            <div className="h-2 bg-[2b2b2b] rounded-full overflow-hidden">
              <div className="h-full bg-[2b2b2b] rounded-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>

          <nav>
            <ul className="space-y-1">
              {Object.entries(termsData.sections).map(([sectionId, section]) => {
                const isCompleted = completedSections.includes(sectionId)
                const isActive = activeSection === sectionId

                return (
                  <li key={sectionId}>
                    <button
                      onClick={() => scrollToSection(sectionId)}
                      className={`w-full text-left p-3 rounded-md flex items-center ${
                        isActive
                          ? "bg-[#eaeaea] text-[#2b2b2b] font-mediumm"
                          : "hover:bg-white/30 transition-colors  text-[#2b2b2b]"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full mr-3 flex items-center justify-center flex-shrink-0 ${
                          isCompleted ? "bg-green-500" : isActive ? "bg-white" : "bg-white"
                        }`}
                      >
                        {isCompleted && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span>{section.title}</span>
                      {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
