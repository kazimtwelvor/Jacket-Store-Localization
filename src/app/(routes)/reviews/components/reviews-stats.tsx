
"use client"

import { useState, useEffect, useRef } from "react"
import { Star, ShoppingBag, Users, Trophy } from "lucide-react"

export default function ReviewsStats() {
  const [isMounted, setIsMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)

    // Simple intersection observer for animation
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  // Stats data
  const stats = [
    {
      icon: <Star className="h-6 w-6 text-yellow-400" />,
      value: "4.9/5",
      label: "Average Rating",
      color: "bg-yellow-50",
    },
    {
      icon: <ShoppingBag className="h-6 w-6 text-red-500" />,
      value: "15,000+",
      label: "Happy Customers",
      color: "bg-red-50",
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      value: "2,500+",
      label: "Verified Reviews",
      color: "bg-blue-50",
    },
    {
      icon: <Trophy className="h-6 w-6 text-green-500" />,
      value: "98%",
      label: "Satisfaction Rate",
      color: "bg-green-50",
    },
  ]

  // Static version for non-JS users
  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className={`mb-4 p-3 rounded-full ${stat.color}`}>{stat.icon}</div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
        >
          <div className="flex flex-col items-center text-center">
            <div className={`mb-4 p-3 rounded-full ${stat.color}`}>{stat.icon}</div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-gray-500 text-sm">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
