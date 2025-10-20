import type { Metadata } from "next"
import ShippingPolicyClient from "./shipping-policy-client"
import { generateHreflangLinks, getCanonicalUrl } from "@/src/lib/hreflang-helper"

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const { country } = await params
  const countryCode = country.toLowerCase()

  return {
    title: "Shipping & Delivery Policy | Fashion Store",
    description: "Learn about our shipping methods and delivery timeframes for domestic orders.",
    alternates: {
      canonical: getCanonicalUrl(countryCode, '/shipping-and-delivery-policy'),
      languages: generateHreflangLinks({ path: '/shipping-and-delivery-policy', currentCountry: countryCode })
    }
  }
}

export default function ShippingPolicyPage() {
  return <ShippingPolicyClient />
}
