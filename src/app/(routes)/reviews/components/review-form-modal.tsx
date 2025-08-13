"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Star, X, Camera, CheckCircle } from "lucide-react"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface ReviewFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess?: () => void
}

export default function ReviewFormModal({ isOpen, onClose, onSubmitSuccess }: ReviewFormModalProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [photo, setPhoto] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState("")
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  // Hide popup after 5 seconds
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessPopup])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadError("")

    const file = files[0]

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be less than 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhoto(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removePhoto = () => {
    setPhoto(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate rating
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real implementation, this would send data to your API
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      // Close modal
      onClose()

      // Reset form
      setRating(0)
      setTitle("")
      setComment("")
      setName("")
      setEmail("")
      setPhoto(null)

      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess()
      } else {
        // Show success popup after 2 seconds
        setTimeout(() => {
          setShowSuccessPopup(true)
        }, 1000)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Success Popup - Centered on the page */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          <div className="bg-black/20 absolute inset-0" onClick={() => setShowSuccessPopup(false)}></div>
          <div className="relative bg-white shadow-xl rounded-lg max-w-sm w-full mx-4 overflow-hidden">
            <div className="p-5">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-lg font-medium text-gray-900">Review submitted</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Thank you for your feedback! Your review has been submitted.
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => setShowSuccessPopup(false)}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-xl lg:max-w-2xl transform overflow-hidden rounded-xl bg-white p-4 sm:p-6 md:p-8 text-left align-middle shadow-xl transition-all">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title as="h3" className="text-xl sm:text-2xl font-bold text-black">
                      Write a Review
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-full p-2 text-black hover:bg-black  hover:text-black transition-colors"
                      onClick={onClose}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-sm h-11"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-sm h-11"
                        required
                      />
                    </div>

                    <Input
                      placeholder="Review Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-sm h-11"
                      required
                    />

                    <Textarea
                      placeholder="Your Review"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="text-sm resize-none min-h-[120px]"
                      required
                    />

                    {/* Photo Upload - Moved here */}
                    <div className="space-y-2">
                      {!photo ? (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium rounded-lg border border-gray-200 flex items-center justify-center gap-2 transition-colors"
                        >
                          <Camera className="h-5 w-5" />
                          Add photo
                        </button>
                      ) : (
                        <div className="relative rounded-lg overflow-hidden">
                          <img
                            src={photo || "/placeholder.svg"}
                            alt="Review photo"
                            className="w-full h-48 sm:h-64 object-cover"
                          />
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition-colors"
                          >
                            <X className="h-5 w-5 text-red-500" />
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
                    </div>

                    {/* Rating - Centered */}
                    <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none transform transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-6 w-6 sm:h-7 sm:w-7 ${
                                rating >= star ? "fill-red-500 text-red-500" : "text-gray-300"
                              } transition-colors`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-red-500 hover:bg-[#2b2b2b] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
