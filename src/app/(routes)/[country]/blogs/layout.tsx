import type { Metadata } from 'next'
import { generateHreflangLinks, getCanonicalUrl } from "@/src/lib/hreflang-helper"

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params
  
  return {
    title: 'Fashion Insights & Style Guide | Premium Jacket Blog',
    description: 'Discover the latest fashion insights, style guides, and expert advice on premium jackets and outerwear. Stay updated with trends, care tips, and styling advice.',
    alternates: {
      canonical: getCanonicalUrl(country, '/blogs'),
      languages: generateHreflangLinks({ path: '/blogs' })
    }
  }
}

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}