import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shopping Cart | Fineyst",
  description: "Review and manage items in your shopping cart before checkout.",
  alternates: {
    canonical: "https://www.fineystjackets.com/us/cart"
  }
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}