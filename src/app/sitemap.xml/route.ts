import { NextResponse } from 'next/server'

const BASE_URL = 'https://www.fineystjackets.com'

export async function GET() {
  // Generate main sitemap index that references all sub-sitemaps
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <sitemap>
    <loc>${BASE_URL}/pages-sitemap.xml</loc>
    <lastmod>${new Date().toISOString().replace('Z', '+00:00')}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/products-sitemap.xml</loc>
    <lastmod>${new Date().toISOString().replace('Z', '+00:00')}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/collections-sitemap.xml</loc>
    <lastmod>${new Date().toISOString().replace('Z', '+00:00')}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/blogs-sitemap.xml</loc>
    <lastmod>${new Date().toISOString().replace('Z', '+00:00')}</lastmod>
  </sitemap>
</sitemapindex>`

  return new NextResponse(sitemapIndex, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}