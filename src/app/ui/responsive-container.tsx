"use client"

import type React from "react"

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
}

export default function ResponsiveContainer({ children, className }: ResponsiveContainerProps) {
  return (
    <div className={`container mx-auto px-4 ${className || ''}`}>
      {children}
    </div>
  )
}
