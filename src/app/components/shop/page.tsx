import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductsPageClient from "./products-page-client";
import getProducts from "../../actions/get-products";
import getCategories from "../../actions/get-categories";
import getSizes from "../../actions/get-sizes";
import getColors from "../../actions/get-colors";
import getKeywordCategories from "../../actions/get-keyword-categories";
import ProductCategory from "../home-page-components/product-category/product-category";

export const metadata = {
  title: "Shop Premium Jackets and Outerwear | Fineyst",
  description: "Browse our collection of premium clothing and accessories.",
  alternates: {
    canonical: "https://jacket.us.com/shop"
  }
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
    genders?: string; // comma-separated string (men,women,unisex)
    materials?: string;
    styles?: string;
    colors?: string;
    sizes?: string;
    sort?: string;
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number.parseInt(resolvedSearchParams.page || "1");
  const limit = Number.parseInt(resolvedSearchParams.limit || "28");

  const [productsData, categories, colors, sizes, keywordCategories] =
    await Promise.allSettled([
      getProducts({
        page,
        limit,
        categoryId: resolvedSearchParams.categoryId,
        colorId: resolvedSearchParams.colorId,
        sizeId: resolvedSearchParams.sizeId,
        search: resolvedSearchParams.search,
        genders: resolvedSearchParams.genders,
        materials: resolvedSearchParams.materials,
        styles: resolvedSearchParams.styles,
        colors: resolvedSearchParams.colors,
        sizes: resolvedSearchParams.sizes,
        sort: resolvedSearchParams.sort,
      }),
      getCategories(),
      getColors(),
      getSizes(),
      getKeywordCategories(),
    ]);

  const finalProductsData =
    productsData.status === "fulfilled"
      ? productsData.value
      : {
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

  const finalCategories =
    categories.status === "fulfilled" ? categories.value : [];
  const finalColors = colors.status === "fulfilled" ? colors.value : [];
  const finalSizes = sizes.status === "fulfilled" ? sizes.value : [];
  const finalKeywordCategories =
    keywordCategories.status === "fulfilled" ? keywordCategories.value : [];

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Shop Premium Jackets and Outerwear",
    "description": "Browse our collection of premium clothing and accessories.",
    "url": "https://jacket.us.com/shop",
    "numberOfItems": finalProductsData.pagination.totalProducts,
    "itemListElement": finalProductsData.products.slice(0, 10).map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "description": product.description || `Premium ${product.name} from Fineyst`,
        "url": `https://jacket.us.com/product/${product.slug}`,
        "image": product.images?.[0]?.image?.url,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      }
    }))
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Shop Premium Jackets and Outerwear",
    "description": "Browse our collection of premium clothing and accessories.",
    "url": "https://jacket.us.com/shop"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-1">
        <Suspense
          fallback={<div className="text-center py-20 text-gray-600"></div>}
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
    </>
  );
}
