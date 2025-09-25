import type { Metadata } from "next"
import ShippingPolicyClient from "./shipping-policy-client"

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Fashion Store",
  description: "Learn about our shipping methods, delivery timeframes, and international shipping options.",
  alternates: {
    canonical: "https://www.fineystjackets.com/us/shipping-and-delivery-policy"
  }
}

export default function ShippingPolicyPage() {
  return <ShippingPolicyClient />
}
