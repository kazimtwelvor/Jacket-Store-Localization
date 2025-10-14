import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - Fineyst",
  description: "Login to your Fineyst account",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}