import type { Metadata } from "next"
import RefundPolicyClient from "./refund-policy-client"
import { generateHreflangLinks, getCanonicalUrl } from "@/src/lib/hreflang-helper"

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const { country: countryCode } = params;
  
  return {
    title: "Refund & Returns Policy | Fashion Store",
    description: "Learn about our customer-friendly refund and returns policy. Easy returns within 30 days of purchase.",
    alternates: {
      canonical: getCanonicalUrl(countryCode, '/refund-and-returns-policy'),
      languages: generateHreflangLinks({ path: '/refund-and-returns-policy' })
    }
  };
}

export default function RefundPolicyPage() {
  return <RefundPolicyClient />
}
