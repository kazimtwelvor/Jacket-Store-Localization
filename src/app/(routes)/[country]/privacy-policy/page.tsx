import PrivacyPolicyClientDynamic from "./PrivacyPolicyClientDynamic"
import { generateHreflangLinks, getCanonicalUrl } from "@/src/lib/hreflang-helper"

export async function generateMetadata({ params }: { params: { country: string } }) {
  const { country } = params
  const countryCode = country.toLowerCase()
  
  return {
    title: "Privacy Policy - Data Protection Information | Fineyst",
    description: "Learn about how we collect, use, and protect your personal information.",
    alternates: {
      canonical: getCanonicalUrl(countryCode, '/privacy-policy'),
      languages: generateHreflangLinks({ path: '/privacy-policy' })
    }
  }
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClientDynamic />
}
