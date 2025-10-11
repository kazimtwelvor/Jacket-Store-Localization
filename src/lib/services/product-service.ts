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
    collars?: string[] | string
    cuffs?: string[] | string
    closures?: string[] | string
    pockets?: string[] | string
    sort?: string
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

    const asCSV = (val?: string[] | string) => {
        if (!val) return undefined
        if (Array.isArray(val)) {
            const joined = val.filter(Boolean).map(v => String(v).trim()).join(',')
            return joined || undefined
        }
        return String(val)
    }

    if (query.page && query.page > 1) params.page = query.page
    if (query.categoryId) params.categoryId = query.categoryId
    if (query.colorId) params.colorId = query.colorId
    if (query.sizeId) params.sizeId = query.sizeId
    if (query.isFeatured) params.isFeatured = query.isFeatured
    if (query.search) params.search = query.search
    const materials = asCSV(query.materials)
    if (materials) params.materials = materials
    const styles = asCSV(query.styles)
    if (styles) params.styles = styles
    const genders = asCSV(query.genders)
    if (genders) params.genders = genders
    const colors = asCSV(query.colors)
    if (colors) params.colors = colors
    const sizes = asCSV(query.sizes)
    if (sizes) params.sizes = sizes
    const collars = asCSV(query.collars)
    if (collars) params.collars = collars
    const cuffs = asCSV(query.cuffs)
    if (cuffs) params.cuffs = cuffs
    const closures = asCSV(query.closures)
    if (closures) params.closures = closures
    const pockets = asCSV(query.pockets)
    if (pockets) params.pockets = pockets
    if (query.sort) params.sort = query.sort
    if (query.limit) params.limit = query.limit

    return params
}

export class ProductService {
    static async getProducts(query: Query): Promise<PaginatedResponse> {
        try {
            const params = buildQueryParams(query)

            const response = await apiClient.get('/products', {
                params,
                timeout: 1200000,
                headers: {
                    'Cache-Control': 'no-cache',
                }
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
                
                if (product.baseColor || product.colorDetails) {
                    const baseColor = product.baseColor
                    const colorDetails = product.colorDetails
                    
                    let combinedColorDetails = []
                    
                    if (baseColor && baseColor.id) {
                        combinedColorDetails.push(baseColor)
                    }
                    
                    if (Array.isArray(colorDetails)) {
                        colorDetails.forEach(color => {
                            if (color && color.id && (!baseColor || color.id !== baseColor.id)) {
                                combinedColorDetails.push(color)
                            }
                        })
                    }
                    
                    product.colorDetails = combinedColorDetails
                }
                
                return product
            })

            return responseData
        } catch (error) {

            if (error instanceof TypeError && error.message === "Failed to fetch") {
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
            const response = await apiClient.get(`/products/${slugOrId}`, {
                timeout: 1200000, 
                headers: {
                    'Cache-Control': 'no-cache',
                }
            })
            
            const product = response.data
            
            if (product && (product.baseColor || product.colorDetails)) {
                const baseColor = product.baseColor
                const colorDetails = product.colorDetails
                
                let combinedColorDetails = []
                
                if (baseColor && baseColor.id) {
                    combinedColorDetails.push(baseColor)
                }
                
                if (Array.isArray(colorDetails)) {
                    colorDetails.forEach(color => {
                        if (color && color.id && (!baseColor || color.id !== baseColor.id)) {
                            combinedColorDetails.push(color)
                        }
                    })
                }
                
                product.colorDetails = combinedColorDetails
            }
            
            return product
        } catch (error) {
            return null
        }
    }

    static async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
        try {
            const response = await apiClient.get('/products', {
                params: {
                    isFeatured: true,
                    limit
                },
                headers: {
                    'Cache-Control': 'no-cache',
                }
            })
            
            const products = response.data.products || []
            
            return products.map((product: Product) => {
                if (product.baseColor || product.colorDetails) {
                    const baseColor = product.baseColor
                    const colorDetails = product.colorDetails
                    
                    let combinedColorDetails = []
                    
                    if (baseColor && baseColor.id) {
                        combinedColorDetails.push(baseColor)
                    }
                    
                    if (Array.isArray(colorDetails)) {
                        colorDetails.forEach(color => {
                            if (color && color.id && (!baseColor || color.id !== baseColor.id)) {
                                combinedColorDetails.push(color)
                            }
                        })
                    }
                    
                    product.colorDetails = combinedColorDetails
                }
                
                return product
            })
        } catch (error) {
            return []
        }
    }

    static async searchProducts(searchTerm: string, limit: number = 20): Promise<Product[]> {
        try {
            const response = await apiClient.get('/products', {
                params: {
                    search: searchTerm,
                    limit
                },
                headers: {
                    'Cache-Control': 'no-cache',
                }
            })
            
            const products = response.data.products || []
            
            return products.map((product: Product) => {
                if (product.baseColor || product.colorDetails) {
                    const baseColor = product.baseColor
                    const colorDetails = product.colorDetails
                    
                    let combinedColorDetails = []
                    
                    if (baseColor && baseColor.id) {
                        combinedColorDetails.push(baseColor)
                    }
                    
                    if (Array.isArray(colorDetails)) {
                        colorDetails.forEach(color => {
                            if (color && color.id && (!baseColor || color.id !== baseColor.id)) {
                                combinedColorDetails.push(color)
                            }
                        })
                    }
                    
                    product.colorDetails = combinedColorDetails
                }
                
                return product
            })
        } catch (error) {
            return []
        }
    }
}

export default ProductService