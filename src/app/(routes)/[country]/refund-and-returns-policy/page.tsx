import type { Metadata } from "next"
import RefundPolicyClient from "./refund-policy-client"

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const { country: countryCode } = params;
  
  return {
    title: "Refund & Returns Policy | Fashion Store",
    description: "Learn about our customer-friendly refund and returns policy. Easy returns within 30 days of purchase.",
    alternates: {
      canonical: `https://www.fineystjackets.com/${countryCode}/refund-and-returns-policy`
    }
  };
}

export default function RefundPolicyPage() {
  return <RefundPolicyClient />
}
