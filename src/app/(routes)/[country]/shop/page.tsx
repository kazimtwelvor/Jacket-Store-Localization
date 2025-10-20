import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductsPageClient from "@/src/app/components/shop/products-page-client";
import getProducts from "@/src/app/actions/get-products";
import getCategories from "@/src/app/actions/get-categories";
import getSizes from "@/src/app/actions/get-sizes";
import getColors from "@/src/app/actions/get-colors";
import getKeywordCategories from "@/src/app/actions/get-keyword-categories";
import { getCountries } from "@/src/app/actions/get-countries";

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const { country: countryCode } = params;
  const baseUrl = 'https://www.fineystjackets.com';
  
  return {
    title: "Shop Premium Jackets and Outerwear | Fineyst",
    description: "Shop FINEYST's premium jackets, coats, and outerwear collection. Sustainable fashion with free shipping over $100, easy returns, and expert customer support. Find your perfect fit today.",
    alternates: {
      canonical: `${baseUrl}/${countryCode}/shop`,
      languages: {
        'x-default': `${baseUrl}/us/shop`,
        'en-US': `${baseUrl}/us/shop`, // Self-reference + cross-reference
        'en-GB': `${baseUrl}/uk/shop`, // Cross-reference
        'en-CA': `${baseUrl}/ca/shop`, // Cross-reference
        'en-AU': `${baseUrl}/au/shop`, // Cross-reference
      }
    }
  };
}

export const revalidate = 300;
export const dynamic = "auto";
export const fetchCache = "default-cache";

export async function generateStaticParams() {
  try {
    const countries = await getCountries();
    
    return countries.map((country) => ({
      country: country.countryCode,
    }));
  } catch (error) {
    return [
      { country: 'us' },
      { country: 'ca' },
      { country: 'uk' },
      { country: 'au' }
    ];
  }
}

type ShopPageProps = {
  params: { country: string };
  searchParams: Promise<{
    page?: string;
    limit?: string;
    categoryId?: string;
    colorId?: string;
    sizeId?: string;
    search?: string;
    genders?: string;
    materials?: string;
    styles?: string;
    colors?: string;
    sizes?: string;
    sort?: string;
  }>;
};

export default async function ShopPage({ params, searchParams }: ShopPageProps) {
  const countryCode = params.country;
  const resolvedSearchParams = await searchParams;
  const page = Number.parseInt(resolvedSearchParams.page || "1");
  const limit = 40;

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
        countryCode, // Add country code
      }),
      getCategories({ countryCode }),
      getColors({ countryCode }),
      getSizes({ countryCode }),
      getKeywordCategories({ countryCode }),
    ]);

  const products =
    productsData.status === "fulfilled" ? productsData.value : null;
  const categoriesData =
    categories.status === "fulfilled" ? categories.value : [];
  const colorsData = colors.status === "fulfilled" ? colors.value : [];
  const sizesData = sizes.status === "fulfilled" ? sizes.value : [];
  const keywordCategoriesData =
    keywordCategories.status === "fulfilled" ? keywordCategories.value : [];

    if (!products) {
      return notFound();
    }

  const fallbackPagination = {
    currentPage: page,
    totalPages: 0,
    totalProducts: 0,
    productsPerPage: limit,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const safeProducts = products?.products || [];
  const safePagination = products?.pagination || fallbackPagination;

  return (
    <ProductsPageClient
      initialProductsData={{
        products: safeProducts,
        pagination: safePagination
      }}
      categories={categoriesData}
      colors={colorsData}
      sizes={sizesData}
      keywordCategories={keywordCategoriesData}
      countryCode={countryCode}
    />
  );
}
