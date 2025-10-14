
"use client"

import { useState, useEffect } from "react"

interface ReviewsFilterProps {
  categories: string[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export default function ReviewsFilter({ categories, selectedCategory, setSelectedCategory }: ReviewsFilterProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Static version for non-JS users
  if (!isMounted) {
    return (
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button className="rounded-full px-6 bg-[#eaeaea] text-black py-2">All Reviews</button>
        {categories.map((category) => (
          <button key={category} className="rounded-full px-6 border border-gray-200 py-2">
            {category}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      <button
        onClick={() => setSelectedCategory("all")}
        className={`rounded-full px-6 py-2 transition-colors duration-200 ${
          selectedCategory === "all" ? "bg-[#eaeaea] text-black" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All Reviews
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`rounded-full px-6 py-2 transition-colors duration-200 ${
            selectedCategory === category ? "bg-[#eaeaea] text-black" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
