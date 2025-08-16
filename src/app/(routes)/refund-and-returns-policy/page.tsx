import type { Metadata } from "next"
import RefundPolicyClient from "./refund-policy-client"

export const metadata: Metadata = {
  title: "Refund & Returns Policy | Fashion Store",
  description: "Learn about our customer-friendly refund and returns policy. Easy returns within 30 days of purchase.",
}

export default function RefundPolicyPage() {
  return <RefundPolicyClient />
}
