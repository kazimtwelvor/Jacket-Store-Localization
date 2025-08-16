"use client"

import { useEffect, useState } from "react"
import Container from "@/components/ui/container"
import { HelpCircle } from "lucide-react"

export default function FAQHero() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="bg-[#eaeaea] pt-24 pb-16 mb-8 border-b border-black">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4 flex justify-center">
            
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">Frequently Asked Questions</h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>
        </div>
      </Container>
    </div>
  )
}
