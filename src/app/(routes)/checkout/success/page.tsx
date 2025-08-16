"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const orderId = localStorage.getItem("lastOrderId")

    if (orderId) {
      localStorage.removeItem("lastOrderId")

      router.push(`/checkout/confirmation?orderId=${orderId}&success=1`)
    } else {
      router.push(`/checkout/confirmation?success=1`)
    }
  }, [router])

  return (
    <section className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-medium">Redirecting to your order confirmation...</h2>
        <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
      </div>
    </section>
  )
}
