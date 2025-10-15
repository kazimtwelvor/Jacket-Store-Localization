import type { Metadata } from "next"
import BlogsServer from "./blogs-server"

interface BlogsPageProps {
  params: Promise<{ country: string }>
}

export async function generateMetadata({ params }: BlogsPageProps): Promise<Metadata> {
  const { country } = await params
  const countryCode = country.toUpperCase()
  
  return {
    title: "Fashion Insights & Style Guide | Fineyst",
    description: "Discover the latest fashion insights, style guides, and expert advice on premium jackets and outerwear.",
    alternates: {
      canonical: `https://www.fineystjackets.com/${country}/blogs`
    }
  }
}

export default async function BlogsPage({ params }: BlogsPageProps) {
  const { country } = await params
  return <BlogsServer countryCode={country} />
}
