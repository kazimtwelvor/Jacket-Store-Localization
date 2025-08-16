import getCategory from "../../actions/get-category"
import getCategoryProducts from "../../actions/get-category-products"
import getCategories from "../../actions/get-categories"
import getKeywordCategory from "../../actions/get-keyword-category"
import getKeywordCategories from "../../actions/get-keyword-categories"
import getProducts from "../../actions/get-products"
import type { Category } from "@/types"
import CategoryPageClient from "./page-client"
import { notFound } from "next/navigation"
import type { Metadata, ResolvingMetadata } from "next"
import StructuredData from "@/src/app/components/layout/structured-data-layout"

interface CategoryPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: CategoryPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    const { slug } = await params || {}

    if (!slug) {
      return {
        title: "Category Not Found",
        description: "The requested category could not be found.",
      }
    }

    const keywordCategory = await getKeywordCategory(slug)
    
    if (keywordCategory) {
      const keywords = [keywordCategory.focusKeyword, ...keywordCategory.supportingKeywords].filter(Boolean).join(", ")
      
      return {
        title: keywordCategory.seoTitle || keywordCategory.name,
        description: keywordCategory.seoDescription || keywordCategory.description,
        keywords,
        robots: {
          index: keywordCategory.indexPage !== false,
          follow: keywordCategory.followLinks !== false,
        },
        openGraph: {
          title: keywordCategory.ogTitle || keywordCategory.seoTitle || keywordCategory.name,
          description: keywordCategory.ogDescription || keywordCategory.seoDescription || keywordCategory.description,
          type: "website",
          url: keywordCategory.canonicalUrl || `/collections/${slug}`,
        },
        twitter: {
          card: "summary_large_image",
          title: keywordCategory.twitterTitle || keywordCategory.seoTitle || keywordCategory.name,
          description: keywordCategory.twitterDescription || keywordCategory.seoDescription || keywordCategory.description,
        },
        alternates: {
          canonical: keywordCategory.canonicalUrl || `/collections/${slug}`,
        },
        other: {
          'schema': keywordCategory.enableSchema && keywordCategory.customSchema ? keywordCategory.customSchema : undefined,
        },
      }
    }

    const category = await getCategory(slug)

    if (!category) {
      return {
        title: "Category Not Found",
        description: "The requested category could not be found.",
      }
    }

    const previousImages = (await parent).openGraph?.images || []

    const categoryImages = category.billboard?.imageUrl ? [category.billboard.imageUrl] : []
    
    const seoTitle = category.seoTitle || `${category.name} - Premium Collection`
    const seoDescription = category.seoDescription || 
      (category.categoryContent?.mainContent 
        ? category.categoryContent.mainContent.replace(/<[^>]*>/g, '').substring(0, 160)
        : `Explore our premium collection of ${category.name.toLowerCase()} designed with quality and style in mind. Our carefully curated selection offers something for everyone.`)
    
    const keywords = [category.focusKeyword, ...(category.supportingKeywords || [])].filter(Boolean).join(", ")

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: keywords || undefined,
      robots: {
        index: category.indexPage !== false,
        follow: category.followLinks !== false,
      },
      openGraph: {
        title: category.ogTitle || seoTitle,
        description: category.ogDescription || seoDescription,
        images: [...categoryImages, ...previousImages],
        type: "website",
        url: category.canonicalUrl || `/collections/${slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: category.twitterTitle || seoTitle,
        description: category.twitterDescription || seoDescription,
        images: categoryImages.length > 0 ? [categoryImages[0]] : undefined,
      },
      alternates: {
        canonical: category.canonicalUrl || `/collections/${slug}`,
      },
      other: {
        'schema': category.enableSchema && category.customSchema ? category.customSchema : undefined,
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Category",
      description: "View our category collection",
    }
  }
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  try {
    const { slug } = await params || {}

    if (!slug) {
      console.error("No slug provided")
      return notFound()
    }


    const keywordCategory = await getKeywordCategory(slug)
    
    if (keywordCategory) {
      
      let parsedCategoryContent
      try {
        parsedCategoryContent = JSON.parse(keywordCategory.categoryContent)
      } catch (error) {
        console.error("Error parsing categoryContent:", error)
        parsedCategoryContent = {}
      }
      
      const parseApiSlug = (apiSlug: string) => {
        const params = new URLSearchParams(apiSlug)
        return {
          materials: params.get('materials')?.split(',') || [],
          styles: params.get('styles')?.split(',') || [],
          colors: params.get('colors')?.split(',') || [],
          genders: params.get('genders')?.split(',') || [],
        }
      }
      
      const filterParams = parseApiSlug(keywordCategory.apiSlug)
      
      const products = await getProducts({
        materials: filterParams.materials,
        styles: filterParams.styles,
        colors: filterParams.colors,
        genders: filterParams.genders,
        limit: 28,
        page: 1
      })
      
      const allCategories = await getCategories()
      const keywordCategories = await getKeywordCategories()
      
      const categoryForClient: Category & { currentCategory?: any } = {
        id: keywordCategory.id,
        name: keywordCategory.name,
        slug: keywordCategory.slug,
        categoryContent: parsedCategoryContent,
        currentCategory: {
          categoryId: keywordCategory.id,
          categoryName: keywordCategory.name,
          imageUrl: keywordCategory.imageUrl
        }
      }
      
      const keywordStructuredData = []
      if (keywordCategory.enableSchema && keywordCategory.customSchema) {
        try {
          const schemaData = typeof keywordCategory.customSchema === 'string' 
            ? JSON.parse(keywordCategory.customSchema) 
            : keywordCategory.customSchema
          keywordStructuredData.push(schemaData)
        } catch (error) {
          console.error('Error parsing keyword category custom schema:', error)
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
      )
    }

    const category = await getCategory(slug)

    if (!category || !category.id || !category.name) {
      return notFound()
    }

 
    
    if (!category.billboard && category.billboardId) {
      try {
        const billboardResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billboards/${category.billboardId}`)
        if (billboardResponse.ok) {
          const billboard = await billboardResponse.json()
          category.billboard = billboard
          console.log("Fetched billboard data:", JSON.stringify(billboard, null, 2))
        }
      } catch (error) {
        console.error("Failed to fetch billboard:", error)
      }
    }

    const products = await getCategoryProducts({ slug })
    
    const allCategories = await getCategories()
    const keywordCategories = await getKeywordCategories()

    console.log(`Found ${products.length} products for category ${category.name}`)

    const categoryStructuredData = []
    if (category.enableSchema && category.customSchema) {
      try {
        const schemaData = typeof category.customSchema === 'string' 
          ? JSON.parse(category.customSchema) 
          : category.customSchema
        categoryStructuredData.push(schemaData)
      } catch (error) {
        console.error('Error parsing category custom schema:', error)
      }
    }
    
    return (
      <div className="min-h-screen bg-white">
        <StructuredData data={categoryStructuredData} />
        <CategoryPageClient 
          category={category} 
          products={products} 
          slug={slug}
          allCategories={allCategories}
          keywordCategories={keywordCategories}
          isKeywordCategory={false}
        />
      </div>
    )
  } catch (error) {
    console.error("Error rendering category page:", error)

    return (
      <section className="min-h-screen bg-white p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Category</h1>
        <p className="mb-4">We encountered an error while trying to load this category.</p>
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-bold mb-2">Technical Details:</h3>
          <p className="font-mono text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
        <div className="mt-8">
          <a href="/" className="text-blue-600 hover:underline">
            Return to Home Page
          </a>
        </div>
      </section>
    )
  }
}

export default CategoryPage