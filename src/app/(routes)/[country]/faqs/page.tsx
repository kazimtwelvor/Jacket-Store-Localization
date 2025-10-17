import type { Metadata } from "next"
import FaqsClient from "./faqs-client"
import { faqData } from "./data/faq-data"

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const { country: countryCode } = params;
  
  return {
    title: "Frequently Asked Questions | Fineyst",
    description: "Find answers to common questions about our products, shipping, returns, and more.",
    alternates: {
      canonical: `https://www.fineystjackets.com/${countryCode}/faqs`
    }
  };
}

export default function FaqsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.flatMap(category => 
      category.items.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqsClient />
    </>
  )
}
