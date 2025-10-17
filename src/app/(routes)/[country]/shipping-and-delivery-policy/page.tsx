import type { Metadata } from "next"
import ShippingPolicyClient from "./shipping-policy-client"

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const { country } = await params
  const countryCode = country.toLowerCase()

  return {
    title: "Shipping & Delivery Policy | Fashion Store",
    description: "Learn about our shipping methods and delivery timeframes for domestic orders.",
    alternates: {
      canonical: `https://www.fineystjackets.com/${countryCode}/shipping-and-delivery-policy`
    }
  }
}

export default function ShippingPolicyPage() {
  return <ShippingPolicyClient />
}
