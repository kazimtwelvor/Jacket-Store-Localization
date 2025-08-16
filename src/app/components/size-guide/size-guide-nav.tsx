"use client"

interface SizeGuideNavProps {
  activeSection: string
  onNavClick: (section: string) => void
}

export default function SizeGuideNav({ activeSection, onNavClick }: SizeGuideNavProps) {
  const navItems = [
    { id: "size-charts", label: "Size Charts" },
    { id: "measurement-guide", label: "How to Measure" },
    { id: "size-conversion", label: "Size Conversion" },
    { id: "fit-guide", label: "Fit Guide" },
    { id: "interactive-model", label: "Interactive Model" },
    { id: "faq", label: "FAQ" },
  ]

  return (
    <nav className="py-3">
      <div className="flex overflow-x-auto scrollbar-hide space-x-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavClick(item.id)}
            className={`whitespace-nowrap text-sm font-medium relative py-2 transition-colors ${
              activeSection === item.id ? "text-[#2b2b2b]" : "text-[#666666] hover:text-[#333333]"
            }`}
          >
            {item.label}
            {activeSection === item.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>}
          </button>
        ))}
      </div>
    </nav>
  )
}
