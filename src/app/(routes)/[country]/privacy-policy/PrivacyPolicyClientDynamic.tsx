"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUp } from "lucide-react"
import Container from "@/src/app/ui/container"
import { Button } from "@/src/app/ui/button"
import Script from "next/script"
import { useCountry } from "@/src/hooks/use-country"
import { getPrivacyPolicyData, PrivacyPolicyData } from "./data/privacy-policy-data"
import PrivacyHero from "./components/privacy-hero"
import PrivacySection from "./components/privacy-section"
import PrivacyNavigation from "./components/privacy-navigation"

interface PrivacyPolicyClientDynamicProps {
  initialData?: PrivacyPolicyData
}

export default function PrivacyPolicyClientDynamic({ initialData }: PrivacyPolicyClientDynamicProps) {
  const { countryCode } = useCountry()
  const [activeSection, setActiveSection] = useState("information-we-collect")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  const policyData = initialData || getPrivacyPolicyData(countryCode)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const initFixedSticky = () => {
      if (window.jQuery && sidebarRef.current) {
        window.jQuery(sidebarRef.current).fixedsticky()
      }
    }

    if (window.jQuery) {
      const checkFixedStickyInterval = setInterval(() => {
        if (window.jQuery.fn.fixedsticky) {
          clearInterval(checkFixedStickyInterval)
          initFixedSticky()
        }
      }, 100)
      setTimeout(() => clearInterval(checkFixedStickyInterval), 5000)
    }

    return () => {
      // Cleanup if needed
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }

      // Update active section based on scroll position
      const sections = Object.keys(policyData.sections)
      let currentSection = sections[0]

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            currentSection = sectionId
          }
        }
      }

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [policyData.sections])

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId)
  }

  if (!mounted) {
    return null
  }

  return (
    <section className="bg-background pb-20">
      <Script src="https://code.jquery.com/jquery-3.6.0.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/fixed-sticky@0.1.7/fixedsticky.min.js" strategy="beforeInteractive" />
      
      <Container>
        <PrivacyHero policyData={policyData} />
      </Container>

      <Container>
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="lg:w-1/4">
            <div ref={sidebarRef}>
              <PrivacyNavigation
                policyData={policyData}
                activeSection={activeSection}
                onSectionClick={handleSectionClick}
              />
            </div>
          </aside>

          <div className="lg:w-3/4 mb-12">
            <div className="prose prose-lg max-w-none">
              {Object.entries(policyData.sections).map(([sectionId, section]) => (
                <PrivacySection
                  key={sectionId}
                  sectionId={sectionId}
                  section={section}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                variant="blackInvert"
                size="sm"
                className="rounded-full h-12 w-12 p-0"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Container>

      <style jsx global>{`
        /* Fixed-sticky CSS */
        @media (min-width: 43.75em) {
          .fixedsticky {
            top: 0;
          }
        }
        
        .fixedsticky {
          position: -webkit-sticky;
          position: sticky;
        }
        
        .fixedsticky-withoutfixedfixed .fixedsticky-off,
        .fixed-supported .fixedsticky-on {
          position: static;
        }
        
        .fixedsticky-withoutfixedfixed .fixedsticky-on,
        .fixed-supported .fixedsticky-on {
          position: fixed;
        }
        
        .fixedsticky-dummy {
          display: none;
        }
        
        .fixedsticky-on + .fixedsticky-dummy {
          display: block;
        }
      `}</style>
    </section>
  )
}

declare global {
  interface JQuery {
    fixedsticky: () => JQuery
  }

  interface Window {
    jQuery: any
  }
}
