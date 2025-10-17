import PrivacyPolicyClientDynamic from "./PrivacyPolicyClientDynamic"

export async function generateMetadata({ params }: { params: { country: string } }) {
  const { country } = params
  const countryCode = country.toLowerCase()
  
  return {
    title: "Privacy Policy - Data Protection Information | Fineyst",
    description: "Learn about how we collect, use, and protect your personal information.",
    alternates: {
      canonical: `https://www.fineystjackets.com/${countryCode}/privacy-policy`
    }
  }
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClientDynamic />
}
