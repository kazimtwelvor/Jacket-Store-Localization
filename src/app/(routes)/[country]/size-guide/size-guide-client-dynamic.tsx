"use client"

import { useEffect, useState, useRef } from "react"
import SizeGuideHeroDynamic from "./components/size-guide-hero-dynamic"
import { BgGridPattern } from "@/src/app/components/bg-grid-pattern"
import SizeGuideNav from "@/src/app/components/size-guide/size-guide-nav"
import SizeChart from "@/src/app/components/size-guide/size-chart"
import MeasurementGuide from "@/src/app/components/size-guide/measurement-guide"
import SizeConversion from "@/src/app/components/size-guide/size-conversion"
import FitGuide from "@/src/app/components/size-guide/fit-guide"
import InteractiveModel from "@/src/app/components/size-guide/interactive-model"
import SizeFAQ from "@/src/app/components/size-guide/size-faq"
import SizeGuideCTA from "@/src/app/components/size-guide/size-guide-cta"
import { useCountry } from "@/src/hooks/use-country"
import { getSizeGuideData, SizeGuideData } from "./data/size-guide-data-by-country"

interface SizeGuideClientDynamicProps {
  initialData?: SizeGuideData
}

export default function SizeGuideClientDynamic({ initialData }: SizeGuideClientDynamicProps) {
  const [activeSection, setActiveSection] = useState("size-charts")
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const { countryCode } = useCountry()

  const sizeGuideData = initialData || getSizeGuideData(countryCode)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      if (contentRef.current) {
        const contentStart = contentRef.current.offsetTop
        const contentHeight = contentRef.current.scrollHeight
        const viewportHeight = window.innerHeight
        const scrollPosition = window.scrollY

        const scrolled = scrollPosition - contentStart + viewportHeight / 2

        const progress = Math.min(Math.max((scrolled / contentHeight) * 100, 0), 100)

        setScrollProgress(progress)
      }

      const sections = document.querySelectorAll("div[id]")
      let currentSection = activeSection

      sections.forEach((div) => {
        const sectionTop = div.getBoundingClientRect().top
        if (sectionTop < 200) {
          currentSection = div.id
        }
      })

      if (currentSection !== activeSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [activeSection])

  const handleNavClick = (div: string) => {
    setActiveSection(div)
    const element = document.getElementById(div)
    if (element) {
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  return (
    <section className="bg-white min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#2b2b2b] via-white to-[#2b2b2b]">
        <BgGridPattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <SizeGuideHeroDynamic sizeGuideData={sizeGuideData} />
        </div>
      </div>
      <div
        className={`sticky top-0 z-10 bg-white/90 backdrop-blur-md transition-all duration-300 ${
          scrollY > 300 ? "shadow-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SizeGuideNav activeSection={activeSection} onNavClick={handleNavClick} />

          <div className="h-1 w-full bg-[#EAEAEA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2b2b2b] transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress}%` }}
              role="progressbar"
              aria-valuenow={scrollProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Reading progress"
            />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" ref={contentRef}>
        <div className="space-y-24 mt-8">
          <div id="size-charts" className="scroll-mt-32">
            <SizeChart sizeChartData={sizeGuideData.sizeCharts} />
          </div>
          <div id="measurement-guide" className="scroll-mt-32">
            <MeasurementGuide measurementGuideData={sizeGuideData.measurementGuide} />
          </div>
          <div id="size-conversion" className="scroll-mt-32">
            <SizeConversion sizeConversionData={sizeGuideData.sizeConversion} />
          </div>
          <div id="fit-guide" className="scroll-mt-32">
            <FitGuide fitGuideData={sizeGuideData.fitGuide} />
          </div>
          <div id="interactive-model" className="scroll-mt-32">
            <InteractiveModel interactiveModelData={sizeGuideData.interactiveModel} />
          </div>
          <div id="faq" className="scroll-mt-32">
            <SizeFAQ faqData={sizeGuideData.faq} />
          </div>
        </div>
      </div>
      <SizeGuideCTA ctaData={sizeGuideData.cta} />
    </section>
  )
}
