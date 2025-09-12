"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReviewCard from "./review-card"
import type { Review } from "../data/reviews-data"

interface ReviewsGridProps {
  reviews: Review[]
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
}

export default function ReviewsGrid({ reviews, currentPage, totalPages, setCurrentPage }: ReviewsGridProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Static version for non-JS users
  if (!isMounted) {
    return (
      <div className="reviews-content">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
          {reviews.map((review) => (
            <div key={review.id} className="h-full">
              <ReviewCard review={review} index={0} />
            </div>
          ))}
        </div>

        {/* Static Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-16 gap-2">
            <button
              disabled={currentPage === 1}
              className="h-10 w-10 rounded-full border border-black flex items-center justify-center"
            >
              ←
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  currentPage === index + 1 ? "bg-[#eaeaea] text-black" : "border border-black"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              className="h-10 w-10 rounded-full border border-black flex items-center justify-center"
            >
              →
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="reviews-content">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
        {reviews.map((review, index) => (
          <div key={review.id} className="h-full">
            <ReviewCard review={review} index={index} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-16 gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="h-10 w-10 rounded-full border-black-200 hover:border-black hover:bg-[#eaeaea] transition-colors duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "default" : "outline"}
              size="icon"
              onClick={() => setCurrentPage(index + 1)}
              className={`h-10 w-10 rounded-full ${
                currentPage === index + 1
                  ? "bg-[#eaeaea] hover:bg-[#2b2b2b]"
                  : "border-black hover:border-black hover:bg-[#eaeaea]"
              } transition-colors duration-200`}
            >
              {index + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="h-10 w-10 rounded-full border-black-200 hover:border-black-500 hover:bg-[#eaeaea] transition-colors duration-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
