"use client"

import { useState, useEffect } from "react"
import { Star, ChevronDown } from "lucide-react"
import { Button } from "@/src/app/ui/button"

export default function ReviewsHero() {
  const [isMounted, setIsMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Simple animation trigger after mount
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const scrollToContent = () => {
    const element = document.getElementById("reviews-content")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Static version for non-JS users
  if (!isMounted) {
    return (
      <div className="relative flex flex-col items-center justify-center bg-[#eaeaea] text-black py-20">
        <div className="text-center px-4 pt-10 pb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Reviews</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            See what our customers are saying about their experience with us.
          </p>
          <div className="flex justify-center items-center gap-2 my-8">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <span key={i} className="text-yellow-400 text-2xl">
                ★
              </span>
            ))}
          </div>
          <p className="text-white/80 text-lg">Based on 2,500+ verified customer reviews</p>
          <div className="mt-10">
            <a
              href="#reviews"
              className="inline-block px-6 py-2 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20"
            >
              See Reviews ↓
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center justify-center bg-[#2b2b2b] text-white py-20">
      <div className="text-center px-4 pt-10 pb-16">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 0.5s, transform 0.5s",
          }}
        >
          Customer Reviews
        </h1>
        <p
          className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 0.5s, transform 0.5s",
            transitionDelay: "0.1s",
          }}
        >
          See what our customers are saying about their experience with us.
        </p>
        <div
          className="flex justify-center items-center gap-2 my-8"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s",
            transitionDelay: "0.2s",
          }}
        >
          {[1, 2, 3, 4, 5].map((_, i) => (
            <Star key={i} className="h-8 w-8 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
        <p
          className="text-white/80 text-lg"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s",
            transitionDelay: "0.3s",
          }}
        >
          Based on 2,500+ verified customer reviews
        </p>
        <div
          className="mt-10"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s",
            transitionDelay: "0.4s",
          }}
        >
          <Button
            onClick={scrollToContent}
            id="see-reviews-button"
            variant="outline"
            className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
          >
            See Reviews
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
