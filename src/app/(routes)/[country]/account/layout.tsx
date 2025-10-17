import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params
  
  return {
    title: "My Account | Fineyst",
    description: "Manage your account settings, orders, and personal information.",
    alternates: {
      canonical: `https://www.fineystjackets.com/${country}/account`
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