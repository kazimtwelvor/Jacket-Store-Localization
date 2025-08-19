import { Suspense } from "react";
import ProductsPageClient from "./products-page-client";
import getProducts from "../../actions/get-products";
import getCategories from "../../actions/get-categories";
import getSizes from "../../actions/get-sizes";
import getColors from "../../actions/get-colors";
import getKeywordCategories from "../../actions/get-keyword-categories";
import ProductCategory from "../home-page-components/product-category/product-category";

export const metadata = {
  title: "Shop | Fineyst",
  description: "Browse our collection of premium clothing and accessories.",
};

export const revalidate = 300;
export const dynamic = "auto";
export const fetchCache = "default-cache";

type ShopPageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    categoryId?: string;
    colorId?: string;
    sizeId?: string;
    search?: string;
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number.parseInt(resolvedSearchParams.page || "1");
  const limit = Number.parseInt(resolvedSearchParams.limit || "28");

  const [productsData, categories, colors, sizes, keywordCategories] = await Promise.allSettled([
    getProducts({
      page,
      limit,
      categoryId: resolvedSearchParams.categoryId,
      colorId: resolvedSearchParams.colorId,
      sizeId: resolvedSearchParams.sizeId,
      search: resolvedSearchParams.search,
    }),
    getCategories(),
    getColors(),
    getSizes(),
    getKeywordCategories(),
  ]);

  const finalProductsData = productsData.status === 'fulfilled' ? productsData.value : {
    products: [],
    pagination: {
      currentPage: page,
      totalPages: 0,
      totalProducts: 0,
      productsPerPage: limit,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  const finalCategories = categories.status === 'fulfilled' ? categories.value : [];
  const finalColors = colors.status === 'fulfilled' ? colors.value : [];
  const finalSizes = sizes.status === 'fulfilled' ? sizes.value : [];
  const finalKeywordCategories = keywordCategories.status === 'fulfilled' ? keywordCategories.value : [];


  return (
    <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <span className="ml-3 text-gray-600">Loading products...</span>
            </div>
          }
        >
          <ProductsPageClient
            initialProductsData={finalProductsData}
            categories={finalCategories}
            colors={finalColors}
            sizes={finalSizes}
            keywordCategories={finalKeywordCategories}
          />
        </Suspense>
      </main>

      <ProductCategory />
    </div>
  );
}
