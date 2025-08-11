import type { Product } from "@/types"
import { fetchJson, toURLSearchParams } from "./_http"

interface Query {
  categoryId?: string
  colorId?: string
  sizeId?: string
  isFeatured?: boolean
  materials?: string[] | string
  styles?: string[] | string
  genders?: string[] | string
  colors?: string[] | string
  sizes?: string[] | string
  page?: number
  limit?: number
  search?: string
}

interface PaginatedResponse {
  products: Product[]
  pagination: {
    currentPage: number
    totalPages: number
    totalProducts: number
    productsPerPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// Helper function to generate a slug from product name
const generateSlug = (name: string, id?: string): string => {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim()

  // Add part of the ID to make it unique if available
  return id ? `${baseSlug}-${id.substring(0, 8)}` : baseSlug
}

const getProducts = async (query: Query): Promise<PaginatedResponse> => {
  try {
    const queryParams = toURLSearchParams({
      page: query.page && query.page > 1 ? query.page : undefined,
      categoryId: query.categoryId,
      colorId: query.colorId,
      sizeId: query.sizeId,
      isFeatured: query.isFeatured,
      search: query.search,
      materials: query.materials,
      styles: query.styles,
      genders: query.genders,
      colors: query.colors,
      sizes: query.sizes,
      limit: query.limit ?? 28,
    })

    let responseData: PaginatedResponse
    if (typeof window === "undefined") {
      // Server: call external API directly
      responseData = await fetchJson<PaginatedResponse>("/products", {
        query: queryParams!,
      })
    } else {
      // Client: fall back to our API route if present; if not, still call external API
      const apiRouteRes = await fetch(`/api/products?${queryParams?.toString() ?? ""}`, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      })
      if (apiRouteRes.ok) {
        responseData = (await apiRouteRes.json()) as PaginatedResponse
      } else {
        responseData = await fetchJson<PaginatedResponse>("/products", {
          query: queryParams!,
        })
      }
    }

    // Ensure the response has the expected structure
    if (!responseData.products || !Array.isArray(responseData.products)) {
      responseData = {
        products: [],
        pagination: {
          currentPage: query.page || 1,
          totalPages: 0,
          totalProducts: 0,
          productsPerPage: query.limit || 28,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }
    }

    // Normalize slugs
    responseData.products = responseData.products.map((product: Product) => {
      if (!product.slug && product.name) {
        product.slug = generateSlug(product.name, product.id)
      }
      return product
    })

    return responseData
  } catch (error) {
    console.error("❌ Error fetching products:", error)

    // Log more details about the error
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("🌐 Network error - possible causes:")
      console.error("   - API server is not running")
      console.error("   - CORS issues")
      console.error("   - Invalid API URL")
      console.error("   - Network connectivity issues")
    }

    return {
      products: [],
      pagination: {
        currentPage: query.page || 1,
        totalPages: 0,
        totalProducts: 0,
        productsPerPage: query.limit || 28,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  }
}

export default getProducts
