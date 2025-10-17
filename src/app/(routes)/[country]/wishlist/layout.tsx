import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const { country: countryCode } = params;
  
  return {
    title: "My Wishlist | Fineyst",
    description: "Save and manage your favorite items in your personal wishlist.",
    alternates: {
      canonical: `https://www.fineystjackets.com/${countryCode}/wishlist`
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