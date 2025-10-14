"use client"

import { LucideStar } from "lucide-react"

interface StarProps {
  filled?: boolean
  size?: number
  className?: string
}

export default function Star({ filled = true, size = 4, className = "" }: StarProps) {
  return (
    <LucideStar
      className={`h-${size} w-${size} ${filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} ${className}`}
    />
  )
}
