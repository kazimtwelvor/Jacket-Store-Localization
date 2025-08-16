"use client"

import { useEffect, useState } from "react"
import SizeGuideProvider from "./size-guide-provider"
import SizeGuideHero from "./size-guide-hero"
import SizeGuideNav from "./size-guide-nav"
import SizeGuideTabs from "./size-guide-tabs"
import SizeChart from "./size-chart"
import MeasurementGuide from "./measurement-guide"
import SizeConversion from "./size-conversion"
import FitGuide from "./fit-guide"
import InteractiveModel from "./interactive-model"
import SizeFAQ from "./size-faq"
import SizeGuideCTA from "./size-guide-cta"
import SizeGuideContextProvider from "./size-guide-context"

export default function SizeGuideClient() {
  const [isMounted, setIsMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("size-charts")
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (div: string) => {
    setActiveSection(div)
    const element = document.getElementById(div)
    if (element) {
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <SizeGuideContextProvider>
      <SizeGuideProvider>
        <section className="bg-background min-h-screen">
          <SizeGuideHero />
          <div
            className={`sticky top-0 z-10 bg-background/80 backdrop-blur-md transition-all duration-300 ${scrollY > 300 ? "shadow-md" : ""
              }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SizeGuideNav activeSection={activeSection} onNavClick={handleNavClick} />
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <SizeGuideTabs activeTab={activeSection} onTabChange={setActiveSection} />
            <div className="space-y-24 mt-16">
              <div id="size-charts">
                <SizeChart />
              </div>
              <div id="measurement-guide">
                <MeasurementGuide />
              </div>
              <div id="size-conversion">
                <SizeConversion />
              </div>
              <div id="fit-guide">
                <FitGuide />
              </div>
              <div id="interactive-model">
                <InteractiveModel />
              </div>
              <div id="faq">
                <SizeFAQ />
              </div>
            </div>
          </div>
          <SizeGuideCTA />
        </section>
      </SizeGuideProvider>
    </SizeGuideContextProvider>
  )
}
