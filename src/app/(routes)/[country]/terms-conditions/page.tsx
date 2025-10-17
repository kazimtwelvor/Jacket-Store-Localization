
import type { Metadata } from "next"
import TermsConditionsClientDynamic from "./TermsConditionsClientDynamic"

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const { country } = params
  const countryCode = country.toLowerCase()
  
  return {
    title: "Terms and Conditions - Legal Information | Fineyst",
    description: "Read our terms and conditions to understand your rights and responsibilities when using our services.",
    alternates: {
      canonical: `https://www.fineystjackets.com/${countryCode}/terms-conditions`
    }
  }
}

export default function TermsConditionsPage() {
  return <TermsConditionsClientDynamic />
}
