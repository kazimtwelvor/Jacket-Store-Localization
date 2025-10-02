"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronRight, ArrowUp } from "lucide-react"
import TermsHero from "./components/terms-hero"
import TermsSection from "./components/terms-section"
import TermsNavigation from "./components/terms-navigation"
import TermsFooter from "./components/terms-footer"
import { termsData } from "./data/terms-data"

export default function TermsConditionsClient() {
  const [activeSection, setActiveSection] = useState("introduction")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string[]>(["introduction"])
  const [sectionVisibility, setSectionVisibility] = useState<{ [key: string]: number }>({})
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const [isMounted, setIsMounted] = useState(false)
  const allSections = Object.keys(termsData)

  useEffect(() => {
    setIsMounted(true)
    const initialVisibility: { [key: string]: number } = {}
    allSections.forEach((section) => {
      initialVisibility[section] = 0
    })
    setSectionVisibility(initialVisibility)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }

      const updatedVisibility = { ...sectionVisibility }
      let currentActiveSection = activeSection

      allSections.forEach((sectionId) => {
        const ref = sectionRefs.current[sectionId]
        if (ref) {
          const rect = ref.getBoundingClientRect()
          const sectionHeight = rect.height

          const visibleTop = Math.max(0, rect.top)
          const visibleBottom = Math.min(window.innerHeight, rect.bottom)
          const visibleHeight = Math.max(0, visibleBottom - visibleTop)

          const visibilityPercentage = Math.min(100, Math.round((visibleHeight / sectionHeight) * 100))

          if (visibilityPercentage > updatedVisibility[sectionId]) {
            updatedVisibility[sectionId] = visibilityPercentage
          }

          if (rect.top <= 150 && rect.bottom > 150) {
            currentActiveSection = sectionId
          }
        }
      })

      setSectionVisibility(updatedVisibility)
      setActiveSection(currentActiveSection)

      const newCompletedSections = allSections.filter((section) => updatedVisibility[section] >= 90)

      if (
        newCompletedSections.length !== completedSections.length ||
        !newCompletedSections.every((section) => completedSections.includes(section))
      ) {
        setCompletedSections(newCompletedSections)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [completedSections, sectionVisibility, activeSection, isMounted, allSections])

  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId]
    if (section) {
      if (!expanded.includes(sectionId)) {
        setExpanded((prev) => [...prev, sectionId])
      }

      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: "smooth",
      })

      setActiveSection(sectionId)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const toggleExpand = (sectionId: string) => {
    if (expanded.includes(sectionId)) {
      setExpanded((prev) => prev.filter((id) => id !== sectionId))
    } else {
      setExpanded((prev) => [...prev, sectionId])
    }
  }

  const totalSections = allSections.length
  const completionPercentage = Math.min(100, Math.round((completedSections.length / totalSections) * 100))

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative bg-white ">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23B01E23" fillOpacity="0.2"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
            }}
          />

          <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4  text-black">Terms & Conditions</h1>
              <p className="text-lg text-black mb-8 max-w-3xl mx-auto">
                Our commitment to transparency and fairness. These terms outline our relationship and responsibilities
                to each other.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-black flex items-center">
                  <div className="mr-4 bg-[#2b2b2b] p-3 rounded-full">
                    <div className="h-6 w-6 text-black">
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
                    <span className="font-semibold  text-black">Last Updated</span>
                    <p className="text-sm text-black">April 20, 2025</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-black flex items-center">
                  <div className="mr-4 bg-[#2b2b2b] p-3 rounded-full">
                    <div className="h-6 w-6 text-black">
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
                    <span className="font-semibold  text-black">Privacy Compliant</span>
                    <p className="text-sm text-black">GDPR & CCPA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-1/4 self-start">
            <div className="bg-white rounded-lg shadow-sm border  border-[#2b2b2b] p-6">
              <span className="text-xl font-bold mb-4 text-black">Table of Contents</span>
              <nav>
                <ul className="space-y-2">
                  {Object.entries(termsData).map(([sectionId, section]) => (
                    <li key={sectionId} className="p-2 rounded-md">
                      <div className="flex items-center">
                        <div className="h-4 w-4 rounded-full mr-2 flex-shrink-0 bg-[#2b2b2b]" />
                        <a href={`#${sectionId}`} className="hover:underline  text-black">
                          {section.title}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          <div className="lg:w-3/4 w-full">
            <div className="bg-white rounded-lg shadow-sm border  border-[#2b2b2b] p-6 md:p-8">
              <div className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-bold mb-8  text-black">Terms & Conditions</h1>
                <p className="text-black mb-6">Last updated: April 20, 2025</p>

                <div className="mb-8">
                  <p className="text-[#333333]">
                    Welcome to Fineyst. These Terms & Conditions govern your use of our website, services, and products.
                    Please read these terms carefully before making a purchase or using our services.
                  </p>
                </div>

                <div className="text-center py-8">
                  <p className="text-gray-600">Loading terms and conditions...</p>
                </div>

                <div className="mt-12 p-6 border  border-[#2b2b2b] rounded-lg bg-[#f6f6f6]">
                  <h3 className="text-xl font-semibold mb-4 text-black">Agreement to Terms</h3>
                  <p className="text-[#333333]">
                    By accessing or using our services, you agree to be bound by these Terms & Conditions. If you do not
                    agree to these terms, please do not use our services or make purchases from our website.
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <Link href="/us/" className="text-black hover:underline flex items-center">
                      <span className="mr-1">→</span>
                      Return to Shopping
                    </Link>
                    <Link href="/us/contact-us" className="text-black hover:underline flex items-center">
                      <span className="mr-1">→</span>
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/us/privacy-policy" className="block">
                <div className="bg-white p-6 rounded-lg border  border-[#2b2b2b] shadow-sm hover:border-[#2b2b2b]/20 h-full">
                  <div className="flex items-center mb-3">
                    <div className="h-5 w-5 mr-2 text-black">
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
                    <span className="font-semiboldtext-black">Privacy Policy</span>
                  </div>
                  <p className="text-sm text-black">
                    Learn how we collect, use, and protect your personal information.
                  </p>
                </div>
              </Link>

              <Link href="/us/faqs" className="block">
                <div className="bg-[#f6f6f6] shadow-sm  p-6 rounded-lg border  border-[#2b2b2b] hover:border-[#2b2b2b] h-full">
                  <div className="flex items-center mb-3">
                    <div className="h-5 w-5 mr-2 text-black">
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
                    <span className="font-semiboldtext-black">FAQs</span>
                  </div>
                  <p className="text-sm text-black">
                    Find answers to frequently asked questions about our services.
                  </p>
                </div>
              </Link>

              <Link href="/us/contact-us" className="block">
                <div className="bg-white p-6 rounded-lg border  border-[#2b2b2b] shadow-sm hover:border-[#2b2b2b]/20 h-full">
                  <div className="flex items-center mb-3">
                    <div className="h-5 w-5 mr-2 text-black">
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
                    <span className="font-semiboldtext-black">Contact Support</span>
                  </div>
                  <p className="text-sm text-black">
                    Need help understanding our terms? Our support team is here to help.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <TermsHero completionPercentage={completionPercentage} />

      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        <TermsNavigation
          termsData={termsData}
          activeSection={activeSection}
          completedSections={completedSections}
          scrollToSection={scrollToSection}
        />

        <div className="lg:w-3/4 w-full">
          <div className="bg-white rounded-lg shadow-sm border  border-[#2b2b2b] p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="prose prose-slate max-w-none"
            >
              <h2 className="text-3xl font-bold mb-8text-black">Introduction</h2>
              <p className="text-black mb-6">Last updated: April 20, 2025</p>

              <div className="mb-8">
                <p className="text-[#333333]">
                  Welcome to Fineyst. These Terms & Conditions govern your use of our website, services, and products.
                  Please read these terms carefully before making a purchase or using our services.
                </p>
              </div>

              {Object.entries(termsData).map(([sectionId, section]) => (
                <div
                  key={sectionId}
                  ref={(el) => {
                    if (el) sectionRefs.current[sectionId] = el
                  }}
                  id={sectionId}
                  className="mb-8 scroll-mt-24"
                >
                  <TermsSection
                    sectionId={sectionId}
                    section={section}
                    isActive={activeSection === sectionId}
                    isCompleted={completedSections.includes(sectionId)}
                    isExpanded={expanded.includes(sectionId)}
                    toggleExpand={() => toggleExpand(sectionId)}
                  />
                </div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 p-6 border border-[#2b2b2b] rounded-lg "
              >
                <h3 className="text-xl font-semibold mb-4 text-black">Agreement to Terms</h3>
                <p className="text-[#333333]">
                  By accessing or using our services, you agree to be bound by these Terms & Conditions. If you do not
                  agree to these terms, please do not use our services or make purchases from our website.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <Link href="/us/" className="text-black hover:underline flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Return to Shopping
                  </Link>
                  <Link href="/us/contact-us" className="text-black hover:underline flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Contact Us
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <TermsFooter />
        </div>
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-[#2b2b2b] text-white p-3 rounded-full shadow-lg hover:bg-[#2b2b2b]/90 transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 w-full h-1 bg-[#2b2b2b]">
        <motion.div
          className="h-full bg-[#2b2b2b]"
          style={{ width: `${Math.min(100, completionPercentage)}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </div>
  )
}
