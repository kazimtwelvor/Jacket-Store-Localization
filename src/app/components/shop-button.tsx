"use client"

import Link from "next/link"
import { FaArrowRight } from "react-icons/fa"
import { avertaBold } from "@/src/lib/fonts"
import { cn } from "@/src/app/lib/utils"

interface ShopButtonProps {
  variant?: "filled" | "bordered"
  href: string
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
  showArrow?: boolean
  ariaLabel?: string
  as?: "link" | "div"
}

export default function ShopButton({
  variant = "filled",
  href,
  children,
  className,
  size = "md",
  showArrow = false,
  ariaLabel,
  as = "link"
}: ShopButtonProps) {
  const sizeClasses = {
    sm: "py-1 px-3 md:py-1 md:px-3 lg:py-2 lg:px-6",
    md: "py-2 px-4",
    lg: "py-4 px-8 md:px-10 text-sm md:text-base"
  }

  const baseClasses = cn(
    "font-bold uppercase transition-all duration-300 inline-flex items-center",
    sizeClasses[size],
    className
  )

  const filledClasses = cn(
    baseClasses,
    "relative overflow-hidden bg-[#2b2b2b] text-white hover:shadow-lg hover:scale-105 hover:bg-[#1a1a1a] active:scale-95 group cursor-pointer"
  )

  const borderedClasses = cn(
    baseClasses,
    "group/button cursor-pointer bg-[#2b2b2b] border-b border border- text-white hover:bg-[#2b2b2b] transition-colors duration-300"
  )

  const buttonClasses = variant === "filled" ? filledClasses : borderedClasses

  if (as === "link") {
    return (
      <Link href={href} aria-label={ariaLabel}>
        <div className={buttonClasses}>
          <span className="relative z-10">{children}</span>
          {variant === "filled" && (
            <div className="absolute inset-0 w-0 bg-[#1a1a1a] transition-all duration-300 group-hover:w-full"></div>
          )}
          {showArrow && (
            <FaArrowRight className="hidden lg:block ml-2 opacity-0 group-hover:opacity-100 transition-all duration-400 transform group-hover:translate-x-1" />
          )}
        </div>
      </Link>
    )
  }

  return (
    <div className={buttonClasses} role="link" aria-label={ariaLabel}>
      <span className="relative z-10">{children}</span>
      {variant === "filled" && (
        <div className="absolute inset-0 w-0 bg-[#1a1a1a] transition-all duration-300 group-hover:w-full"></div>
      )}
      {showArrow && (
        <FaArrowRight className="hidden lg:block ml-2 opacity-0 group-hover:opacity-100 transition-all duration-400 transform group-hover:translate-x-1" />
      )}
    </div>
  )
}
