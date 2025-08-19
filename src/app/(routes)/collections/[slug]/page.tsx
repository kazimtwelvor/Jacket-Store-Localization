export const dynamic = "force-dynamic";
import getCategories from "../../../actions/get-categories";
import getKeywordCategory from "../../../actions/get-keyword-category";
import getKeywordCategories from "../../../actions/get-keyword-categories";
import getProducts from "../../../actions/get-products";
import type { Category } from "@/types";
import CategoryPageClient from "./page-client";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import StructuredData from "../../../components/layout/structured-data-layout";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
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
        url: keywordCategory.canonicalUrl || `/collections/${slug}`,
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
        canonical: keywordCategory.canonicalUrl || `/collections/${slug}`,
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
        materials: params.get("materials")?.split(",") || [],
        styles: params.get("styles")?.split(",") || [],
        colors: params.get("colors")?.split(",") || [],
        genders: params.get("genders")?.split(",") || [],
      };
    };

    const filterParams = parseApiSlug(keywordCategory.apiSlug || "");

    const products = await getProducts({
      materials: filterParams.materials,
      styles: filterParams.styles,
      colors: filterParams.colors,
      genders: filterParams.genders,
      limit: 28,
      page: 1,
    });

    const allCategories = await getCategories();
    const keywordCategories = await getKeywordCategories();

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
        />
      </div>
    );
  } catch (error) {
    return notFound();
  }
};

export default CategoryPage;
