import type { Metadata } from "next"
import FaqsClient from "./faqs-client"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Fineyst",
  description: "Find answers to common questions about our products, shipping, returns, and more.",
  alternates: {
    canonical: "https://jacket.us.com/faqs"
  }
}

export default function FaqsPage() {
  return <FaqsClient />
}
