import type { Metadata } from "next"
import { generateHreflangLinks, getCanonicalUrl } from "@/src/lib/hreflang-helper"

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const { country: countryCode } = params;
  
  return {
    title: "My Wishlist | Fineyst",
    description: "Save and manage your favorite items in your personal wishlist.",
    alternates: {
      canonical: getCanonicalUrl(countryCode, '/wishlist'),
      languages: generateHreflangLinks({ path: '/wishlist', currentCountry: countryCode })
    }
  };
}

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}