export const dynamic = 'force-static';     
export const dynamicParams = true;         
export const revalidate = false;        
import getCategories from "../../../actions/get-categories";
import getKeywordCategory from "../../../actions/get-keyword-category";
import getKeywordCategories from "../../../actions/get-keyword-categories";
import getProducts from "../../../actions/get-products";
import type { Category, Product } from "@/types";
import CategoryPageClient from "./page-client";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import StructuredData from "../../../components/layout/structured-data-layout";
import CollectionSchema from "../../../components/schema/collection-schema";
// import { Suspense } from "react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    
    let categoriesResult = null;
    
    try {
      categoriesResult = await getKeywordCategories();
    } catch (error) {
      console.warn('⚠️ Failed to fetch keyword categories, trying fallback...');
      
      try {
        const regularCategories = await getCategories();
        categoriesResult = regularCategories?.slice(0, 20) || [];
      } catch (error2) {
        console.error('❌ All category fetch strategies failed:', error2);
        return [];
      }
    }
    
    if (!categoriesResult?.length) {
      console.warn('⚠️ No categories found, returning empty array');
      return [];
    }
    
    const collectionCount = process.env.NEXT_COLLECTION_COUNT ? parseInt(process.env.NEXT_COLLECTION_COUNT) : 20;
    const params = categoriesResult.slice(0, collectionCount).map((category: any) => ({
      slug: category.slug,
    }));
    
    return params;
    
  } catch (error) {
    console.error('❌ Critical error in generateStaticParams:', error);
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
        collars: params.get("collars") ? params.get("collars")!.split(",").map(s => s.trim()) : [],
        cuffs: params.get("cuffs") ? params.get("cuffs")!.split(",").map(s => s.trim()) : [],
        closures: params.get("closures") ? params.get("closures")!.split(",").map(s => s.trim()) : [],
        pockets: params.get("pockets") ? params.get("pockets")!.split(",").map(s => s.trim()) : [],
      };
    };

    const filterParams = parseApiSlug(keywordCategory.apiSlug || "");
    
    const fetchWithRetry = async (fetchFn: () => Promise<any>, retries = 3, timeout = 300000): Promise<any> => {
      for (let i = 0; i < retries; i++) {
        try {
          if (i > 0) {
            const delay = Math.pow(2, i) * 2000; 
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), timeout);
          });
          
          return await Promise.race([fetchFn(), timeoutPromise]);
        } catch (error) {
          console.warn(`Attempt ${i + 1} failed for collection ${slug}:`, error);
          if (i === retries - 1) throw error;
        }
      }
      throw new Error('All retry attempts failed');
    };

    const [products, allCategories, keywordCategories] = await Promise.all([
      fetchWithRetry(() => getProducts({
        materials: filterParams.materials,
        styles: filterParams.styles,
        colors: filterParams.colors,
        genders: filterParams.genders,
        collars: filterParams.collars,
        cuffs: filterParams.cuffs,
        closures: filterParams.closures,
        pockets: filterParams.pockets,
        limit: 40,
        page: 1,
      })),
      fetchWithRetry(() => getCategories()),
      fetchWithRetry(() => getKeywordCategories())
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
        <CollectionSchema collectionName={keywordCategory.name} collectionSlug={slug} />
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
