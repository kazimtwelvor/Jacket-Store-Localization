import ProductService from "../../lib/services/product-service"

export interface Query {
  categoryId?: string
  colorId?: string
  sizeId?: string
  isFeatured?: boolean
  materials?: string[] | string
  styles?: string[] | string
  genders?: string[] | string
  colors?: string[] | string
  sizes?: string[] | string
  sort?: string
  page?: number
  limit?: number
  search?: string
}

export interface PaginatedResponse {
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

import type { Product } from "@/types"

const getProducts = async (query: Query): Promise<PaginatedResponse> => {
  return ProductService.getProducts(query)
}

export default getProducts
