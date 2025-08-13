"use client"

import { useState, useEffect } from "react"
import { useSizeGuideContext } from "./size-guide-context"

export default function SizeGuideUnitToggle() {
  const { unit, setUnit } = useSizeGuideContext()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex items-center space-x-2 bg-secondary rounded-full p-1">
        <span className="px-3 py-1 rounded-full text-sm bg-[#2b2b2b] text-white">Inches</span>
        <span className="px-3 py-1 rounded-full text-sm hover:bg-secondary/80">Centimeters</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 bg-secondary rounded-full p-1">
      <button
        type="button"
        onClick={() => setUnit("in")}
        className={`px-3 py-1 rounded-full text-sm ${
          unit === "in" ? "bg-[#2b2b2b] text-white" : "hover:bg-secondary/80"
        }`}
      >
        Inches
      </button>
      <button
        type="button"
        onClick={() => setUnit("cm")}
        className={`px-3 py-1 rounded-full text-sm ${
          unit === "cm" ? "bg-[#2b2b2b] text-white" : "hover:bg-secondary/80"
        }`}
      >
        Centimeters
      </button>
    </div>
  )
}
