"use client"

import { useState, useEffect, useRef } from "react"
import { Star, Check } from "lucide-react"

// Sample review data with proper source logos
const reviewSources = [
  {
    name: "Google",
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="text-blue-500">
        <path
          fill="currentColor"
          d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"
        />
      </svg>
    ),
    bgColor: "bg-blue-100",
    textColor: "text-blue-500",
    review: {
      name: "Emma S.",
      rating: 5,
      comment: "The quality exceeded my expectations! The fabric is soft yet durable, and the fit is perfect.",
    },
  },
  {
    name: "Trustpilot",
    logo: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-green-500"
      >
        <path
          d="M12 17L6.12 20.5L7.72 13.73L2.55 9.27L9.43 8.73L12 2.5L14.57 8.73L21.45 9.27L16.28 13.73L17.88 20.5L12 17Z"
          fill="currentColor"
        />
      </svg>
    ),
    bgColor: "bg-green-100",
    textColor: "text-green-500",
    review: {
      name: "James L.",
      rating: 5,
      comment: "Perfect fit and amazing style. I've received so many compliments wearing this.",
    },
  },
  {
    name: "Facebook",
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-indigo-500"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-500",
    review: {
      name: "Sophia T.",
      rating: 4,
      comment: "Love the design and comfort. It's become my go-to outfit for both casual and semi-formal occasions.",
    },
  },
  {
    name: "Yelp",
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#2b2b2b]"
      >
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    ),
    bgColor: "bg-black-100",
    textColor: "text-[#2b2b2b]",
    review: {
      name: "Noah C.",
      rating: 5,
      comment: "Exceeded all my expectations! This is my third purchase and I'm still impressed with the consistency.",
    },
  },
  {
    name: "Amazon",
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-yellow-600"
      >
        <path d="M15.93 11.9c-.1-.8.37-1.23.41-1.27.3-.31.52-.07.46.27-.12.7-.53.95-.87 1M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m3.53 13.78c-.26.34-1.22.83-1.86.83-2.67 0-4.67-2-4.67-4.61 0-1.54.9-2.92 2.02-3.78a4.35 4.35 0 0 1 2.68-.89c.07 0 .13 0 .2.01 1.43.05 2.45.84 2.66 1.06.35.36.62.97.62.97L16 9.78s-.25-.75-.93-1.24c-.35-.25-.75-.35-1.2-.35-.45 0-.99.1-1.44.45-.89.7-.95 1.64-.96 2.16 0 1.03.26 1.81.7 2.28.44.47.99.63 1.56.63.58 0 1.36-.17 1.82-.54.46-.36.65-.74.65-.74l.39.31c0 .01-.25.33-.51.67m-9.4-.17c-.23.48-.67.88-1.25 1.08-.31.11-.65.17-1 .17-.54 0-1.01-.15-1.32-.46-.3-.31-.45-.76-.45-1.39 0-1.25.89-1.86 2.01-1.86.26 0 .5.02.74.07v-.47c0-.49-.27-.7-.87-.7-.43 0-.87.1-1.22.29l-.25-.75c.47-.23 1.01-.35 1.55-.35 1.18 0 1.76.56 1.76 1.71v1.96c0 .48.03.84.08 1.06l-.78.64zm-.83-1.72c-.7-.06-.93.08-1.21.29-.28.21-.39.49-.39.86 0 .59.28.93.85.93.34 0 .68-.17.93-.47.03-.04.05-.08.07-.12v-1.49h-.25z" />
      </svg>
    ),
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-600",
    review: {
      name: "Sarah J.",
      rating: 5,
      comment: "Exactly what I was looking for! The color is true to the pictures and the size guide was spot on.",
    },
  },
  {
    name: "Instagram",
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-pink-500"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
    bgColor: "bg-pink-100",
    textColor: "text-pink-500",
    review: {
      name: "Michael R.",
      rating: 5,
      comment: "Stylish and durable. I've washed it multiple times and it still looks brand new.",
    },
  },
  {
    name: "Twitter",
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-400"
      >
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
      </svg>
    ),
    bgColor: "bg-blue-50",
    textColor: "text-blue-400",
    review: {
      name: "Olivia P.",
      rating: 4,
      comment: "Absolutely stunning piece! The only reason for 4 stars is that it arrived a day late.",
    },
  },
  {
    name: "YouTube",
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-black-600"
      >
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
      </svg>
    ),
    bgColor: "bg-[#eaeaea]",
    textColor: "text-black-600",
    review: {
      name: "Daniel K.",
      rating: 5,
      comment: "Great value for the price. The quality is comparable to much more expensive brands I've tried.",
    },
  },
]

export default function ReviewsGallery() {
  const [isMounted, setIsMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Static version for non-JS users
  if (!isMounted) {
    return (
      <div>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Customer Reviews</h2>
          <div className="w-20 h-1 bg-[#eaeaea]  mx-auto mb-4"></div>
          <p className="text-black-600 max-w-2xl mx-auto">See what our customers are saying across the web</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reviewSources.map((source, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-[280px] relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-3">
                <div className={`${source.bgColor} rounded-full p-2 mr-2 flex items-center justify-center`}>
                  {source.logo}
                </div>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${source.textColor}`}>{source.name}</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex mb-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className={i < source.review.rating ? "text-yellow-400" : "text-black-300"}>
                        ★
                      </span>
                    ))}
                </div>
                <h3 className="font-bold text-black-800 text-lg">{source.review.name}</h3>
              </div>

              <p className="text-black-600 text-sm line-clamp-6">{source.review.comment}</p>

              <div className="absolute bottom-0 right-0 bg-green-50 px-2 py-1 rounded-tl-lg">
                <div className="flex items-center text-xs text-green-600">
                  <Check className="h-3 w-3 mr-1" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // JavaScript version - NO ANIMATIONS on initial load, only hover effects
  return (
    <div ref={ref}>
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Reviews From Other Sources</h2>
        <div className="w-20 h-1 bg-[#eaeaea]  mx-auto mb-4"></div>
        <p className="text-black-600 max-w-2xl mx-auto">See what our customers are saying across the web</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {reviewSources.map((source, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-[280px] relative overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex justify-between items-center mb-3">
              <div className={`${source.bgColor} rounded-full p-2 mr-2 flex items-center justify-center`}>
                {source.logo}
              </div>
              <div className="flex items-center">
                <span className={`text-sm font-medium ${source.textColor}`}>{source.name}</span>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex mb-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < source.review.rating ? "text-yellow-400 fill-yellow-400" : "text-black-300"
                      }`}
                    />
                  ))}
              </div>
              <h3 className="font-bold text-black-800 text-lg">{source.review.name}</h3>
            </div>

            <p className="text-black-600 text-sm line-clamp-6">{source.review.comment}</p>

            <div className="absolute bottom-0 right-0 bg-green-50 px-2 py-1 rounded-tl-lg">
              <div className="flex items-center text-xs text-green-600">
                <Check className="h-3 w-3 mr-1" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
