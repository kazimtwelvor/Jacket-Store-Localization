import type { Product } from "@/types"
import getProducts from "./get-products"

const URL = process.env.NEXT_PUBLIC_API_URL

const getProduct = async (slug: string): Promise<Product> => {
  try {
    if (!URL) {
      throw new Error("API URL is not defined")
    }

    // First, try to fetch the product directly from the API if possible
    try {
      let productUrl: string

      // Check if we're running on the server or client
      if (typeof window === "undefined") {
        // Server-side: Use the external API directly
        productUrl = `${URL}/products/${slug}`
      } else {
        // Client-side: Use the Next.js API route (if we had one for single products)
        // For now, we'll fall back to the search method
        throw new Error("Direct product fetch not available on client-side")
      }

      const response = await fetch(productUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (response.ok) {
        const product = await response.json()
        if (product && product.id) {

          // Ensure the product has a slug
          if (!product.slug && product.name) {
            product.slug = product.name
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .trim()
          }

          return product
        }
      }
    } catch (directFetchError) {
    }

    // Fallback: Search through paginated products

    // We need to search through multiple pages to find the product
    let currentPage = 1
    let found = false
    let product: Product | null = null

    while (!found && currentPage <= 10) {
      // Limit to 10 pages to avoid infinite loops

      const productsResponse = await getProducts({
        page: currentPage,
        limit: 50, // Use a higher limit to reduce number of requests
      })

      if (!productsResponse.products || productsResponse.products.length === 0) {
        break
      }

      // Search for the product in current page
      product =
        productsResponse.products.find((p: Product) => {
          // Check both slug and generated slug from name
          const productSlug =
            p.slug ||
            (p.name
              ? p.name
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, "")
                  .replace(/\s+/g, "-")
                  .replace(/-+/g, "-")
                  .trim()
              : "")
          return productSlug === slug || p.id === slug
        }) || null

      if (product) {
        found = true
        break
      }

      // Check if there are more pages
      if (!productsResponse.pagination.hasNextPage) {
        break
      }

      currentPage++
    }

    if (!product) {
      throw new Error(`Product with slug '${slug}' not found`)
    }

    // Ensure the product has a slug
    if (!product.slug && product.name) {
      product.slug = product.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
    }

    return product
  } catch (error) {
    console.error("❌ Error in getProduct:", error)
    throw error
  }
}

export default getProduct
