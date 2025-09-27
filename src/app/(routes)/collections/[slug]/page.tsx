export const revalidate = false; // Make it fully static
export const dynamicParams = true; // Generate new pages on-demand
import getCategories from "../../../actions/get-categories";
import getKeywordCategory from "../../../actions/get-keyword-category";
import getKeywordCategories from "../../../actions/get-keyword-categories";
import getProducts from "../../../actions/get-products";
import type { Category, Product } from "@/types";
import CategoryPageClient from "./page-client";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import StructuredData from "../../../components/layout/structured-data-layout";
// import { Suspense } from "react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const keywordCategories = await getKeywordCategories();
    return keywordCategories.slice(0, 10).map((category: any) => ({
      slug: category.slug,
    }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata(
  { params }: CategoryPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { slug } = (await params) || {};

    if (!slug) {
      return {
        title: "Category Not Found",
        description: "The requested category could not be found.",
      };
    }

    const keywordCategory = await getKeywordCategory(slug);

    if (!keywordCategory) {
      return {
        title: "Category Not Found",
        description: "The requested category could not be found.",
      };
    }

    const keywords = [
      keywordCategory.focusKeyword,
      ...(keywordCategory.supportingKeywords || []),
    ]
      .filter(Boolean)
      .join(", ");

    return {
      title: keywordCategory.seoTitle || keywordCategory.name,
      description:
        keywordCategory.seoDescription || keywordCategory.description,
      ...(keywords ? { keywords } : {}),
      robots: {
        index: keywordCategory.indexPage !== false,
        follow: keywordCategory.followLinks !== false,
      },
      openGraph: {
        title:
          keywordCategory.ogTitle ||
          keywordCategory.seoTitle ||
          keywordCategory.name,
        description:
          keywordCategory.ogDescription ||
          keywordCategory.seoDescription ||
          keywordCategory.description,
        type: "website",
        url: keywordCategory.canonicalUrl || `https://www.fineystjackets.com/us/collections/${slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title:
          keywordCategory.twitterTitle ||
          keywordCategory.seoTitle ||
          keywordCategory.name,
        description:
          keywordCategory.twitterDescription ||
          keywordCategory.seoDescription ||
          keywordCategory.description,
      },
      alternates: {
        canonical: keywordCategory.canonicalUrl || `https://www.fineystjackets.com/us/collections/${slug}`,
      },
      ...(keywordCategory.enableSchema && keywordCategory.customSchema
        ? {
            other: {
              schema: keywordCategory.customSchema,
            },
          }
        : {}),
    };
  } catch (error) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  try {
    const { slug } = (await params) || {};

    if (!slug) {
      return notFound();
    }

    const keywordCategory = await getKeywordCategory(slug);

    if (!keywordCategory) {
      return notFound();
    }

    let parsedCategoryContent;
    try {
      parsedCategoryContent = JSON.parse(keywordCategory.categoryContent);
    } catch (error) {
      parsedCategoryContent = {};
    }

    const parseApiSlug = (apiSlug: string) => {
      const params = new URLSearchParams(apiSlug);
      return {
        materials: params.get("materials") ? params.get("materials")!.split(",").map(s => s.trim()) : [],
        styles: params.get("styles") ? params.get("styles")!.split(",").map(s => s.trim()) : [],
        colors: params.get("colors") ? params.get("colors")!.split(",").map(s => s.trim()) : [],
        genders: params.get("genders") ? params.get("genders")!.split(",").map(s => s.trim()) : [],
      };
    };

    const filterParams = parseApiSlug(keywordCategory.apiSlug || "");
    
    // Fetch only the first 40 products for static generation
    const [products, allCategories, keywordCategories] = await Promise.all([
      getProducts({
        materials: filterParams.materials,
        styles: filterParams.styles,
        colors: filterParams.colors,
        genders: filterParams.genders,
        limit: 40, // Only fetch first 40 products for static generation
        page: 1,
      }),
      getCategories(),
      getKeywordCategories()
    ]);

    const categoryForClient: Category & { currentCategory?: any } = {
      id: keywordCategory.id,
      name: keywordCategory.name,
      slug: keywordCategory.slug,
      categoryContent: parsedCategoryContent,
      currentCategory: {
        categoryId: keywordCategory.id,
        categoryName: keywordCategory.name,
        imageUrl: keywordCategory.imageUrl || "",
      },
    };

    const keywordStructuredData = [];
    if (keywordCategory.enableSchema && keywordCategory.customSchema) {
      try {
        const schemaData =
          typeof keywordCategory.customSchema === "string"
            ? JSON.parse(keywordCategory.customSchema)
            : keywordCategory.customSchema;
        keywordStructuredData.push(schemaData);
      } catch (error) {
        // Schema parsing failed, skip
      }
    }

    return (
      <div className="min-h-screen bg-white">
        <StructuredData data={keywordStructuredData} />
        <CategoryPageClient
          category={categoryForClient}
          products={products.products || []}
          slug={slug}
          allCategories={allCategories}
          keywordCategories={keywordCategories}
          isKeywordCategory={true}
          filterParams={filterParams}
          initialProductCount={products.products?.length || 0}
          hasMoreProducts={(products.pagination?.totalProducts || 0) > 40}
        />
      </div>
    );
  } catch (error) {
    return notFound();
  }
};

export default CategoryPage;
