"use client"

interface SizeGuideTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function SizeGuideTabs({ activeTab, onTabChange }: SizeGuideTabsProps) {
  const tabs = [
    { id: "size-charts", label: "Size Charts" },
    { id: "measurement-guide", label: "How to Measure" },
    { id: "size-conversion", label: "Size Conversion" },
    { id: "fit-guide", label: "Fit Guide" },
    { id: "interactive-model", label: "Interactive Model" },
    { id: "faq", label: "FAQ" },
  ]

  return (
    <div className="border-b border-[#2b2b2b]">
      <div className="flex overflow-x-auto scrollbar-hide -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-2 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-[#2b2b2b] text-[#2b2b2b]"
                : "border-transparent text-[#666666] hover:text-[#333333] hover:border-[#2b2b2b]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
