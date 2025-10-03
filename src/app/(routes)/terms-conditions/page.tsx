
import type { Metadata } from "next"
import TermsConditionsClient from "./terms-conditions-client"
import { termsData } from "./data/terms-data"
import Container from "@/src/app/ui/container"

export const metadata: Metadata = {
  title: "Terms and Conditions - Legal Information | Fineyst",
  description: "Read our terms and conditions to understand your rights and responsibilities when using our services.",
  alternates: {
    canonical: "https://www.fineystjackets.com/us/terms-conditions"
  }
}

 function ServerTermsSection({
  title,
  content,
  subsections,
}: {
  title: string
  content: string[]
  subsections?: Array<{ title: string; content: string[]; listItems?: string[] }>
}) {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      {content.map((paragraph, idx) => (
        <p key={idx} className="mb-4 text-gray-700">
          {paragraph}
        </p>
      ))}

      {subsections &&
        subsections.map((subsection, idx) => (
          <div key={idx} className="mt-6 ml-4">
            <h3 className="text-xl font-semibold mb-3">{subsection.title}</h3>
            {subsection.content.map((paragraph, pidx) => (
              <p key={pidx} className="mb-3 text-gray-700">
                {paragraph}
              </p>
            ))}

            {subsection.listItems && (
              <ul className="list-disc pl-5 mb-4">
                {subsection.listItems.map((item, lidx) => (
                  <li key={lidx} className="mb-2 text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
    </div>
  )
}

export default function TermsConditionsPage() {
  return (
    <>
      {/* SEO h1 at the very top */}
      <h1 className="sr-only">Terms & Conditions</h1>
      
      {/* Server-rendered content for SEO - visible in page source */}
      <div aria-hidden="true" className="hidden">
        <div className="bg-background">
          <div className="relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-20 md:py-32 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                  <p className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">Terms & Conditions</p>
                  <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Last updated: April 15, 2024
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Container>
            <div className="max-w-4xl mx-auto py-12">
              <h2 className="text-3xl font-bold mb-8 text-black">Introduction</h2>
              <p className="text-gray-600 mb-6">Last updated: April 20, 2025</p>
              <div className="mb-8">
                <p className="text-gray-700">
                  Welcome to Fineyst. These Terms & Conditions govern your use of our website, services, and products.
                  Please read these terms carefully before making a purchase or using our services.
                </p>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Client component for interactivity */}
      <TermsConditionsClient />
    </>
  )
}
