import ProductService from "../../lib/services/product-service";
import { unstable_cache } from "next/cache";
import type { Product } from "@/types";

export interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  materials?: string[] | string;
  styles?: string[] | string;
  genders?: string[] | string;
  colors?: string[] | string;
  baseColors?: string[] | string;
  sizes?: string[] | string;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    productsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const getCachedProducts = unstable_cache(
  async (query: Query): Promise<PaginatedResponse> => {
    console.log('🔍 Fetching products from cache/API:', query);
    return ProductService.getProducts(query);
  },
  ['products'],
  { 
    revalidate: 1800, 
    tags: ['products', 'product-list'] 
  }
);

const getProducts = async (query: Query): Promise<PaginatedResponse> => {
  return getCachedProducts(query);
};

export default getProducts;
