import type { Metadata } from "next"
import SizeGuideContextProvider from "../../components/size-guide/size-guide-context"
import SizeGuideClientLayout from "../../components/size-guide/size-guide-client-layout"

export const metadata: Metadata = {
    title: "Complete Size Guide for Perfect Fit | Fineyst",
    description: "Find your perfect fit with our comprehensive size guide for all clothing categories.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jacket.us.com/us'}/size-guide`
    }
}

export default function SizeGuidePage() {
    return (
        <>
            <h1 className="sr-only">Complete Size Guide for Jackets & Outerwear</h1>
            <SizeGuideContextProvider>
                <SizeGuideClientLayout />
            </SizeGuideContextProvider>
        </>
    )
}
