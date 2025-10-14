"use client"

import { useEffect, useState } from "react"

export function BgGridPattern() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Non-JavaScript fallback
  if (!isMounted) {
    return (
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, #f6f6f6 1px, transparent 1px), linear-gradient(to bottom, #eaeaea 1px, transparent 1px)`,
          backgroundSize: `40px 40px`,
        }}
      />
    )
  }

  // Enhanced version with JavaScript
  return (
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `linear-gradient(to right, #eaeaea 1px, transparent 1px), linear-gradient(to bottom, #f6f6f6 1px, transparent 1px)`,
        backgroundSize: `40px 40px`,
      }}
    />
  )
}
