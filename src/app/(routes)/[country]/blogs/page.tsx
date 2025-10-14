import type { Metadata } from "next"
import BlogsServer from "./blogs-server"

export const metadata: Metadata = {
  title: "Fashion Insights & Style Guide | Fineyst",
  description: "Discover the latest fashion insights, style guides, and expert advice on premium jackets and outerwear.",
  alternates: {
    canonical: "https://www.fineystjackets.com/us/blogs"
  }
}

export default function BlogsPage() {
  return <BlogsServer />
}
