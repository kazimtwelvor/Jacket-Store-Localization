import { Suspense } from "react";
// import getProducts from "@/actions/get-products"
// import getCategories from "@/actions/get-categories"
// import getColors from "@/actions/get-colors"
// import getSizes from "@/actions/get-sizes"
// import getKeywordCategories from "@/actions/get-keyword-categories"
import ProductsPageClient from "./products-page-client";
// import DesktopCategoryCarousel from "@/components/home-page-components/desktop-category-carousel";
import getProducts from "../../actions/get-products";
import getCategories from "../../actions/get-categories";
import getSizes from "../../actions/get-sizes";
import getColors from "../../actions/get-colors";
import getKeywordCategories from "../../actions/get-keyword-categories";
import DesktopCategoryCarousel from "../homePageComponents/desktop-category-carousel";

export const metadata = {
  title: "Shop | Fineyst",
  description: "Browse our collection of premium clothing and accessories.",
};

export const revalidate = 3600;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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

  // Fetch paginated products and filter data
  const productsData = await getProducts({
    page,
    limit,
    categoryId: resolvedSearchParams.categoryId,
    colorId: resolvedSearchParams.colorId,
    sizeId: resolvedSearchParams.sizeId,
    search: resolvedSearchParams.search,
  });

  const categories = await getCategories();
  const colors = await getColors();
  const sizes = await getSizes();
  const keywordCategories = await getKeywordCategories();

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
            initialProductsData={productsData}
            categories={categories}
            colors={colors}
            sizes={sizes}
            keywordCategories={keywordCategories}
          />
        </Suspense>
      </main>

      <DesktopCategoryCarousel />
    </div>
  );
}
