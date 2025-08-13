"use client"

import { useState, useEffect } from "react"
import ResponsiveContainer from "@/components/ui/responsive-container"
import { reviews as reviewsData, categories } from "./data/reviews-data"
import ReviewsHero from "./components/reviews-hero"
import ReviewsTestimonial from "./components/reviews-testimonial"
import ReviewsStats from "./components/reviews-stats"
import ReviewsGallery from "./components/reviews-gallery"
import ReviewsCTA from "./components/reviews-cta"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Star } from "lucide-react"
import ReviewCard from "./components/review-card"

export default function ReviewsClient() {
  const [isMounted, setIsMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [filteredReviews, setFilteredReviews] = useState(reviewsData)
  const [currentPage, setCurrentPage] = useState(1)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const reviewsPerPage = 6

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Filter reviews when category changes
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredReviews(reviewsData)
    } else {
      setFilteredReviews(reviewsData.filter((review) => review.category === selectedCategory))
    }
    setCurrentPage(1)
  }, [selectedCategory])

  // Calculate pagination
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage)
  const currentReviews = filteredReviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage)

  // Featured testimonials
  const featuredTestimonials = reviewsData.filter((review) => review.featured)

  const nextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % featuredTestimonials.length)
  }

  const prevFeatured = () => {
    setFeaturedIndex((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length)
  }

  // Static content for non-JS users - this will be in the HTML source for SEO
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white">
        {/* Static Hero */}
        <div className="relative h-[50vh] flex items-center justify-center bg-[#eaeaea] text-black">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Reviews</h1>
            <p className="text-lg md:text-xl text-black max-w-2xl mx-auto">
              See what our customers are saying about their experience with us.
            </p>
            <div className="flex justify-center items-center gap-2 my-8">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <span key={i} className="text-yellow-400 text-2xl">
                  ★
                </span>
              ))}
            </div>
            <p className="text-black/80 text-lg">Based on 2,500+ verified customer reviews</p>
          </div>
        </div>

        {/* Static Content */}
        <div className="bg-white pt-8">
          <ResponsiveContainer className="pt-8 pb-16">
            {/* Static Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-black">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-[#eaeaea]-50">
                    <span className="text-yellow-400 text-2xl">★</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">4.9/5</div>
                  <div className="text-gray-500 text-sm">Average Rating</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-black">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-[#eaeaea]">
                    <span className="text-black text-2xl">🛍️</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">15,000+</div>
                  <div className="text-gray-500 text-sm">Happy Customers</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-black">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-[#eaeaea]-50">
                    <span className="text-blue-500 text-2xl">👥</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">2,500+</div>
                  <div className="text-gray-500 text-sm">Verified Reviews</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-black">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-[#eaeaea]-50">
                    <span className="text-green-500 text-2xl">🏆</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">98%</div>
                  <div className="text-gray-500 text-sm">Satisfaction Rate</div>
                </div>
              </div>
            </div>

            {/* Static Reviews Section */}
            <div className="mt-20">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Customer Reviews</h2>
              <div className="w-20 h-1 bg-[#eaeaea] mx-auto mb-8"></div>

              {/* Static Filter */}
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                <button className="rounded-full px-6 bg-[#eaeaea] text-black py-2">All Reviews</button>
                {categories.map((category) => (
                  <button key={category} className="rounded-full px-6 border border-black py-2">
                    {category}
                  </button>
                ))}
              </div>

              {/* Static Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reviews-content">
                {reviewsData.slice(0, 6).map((review, index) => (
                  <div key={review.id} className="h-full">
                    <ReviewCard review={review} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </ResponsiveContainer>

          {/* Static Testimonial */}
          <div className="py-16 bg-[#eaeaea]">
            <ResponsiveContainer>
              <div className="bg-white rounded-xl shadow-sm p-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <p className="text-xl md:text-2xl text-gray-700 italic mb-8">
                    "The quality exceeded my expectations! The fabric is soft yet durable, and the fit is perfect."
                  </p>
                  <div className="flex justify-center mb-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i} className="text-lg text-yellow-400">
                          ★
                        </span>
                      ))}
                  </div>
                  <p className="font-bold text-lg">Emma Johnson</p>
                  <p className="text-gray-500 text-sm">Verified Customer</p>
                </div>
              </div>
            </ResponsiveContainer>
          </div>

          {/* Static Gallery */}
          <ResponsiveContainer className="py-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Customer Reviews</h2>
              <div className="w-20 h-1 bg-[#eaeaea] mx-auto mb-4"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">See what our customers are saying across the web</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {reviewsData.slice(0, 8).map((review, index) => (
                <div key={review.id} className="h-full">
                  <ReviewCard review={review} index={index} />
                </div>
              ))}
            </div>
          </ResponsiveContainer>

          {/* Static CTA */}
          <div className="py-16 bg-[#eaeaea] text-black">
            <ResponsiveContainer>
              <div className="text-center max-w-3xl mx-auto px-4">
                <h2 className="text-3xl  md:text-4xl font-bold mb-4">Share Your Experience</h2>
                <p className="text-lg text-black mb-8">
                  We value your feedback! Let us know about your experience with our products and service.
                </p>
                <a href="/contact-us" className="inline-block bg-white text-black font-bold py-3 px-8 rounded-full">
                  Write a Review
                </a>
              </div>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <ReviewsHero />

      <div className="bg-white">
        <ResponsiveContainer className="pt-8 pb-16">
          <div className="w-full">
            <ReviewsStats />
          </div>

          <section id="reviews-content" className="reviews-content py-16 bg-white">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Customer Reviews</h2>
            <div className="w-20 h-1 bg-[#eaeaea]  mx-auto mb-8"></div>

            {/* Render filter buttons immediately */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`rounded-full px-6 py-2 transition-colors duration-200 ${
                  selectedCategory === "all" ? "bg-[#eaeaea] text-black" : "bg-[#eaeaea] text-black hover:bg-[#eaeaea]-200"
                }`}
              >
                All Reviews
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 py-2 transition-colors duration-200 ${
                    selectedCategory === category
                      ? "bg-[#eaeaea] text-black"
                      : "bg-[#eaeaea]-100 text-black hover:bg-[#eaeaea]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Render reviews grid immediately */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentReviews.map((review, index) => (
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
                  className="h-10 w-10 rounded-full border-black hover:border-black hover:bg-[#eaeaea] transition-colors duration-200"
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
                  className="h-10 w-10 rounded-full border-black hover:border-black hover:bg-[#eaeaea] transition-colors duration-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </section>
        </ResponsiveContainer>

        <div className="py-16 bg-[#eaeaea]">
          <ResponsiveContainer>
            <ReviewsTestimonial
              testimonial={{...featuredTestimonials[featuredIndex], featured: true}}
              onNext={nextFeatured}
              onPrev={prevFeatured}
              totalTestimonials={featuredTestimonials.length}
              currentIndex={featuredIndex}
            />
          </ResponsiveContainer>
        </div>

        <ResponsiveContainer className="py-16">
          <ReviewsGallery />
        </ResponsiveContainer>

        <section className="py-16 bg-[#eaeaea]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Reviews from Other Sources</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Google Reviews */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-black flex flex-col items-center">
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#4285F4]"
                  >
                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                  </svg>
                </div>
                <div className="flex mb-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                </div>
                <p className="text-lg font-bold">4.8/5</p>
                <p className="text-sm text-gray-500 mb-4">Based on 1,200+ reviews</p>
                <a href="#" className="text-black hover:underline text-sm font-medium">
                  View on Google
                </a>
              </div>

              {/* Facebook Reviews */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-black flex flex-col items-center">
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#1877F2]"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </div>
                <div className="flex mb-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                </div>
                <p className="text-lg font-bold">4.6/5</p>
                <p className="text-sm text-gray-500 mb-4">Based on 850+ reviews</p>
                <a href="#" className="text-black hover:underline text-sm font-medium">
                  View on Facebook
                </a>
              </div>

              {/* Trustpilot Reviews */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-black flex flex-col items-center">
                <div className="mb-4">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#00B67A]"
                  >
                    <path
                      d="M12 17L6.12 20.5L7.72 13.73L2.55 9.27L9.43 8.73L12 2.5L14.57 8.73L21.45 9.27L16.28 13.73L17.88 20.5L12 17Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="flex mb-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                </div>
                <p className="text-lg font-bold">4.9/5</p>
                <p className="text-sm text-gray-500 mb-4">Based on 2,000+ reviews</p>
                <a href="#" className="text-black hover:underline text-sm font-medium">
                  View on Trustpilot
                </a>
              </div>

              {/* Instagram Reviews */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-black flex flex-col items-center">
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#E1306C]"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <div className="flex mb-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                </div>
                <p className="text-lg font-bold">4.7/5</p>
                <p className="text-sm text-gray-500 mb-4">Based on 1,500+ mentions</p>
                <a href="#" className="text-black hover:underline text-sm font-medium">
                  View on Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

        <ReviewsCTA />
      </div>
    </div>
  )
}
