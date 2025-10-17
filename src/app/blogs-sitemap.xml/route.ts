import { NextResponse } from 'next/server'
import { getBlogs } from '../actions/get-blogs'

const BASE_URL = 'https://www.fineystjackets.com'
const SUPPORTED_COUNTRIES = ['us', 'uk', 'ca', 'au']

export async function GET() {
  try {
    // Fetch all blogs
    const blogs = await getBlogs()

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${blogs.flatMap((blog: any) => 
  SUPPORTED_COUNTRIES.map(country => `  <url>
    <loc>${BASE_URL}/${country}/blogs/${blog.slug}</loc>
    <lastmod>${blog.updatedAt ? new Date(blog.updatedAt).toISOString().replace('Z', '+00:00') : new Date().toISOString().replace('Z', '+00:00')}</lastmod>
  </url>`)
).join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
</urlset>`

    return new NextResponse(emptySitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  }
}
