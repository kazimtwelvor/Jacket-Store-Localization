"use client"

import type React from "react"
import { cn } from "../lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  backgroundColor?: string
}

export const Container: React.FC<ContainerProps> = ({ children, className, backgroundColor }) => {
  return (
    <div
      className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}
      style={{ backgroundColor: backgroundColor }}
    >
      {children}
    </div>
  )
}

// Add default export
export default Container
