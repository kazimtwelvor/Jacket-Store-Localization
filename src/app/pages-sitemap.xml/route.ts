import { NextResponse } from 'next/server'

const BASE_URL = 'https://fineystjackets.com/us'

// Static pages that should be included in sitemap
const STATIC_PAGES = [
  '',
  '/about-us',
  '/contact-us',
  '/faqs',
  '/privacy-policy',
  '/refund-and-returns-policy',
  '/shipping-and-delivery-policy',
  '/terms-conditions',
  '/reviews',
  '/size-guide',
  '/shop',
  '/showcase',
  '/collections',
  '/blogs'
]

export async function GET() {
  // Generate static pages sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${STATIC_PAGES.map(page => `  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${new Date().toISOString().replace('Z', '+00:00')}</lastmod>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
