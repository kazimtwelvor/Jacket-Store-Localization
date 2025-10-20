
import type { Metadata } from "next"
import TermsConditionsClientDynamic from "./TermsConditionsClientDynamic"
import { generateHreflangLinks, getCanonicalUrl } from "@/src/lib/hreflang-helper"

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params
  const countryCode = country.toLowerCase()
  
  return {
    title: "Terms and Conditions - Legal Information | Fineyst",
    description: "Read our terms and conditions to understand your rights and responsibilities when using our services.",
    alternates: {
      canonical: getCanonicalUrl(countryCode, '/terms-conditions'),
      languages: generateHreflangLinks({ path: '/terms-conditions', currentCountry: countryCode })
    }
  }
}

export default function TermsConditionsPage() {
  return <TermsConditionsClientDynamic />
}
