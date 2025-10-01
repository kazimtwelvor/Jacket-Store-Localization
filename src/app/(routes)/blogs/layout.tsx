import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fashion Insights & Style Guide | Premium Jacket Blog',
  description: 'Discover the latest fashion insights, style guides, and expert advice on premium jackets and outerwear. Stay updated with trends, care tips, and styling advice.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fineystjackets.com/us'}/blogs`
  }
}

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}