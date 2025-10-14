"use client"

import type { ReactNode } from "react"

interface FAQCategoryProps {
  category: string
  label: string
  active?: boolean
  onClick?: () => void
  icon?: ReactNode
}

export default function FAQCategory({ category, label, active = false, onClick, icon }: FAQCategoryProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center px-4 py-3 rounded-lg min-w-[100px] transition-all duration-200
        ${
          active
            ? "bg-[#eaeaea] text-black hover:bg-[#2b2b2b] hover:text-white shadow-md"
            : "bg-[#eaeaea] text-black border border-black hover:border-[#2b2b2b] hover:bg-[#2b2b2b] hover:text-white"
        }
      `}
    >
      {icon && <div className="mb-2">{icon}</div>}
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}
