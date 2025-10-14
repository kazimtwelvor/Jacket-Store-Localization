import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Wishlist | Fineyst",
  description: "Save and manage your favorite items in your personal wishlist.",
  alternates: {
    canonical: "https://www.fineystjackets.com/us/wishlist"
  }
}

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}