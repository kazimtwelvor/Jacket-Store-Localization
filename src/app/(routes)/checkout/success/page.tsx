"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// This page will redirect to the new confirmation page
export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if we have an orderId in localStorage that was saved during checkout
    const orderId = localStorage.getItem("lastOrderId")

    if (orderId) {
      // Clear the orderId from localStorage
      localStorage.removeItem("lastOrderId")

      // Redirect to the confirmation page with the orderId
      router.push(`/checkout/confirmation?orderId=${orderId}&success=1`)
    } else {
      // If no orderId is found, just show the generic confirmation page
      router.push(`/checkout/confirmation?success=1`)
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-medium">Redirecting to your order confirmation...</h2>
        <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
      </div>
    </div>
  )
}
