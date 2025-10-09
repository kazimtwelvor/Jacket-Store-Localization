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
  collars?: string[] | string;
  cuffs?: string[] | string;
  closures?: string[] | string;
  pockets?: string[] | string;
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

const getProducts = async (query: Query): Promise<PaginatedResponse> => {
  const result = await ProductService.getProducts(query);
  
  if (result.products && Array.isArray(result.products)) {
    result.products = result.products.map((product: Product) => {
      if (product.baseColor || product.colorDetails) {
        const baseColor = product.baseColor
        const colorDetails = product.colorDetails
        
        if (Array.isArray(colorDetails) && colorDetails.length > 0) {
          product.colorDetails = colorDetails
        } else if (baseColor && baseColor.id) {
          product.colorDetails = [baseColor]
        }
      }
      
      return product
    })
  }
  
  return result;
};

export default getProducts;


