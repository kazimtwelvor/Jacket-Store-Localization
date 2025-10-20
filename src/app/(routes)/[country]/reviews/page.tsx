
import type { Metadata } from "next";
import ReviewsClient from "./reviews-client"
import { generateHreflangLinks, getCanonicalUrl } from "@/src/lib/hreflang-helper"

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const { country: countryCode } = params;
  
  return {
    title: "Customer Reviews and Testimonials | Fineyst",
    description: "Read what our customers are saying about their experience with our products and service.",
    alternates: {
      canonical: getCanonicalUrl(countryCode, '/reviews'),
      languages: generateHreflangLinks({ path: '/reviews', currentCountry: countryCode })
    }
  };
}

export default function ReviewsPage() {
  return <ReviewsClient />
}
