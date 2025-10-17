import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params
  
  return {
    title: "Shopping Cart | Fineyst",
    description: "Review and manage items in your shopping cart before checkout.",
    alternates: {
      canonical: `https://www.fineystjackets.com/${country}/cart`
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