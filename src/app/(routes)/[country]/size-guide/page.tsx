import type { Metadata } from "next"
import SizeGuideContextProvider from "@/src/app/components/size-guide/size-guide-context"
import SizeGuideClientDynamic from "./size-guide-client-dynamic"

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const { country } = await params
  const countryCode = country.toLowerCase()

  return {
    title: "Complete Size Guide for Perfect Fit | Fineyst",
    description: "Find your perfect fit with our comprehensive size guide for all clothing categories.",
    alternates: {
      canonical: `https://www.fineystjackets.com/${countryCode}/size-guide`
    }
  }
}

export default function SizeGuidePage() {
    return (
        <>
            <h1 className="sr-only">Complete Size Guide for Jackets & Outerwear</h1>
            <SizeGuideContextProvider>
                <SizeGuideClientDynamic />
            </SizeGuideContextProvider>
        </>
    )
}
