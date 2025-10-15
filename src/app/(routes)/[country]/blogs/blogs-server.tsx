import { getBlogs } from "@/src/app/actions/get-blogs"
import BlogsClient from "./blogs-client"

interface BlogsServerProps {
  countryCode: string
}

export default async function BlogsServer({ countryCode }: BlogsServerProps) {
  const blogs = await getBlogs({ countryCode })
  const blogsArray = Array.isArray(blogs) ? blogs : []
  
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Fashion Insights & Style Guide",
    "description": "Discover the latest fashion insights, style guides, and expert advice on premium jackets and outerwear.",
    "url": "https://www.fineystjackets.com/us/blogs",
    "mainEntity": {
      "@type": "Blog",
      "name": "Fashion Insights & Style Guide",
      "url": "https://www.fineystjackets.com/us/blogs",
      "publisher": {
        "@type": "Organization",
        "name": "Fineyst",
        "url": "https://www.fineystjackets.com/us",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.fineystjackets.com/us/logo.webp"
        }
      },
      "hasPart": blogsArray.slice(0, 10).map(blog => ({
        "@type": "BlogPosting",
        "headline": blog.title || "Untitled",
        "url": `https://www.fineystjackets.com/us/blogs/${blog.slug || blog.id}`,
        "datePublished": blog.createdAt,
        "dateModified": blog.updatedAt || blog.createdAt,
        "author": {
          "@type": "Organization",
          "name": "Fineyst",
          "url": "https://www.fineystjackets.com/us"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Fineyst",
          "url": "https://www.fineystjackets.com/us"
        },
        "description": blog.excerpt || blog.content?.substring(0, 160) || "Fashion article",
        ...(blog.imageUrl && {
          "image": {
            "@type": "ImageObject",
            "url": blog.imageUrl
          }
        })
      }))
    }
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <BlogsClient initialBlogs={blogsArray} />
    </>
  )
}