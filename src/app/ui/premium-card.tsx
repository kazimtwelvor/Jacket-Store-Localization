
"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface PremiumCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: boolean
  index?: number
}

export default function PremiumCard({ children, className, hoverEffect = true, index = 0 }: PremiumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300",
        hoverEffect && "hover:shadow-xl",
        className,
      )}
    >
      {/* Premium accent elements */}
      <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-[#B01E23]/5 to-transparent rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-[#B01E23]/5 to-transparent rounded-tl-full"></div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#B01E23]/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

      {children}
    </motion.div>
  )
}
