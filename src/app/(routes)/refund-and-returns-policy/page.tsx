import type { Metadata } from "next"
import RefundPolicyClient from "./refund-policy-client"

export const metadata: Metadata = {
  title: "Refund & Returns Policy | Fashion Store",
  description: "Learn about our customer-friendly refund and returns policy. Easy returns within 30 days of purchase.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jacket.us.com/us'}/refund-and-returns-policy`
  }
}

export default function RefundPolicyPage() {
  return <RefundPolicyClient />
}
