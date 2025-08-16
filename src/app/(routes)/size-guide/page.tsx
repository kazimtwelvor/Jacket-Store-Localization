import type { Metadata } from "next"
import SizeGuideContextProvider from "../../components/size-guide/size-guide-context"
import SizeGuideClientLayout from "../../components/size-guide/size-guide-client-layout"

export const metadata: Metadata = {
    title: "Size Guide | Fineyst",
    description: "Find your perfect fit with our comprehensive size guide for all clothing categories.",
}

export default function SizeGuidePage() {
    return (
        <SizeGuideContextProvider>
            <SizeGuideClientLayout />
        </SizeGuideContextProvider>
    )
}
