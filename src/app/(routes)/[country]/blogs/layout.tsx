import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params
  
  return {
    title: 'Fashion Insights & Style Guide | Premium Jacket Blog',
    description: 'Discover the latest fashion insights, style guides, and expert advice on premium jackets and outerwear. Stay updated with trends, care tips, and styling advice.',
    alternates: {
      canonical: `https://www.fineystjackets.com/${country}/blogs`
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