import type { Product } from "@/types"
import apiClient from "../axios-instance"

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

const generateSlug = (name: string, id?: string): string => {
    const baseSlug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()

    return id ? `${baseSlug}-${id.substring(0, 8)}` : baseSlug
}

// Helper function to build query parameters
const buildQueryParams = (query: Query): Record<string, any> => {
    const params: Record<string, any> = {}

    if (query.page && query.page > 1) params.page = query.page
    if (query.categoryId) params.categoryId = query.categoryId
    if (query.colorId) params.colorId = query.colorId
    if (query.sizeId) params.sizeId = query.sizeId
    if (query.isFeatured) params.isFeatured = query.isFeatured
    if (query.search) params.search = query.search
    if (query.materials) params.materials = query.materials
    if (query.styles) params.styles = query.styles
    if (query.genders) params.genders = query.genders
    if (query.colors) params.colors = query.colors
    if (query.sizes) params.sizes = query.sizes
    if (query.limit) params.limit = query.limit

    return params
}

export class ProductService {
    static async getProducts(query: Query): Promise<PaginatedResponse> {
        try {
            const params = buildQueryParams(query)

            const response = await apiClient.get('/products', {
                params
            })

            let responseData: PaginatedResponse = response.data

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

            responseData.products = responseData.products.map((product: Product) => {
                if (!product.slug && product.name) {
                    product.slug = generateSlug(product.name, product.id)
                }
                return product
            })

            return responseData
        } catch (error) {
            console.error("❌ Error fetching products:", error)

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


    static async getProduct(slugOrId: string): Promise<Product | null> {
        try {
            const response = await apiClient.get(`/products/${slugOrId}`)
            return response.data
        } catch (error) {
            console.error("❌ Error fetching product:", error)
            return null
        }
    }

    static async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
        try {
            const response = await apiClient.get('/products', {
                params: {
                    isFeatured: true,
                    limit
                }
            })
            return response.data.products || []
        } catch (error) {
            console.error("❌ Error fetching featured products:", error)
            return []
        }
    }

    static async searchProducts(searchTerm: string, limit: number = 20): Promise<Product[]> {
        try {
            const response = await apiClient.get('/products', {
                params: {
                    search: searchTerm,
                    limit
                }
            })
            return response.data.products || []
        } catch (error) {
            console.error("❌ Error searching products:", error)
            return []
        }
    }
}

export default ProductService
