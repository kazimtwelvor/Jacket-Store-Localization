
import type { ReactNode } from "react"
import { cn } from "../../lib/utils"

interface SizeGuideCardProps {
  children: ReactNode
  className?: string
}

export default function SizeGuideCard({ children, className }: SizeGuideCardProps) {
  return <div className={cn("bg-card rounded-lg border shadow-sm overflow-hidden", className)}>{children}</div>
}
