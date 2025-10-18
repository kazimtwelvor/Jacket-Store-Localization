import type { Metadata } from "next"
import { generateHreflangLinks, getCanonicalUrl } from "@/src/lib/hreflang-helper"

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params
  
  return {
    title: "My Account | Fineyst",
    description: "Manage your account settings, orders, and personal information.",
    alternates: {
      canonical: getCanonicalUrl(country, '/account'),
      languages: generateHreflangLinks({ path: '/account' })
    }
  }
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}