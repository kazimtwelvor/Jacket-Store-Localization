import type { Metadata } from "next"
import FaqsClient from "./faqs-client"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Fineyst",
  description: "Find answers to common questions about our products, shipping, returns, and more.",
}

export default function FaqsPage() {
  return <FaqsClient />
}
