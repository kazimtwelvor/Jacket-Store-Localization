import type { Metadata } from "next"
import { generateHreflangLinks, getCanonicalUrl } from "@/src/lib/hreflang-helper"

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params
  
  return {
    title: "Shopping Cart | Fineyst",
    description: "Review and manage items in your shopping cart before checkout.",
    alternates: {
      canonical: getCanonicalUrl(country, '/cart'),
      languages: generateHreflangLinks({ path: '/cart' })
    }
  }
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}