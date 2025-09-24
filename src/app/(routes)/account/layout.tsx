import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Account | Fineyst",
  description: "Manage your account settings, orders, and personal information.",
  alternates: {
    canonical: "https://www.fineystjackets.com/us/account"
  }
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}