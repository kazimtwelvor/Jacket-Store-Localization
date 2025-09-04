import { NextResponse } from 'next/server'
import getKeywordCategories from '../actions/get-keyword-categories'
import getProducts from '../actions/get-products'
import { getBlogs } from '../actions/get-blogs'

const BASE_URL = 'https://jacket.us.com/us'

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
  try {
    // Fetch all dynamic content
    const [collections, products, blogs] = await Promise.all([
      getKeywordCategories(),
      getProducts({ limit: 1000 }), // Get all products
      getBlogs()
    ])

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PAGES.map(page => `  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
${collections.map((collection: any) => `  <url>
    <loc>${BASE_URL}/collections/${collection.slug}</loc>
    <lastmod>${collection.updatedAt ? new Date(collection.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
${products.products.map((product: any) => `  <url>
    <loc>${BASE_URL}/product/${product.slug}</loc>
    <lastmod>${product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
${blogs.map((blog: any) => `  <url>
    <loc>${BASE_URL}/blogs/${blog.slug}</loc>
    <lastmod>${blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return basic sitemap with static pages only
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PAGES.map(page => `  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`

    return new NextResponse(basicSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  }
}