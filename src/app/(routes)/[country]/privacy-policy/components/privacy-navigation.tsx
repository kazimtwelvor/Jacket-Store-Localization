"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/src/app/ui/button"
import { useCountry } from "@/src/hooks/use-country"
import { PrivacyPolicyData } from "../data/privacy-policy-data"

interface PrivacyNavigationProps {
  policyData: PrivacyPolicyData
  activeSection: string
  onSectionClick: (sectionId: string) => void
}

export default function PrivacyNavigation({ 
  policyData, 
  activeSection, 
  onSectionClick 
}: PrivacyNavigationProps) {
  const { countryCode } = useCountry()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const sections = Object.keys(policyData.sections).map(sectionId => ({
    id: sectionId,
    title: policyData.sections[sectionId].title
  }))

  return (
    <div className="sidebar fixedsticky bg-muted p-6 rounded-lg shadow-md border border-black">
      <h2 className="text-xl font-bold mb-4 border-black">Contents</h2>
      <ul className="space-y-3">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`flex items-center p-2 rounded-md transition-colors ${
                activeSection === section.id
                  ? "bg-gray-200 text-black border-black"
                  : "hover:bg-gray-100 text-black hover:border-black"
              }`}
              onClick={(e) => {
                e.preventDefault()
                onSectionClick(section.id)
                document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#b2b2b2] mr-2"></span>
              {section.title}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-6 border-t border-black">
        <Button
          variant="blackInvert"
          size="sm"
          asChild
          className="w-full"
        >
          <Link href={`/${countryCode}/contact-us`}>Questions? Contact Us</Link>
        </Button>
      </div>
    </div>
  )
}
