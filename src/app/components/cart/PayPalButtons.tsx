"use client"

import { useEffect, useRef, useState } from "react"

type CartItem = {
  id: string
  quantity: number
}

type PayPalButtonsProps = {
  items: CartItem[]
  onApproveSuccess: () => void
}

declare global {
  interface Window {
    paypal?: any
  }
}

async function loadPayPalSdk(clientId: string) {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("No window"))
    if (window.paypal) return resolve()

    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId,
    )}&currency=USD&intent=capture&components=buttons,hosted-fields&enable-funding=paylater,card&disable-funding=venmo`;
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load PayPal SDK"))
    document.body.appendChild(script)
  })
}

export default function PayPalButtons({ items, onApproveSuccess }: PayPalButtonsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function init() {
      try {
        setLoading(true)
        setError(null)

        const storeId = process.env.NEXT_PUBLIC_STORE_ID
        const apiBase = process.env.NEXT_PUBLIC_API_URL
        if (!apiBase || !storeId) throw new Error("Missing API URL or STORE_ID")

        // fetch payment settings to get client id
        const settingsRes = await fetch(`${apiBase}/payment-settings`, { cache: "no-store" })
        if (!settingsRes.ok) throw new Error("Failed to fetch payment settings")
        const settings = await settingsRes.json()
        if (!settings.paypalClientId || !settings.paypalEnabled) throw new Error("PayPal not enabled")

        await loadPayPalSdk(settings.paypalClientId)

        if (!isMounted || !containerRef.current) return

        window.paypal.Buttons({
          style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },
          funding: {
            disallowed: [window.paypal.FUNDING.VENMO],
          },
          createOrder: async () => {
            const res = await fetch(`${apiBase}/${storeId}/paypal/create-order`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items }),
            })
            if (!res.ok) throw new Error("Failed to create PayPal order")
            const data = await res.json()
            return data.orderId
          },
          onApprove: async (data: any) => {
            const res = await fetch(`${apiBase}/${storeId}/paypal/capture-order`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID }),
            })
            if (!res.ok) throw new Error("Failed to capture PayPal order")
            onApproveSuccess()
          },
          onError: (err: any) => {
            console.error("PayPal error", err)
            setError("PayPal failed. Please try another method.")
          },
        }).render(containerRef.current)
      } catch (e: any) {
        console.error(e)
        setError(e.message || "Failed to initialize PayPal")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    init()
    return () => {
      isMounted = false
    }
  }, [items])

  return (
    <div>
      {loading && <div className="text-sm text-gray-600">Loading PayPal…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div ref={containerRef} />
    </div>
  )
}


