"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/src/app/ui/button"
import ReviewFormModal from "./review-form-modal"
import { toast } from "sonner" 

export default function ReviewsCTA() {
  const [isMounted, setIsMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleReviewSubmit = () => {
    closeModal()
    toast.success("Thank you! Your review has been submitted.", {
      duration: 5000,
      position: "top-center",
    })
  }

  // Static version for non-JS users
  if (!isMounted) {
    return (
      <div className="py-16 bg-[#eaeaea] text-black">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Share Your Experience</h2>
          <p className="text-lg text-white/80 mb-8">
            We value your feedback! Let us know about your experience with our products and service.
          </p>
          <a href="/us/contact-us" className="inline-block bg-white text-black font-bold py-3 px-8 rounded-full">
            Write a Review
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="py-16 bg-[#eaeaea] text-black">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Share Your Experience</h2>
          <p className="text-lg text-black mb-8">
            We value your feedback! Let us know about your experience with our products and service.
          </p>
          <Button
            size="lg"
            onClick={openModal}
            className="bg-[#eaeaea] text-black hover:bg-gray font-bold py-3 px-8 rounded-full group hover:scale-105 hover:shadow-md transition-all duration-200"
          >
            Write a Review
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>
      </div>

      {/* Review Form Modal */}
      <ReviewFormModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSubmitSuccess={handleReviewSubmit} 
      />
    </>
  )
}