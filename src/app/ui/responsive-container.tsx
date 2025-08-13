"use client"

import type React from "react"

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
}

export default function ResponsiveContainer({ children, className }: ResponsiveContainerProps) {
  return (
    <div className={`w-full ${className || ''}`}>
      {children}
    </div>
  )
}
