"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Star, ThumbsUp, MessageCircle } from "lucide-react"
import type { Review } from "../data/reviews-data"

interface ReviewCardProps {
  review: Review
  index: number
}

export default function ReviewCard({ review, index }: ReviewCardProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [liked, setLiked] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Truncate text if needed
  const needsTruncation = review.comment.length > 150
  const truncatedText = needsTruncation && !isExpanded ? `${review.comment.substring(0, 150)}...` : review.comment

  // Static version for non-JS users
  if (!isMounted) {
    return (
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm h-full">
        <div className="h-48 overflow-hidden">
          <img
            src={
              review.image ||
              `/placeholder.svg?height=300&width=400&query=product review for ${review.productName || "fashion item"}`
            }
            alt={`Product reviewed by ${review.name}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-5 flex flex-col h-[calc(100%-192px)]">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {review.avatar ? (
                  <img
                    src={review.avatar || "/placeholder.svg?height=40&width=40&query=avatar"}
                    alt={review.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#eaeaea] text-[#2b2b2b] font-bold">
                    {review.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-black-900">{review.name}</h3>
                <p className="text-xs text-black-500">{review.date}</p>
              </div>
            </div>
            <div className="flex">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <span key={i} className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-black-300"}`}>
                    ★
                  </span>
                ))}
            </div>
          </div>
          <h4 className="font-bold text-lg mb-2">{review.title}</h4>
          <p className="text-black-600 text-sm mb-4 flex-grow">{truncatedText}</p>
          {review.productName && (
            <div className="bg-gray-50 p-2 rounded-md text-xs text-black-500 mb-4 border border-gray-100">
              <span className="font-medium text-black-700">Purchased:</span> {review.productName}
            </div>
          )}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
            <button className="flex items-center gap-1 text-xs text-black-500">
              <span>👍</span>
              <span>{review.likes} Helpful</span>
            </button>
            <div className="flex items-center gap-1 text-xs text-black-500">
              <span>💬</span>
              <span>{review.replies} Replies</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 h-full flex flex-col"
    >
      <div className="h-48 overflow-hidden">
        <Image
          src={
            review.image ||
            `/placeholder.svg?height=300&width=400&query=product review for ${review.productName || "fashion item"}`
          }
          alt={`Product reviewed by ${review.name}`}
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {review.avatar ? (
                <Image
                  src={review.avatar || "/placeholder.svg?height=40&width=40&query=avatar"}
                  alt={review.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#eaeaea] text-[#2b2b2b] font-bold">
                  {review.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-black-900">{review.name}</h3>
              <p className="text-xs text-black-500">{review.date}</p>
            </div>
          </div>
          <div className="flex">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-black-300"}`}
                />
              ))}
          </div>
        </div>
        <h4 className="font-bold text-lg mb-2">{review.title}</h4>
        <p className="text-black-600 text-sm mb-4 flex-grow">
          {truncatedText}
          {needsTruncation && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-1 text-[#2b2b2b] font-medium hover:underline focus:outline-none"
            >
              {isExpanded ? "Read less" : "Read more"}
            </button>
          )}
        </p>
        {review.productName && (
          <div className="bg-gray-50 p-2 rounded-md text-xs text-black-500 mb-4 border border-gray-100">
            <span className="font-medium text-black-700">Purchased:</span> {review.productName}
          </div>
        )}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1 text-xs ${
              liked ? "text-[#2b2b2b]" : "text-black-500"
            } hover:text-[#2b2b2b] transition-colors duration-200`}
          >
            <ThumbsUp
              className={`h-4 w-4 ${liked ? "fill-red-500" : ""} transition-transform duration-200 ${liked ? "scale-105" : ""}`}
            />
            <span>{liked ? review.likes + 1 : review.likes} Helpful</span>
          </button>
          <div className="flex items-center gap-1 text-xs text-black-500">
            <MessageCircle className="h-4 w-4" />
            <span>{review.replies} Replies</span>
          </div>
        </div>
      </div>
    </div>
  )
}
