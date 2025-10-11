import { unstable_cache } from "next/cache";
import getProducts from "@/src/app/actions/get-products";
import ProductCarouselClient from "@/src/app/components/home-page-components/product-category/product-carousel-client";

export const revalidate = 3600; 

export interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  salePrice?: number;
  originalPrice?: number;
  images: { url: string }[];
  imageUrl?: string;
  gender?: string;
}

const getCachedProducts = unstable_cache(
  async (gender: "Male" | "Female"): Promise<Product[]> => {
    try {
      const result = await getProducts({
        genders: gender,
        limit: 10,
      });
      
      const convertedProducts = (result.products || []).map((product: any) => {
        const transformedImages =
          product.images?.map((img: any) => ({
            url: img.url || img.image?.url || "/placeholder.svg",
          })) || [];
        
        return {
          id: product.id,
          name: product.name,
          price:
            typeof product.price === "string"
              ? parseFloat(product.price)
              : product.price,
          slug: product.slug || `product-${product.id}`,
          salePrice: product.salePrice
            ? parseFloat(product.salePrice as string)
            : undefined,
          originalPrice: product.originalPrice
            ? parseFloat(product.originalPrice as string)
            : undefined,
          images: transformedImages,
          imageUrl: product.imageUrl,
          gender: product.gender,
        } as Product;
      });
      
      return convertedProducts;
    } catch (error) {
      return [];
    }
  },
  ['product-carousel'],
  { revalidate: 3600, tags: ['products', 'carousel'] }
);

interface ProductCarouselServerProps {
  title?: string;
}

export default async function ProductCarouselServer({
  title = "HAND-PICKED FOR YOU",
}: ProductCarouselServerProps) {
  const [menProducts, womenProducts] = await Promise.all([
    getCachedProducts("Male"),
    getCachedProducts("Female"),
  ]);

  return (
    <ProductCarouselClient
      title={title}
      menProducts={menProducts}
      womenProducts={womenProducts}
    />
  );
}
