import getProduct from "@/src/app/actions/get-product"
import getProducts from "@/src/app/actions/get-products"
import { notFound, redirect } from "next/navigation"
import type { Metadata, ResolvingMetadata } from "next"
import type { Product, ProductImage } from "@/types"
import GalleryWrapper from "@/src/app/components/product-page/gallery-wrapper"
import Info from "@/src/app/components/product-page/info"
import StickyProductDetails from "@/src/app/components/product-page/StickyProductDetails"
import { ProductSuggestionsSection } from "@/src/app/components/product-page/ProductSuggestionsSection"
import StructuredData from "@/src/app/components/layout/structured-data"
import ProductPageClient from "./page-client"


interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate metadata for the product page
export async function generateMetadata({ params }: ProductPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    const { slug: slugOrId } = await params || {}

    if (!slugOrId) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      }
    }

    // Get the product data
    const product = await getProduct(slugOrId)

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      }
    }

    // Get default metadata from parent
    const previousImages = (await parent).openGraph?.images || []

    // Prepare product images for OpenGraph
    const productImages =
      product.images && product.images.length > 0
        ? product.images.map((img: any) => img.url || img.image?.url).filter(Boolean)
        : []

    // Prepare keywords array
    const keywordsArray = [
      ...(product.keywords || []),
      ...(product.additionalKeywords || []),
      ...(product.tags || []),
    ].filter(Boolean)

    return {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.description || `Buy ${product.name} online.`,
      keywords: keywordsArray.length > 0 ? keywordsArray.join(", ") : undefined,
      robots: {
        index: product.noIndex !== true,
        follow: product.noIndex !== true,
      },
      openGraph: {
        title: product.metaTitle || product.name,
        description: product.metaDescription || product.description || `Buy ${product.name} online.`,
        images: [...productImages, ...previousImages],
        type: "website",
        url: `/product/${product.slug || slugOrId}`,
      },
      twitter: {
        card: "summary_large_image",
        title: product.metaTitle || product.name,
        description: product.metaDescription || product.description || `Buy ${product.name} online.`,
        images: productImages.length > 0 ? [productImages[0]] : undefined,
      },
      alternates: {
        canonical: `/product/${product.slug || slugOrId}`,
      },
      other: {
        "og:price:amount": product.isDiscounted && product.salePrice ? product.salePrice : product.price,
        "og:price:currency": "USD",
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Product",
      description: "View our product details",
    }
  }
}

const ProductPage = async ({ params }: ProductPageProps) => {
  try {
    // Safely access the slug parameter - properly await it to avoid Next.js warning
    const { slug: slugOrId } = await params || {}

    if (!slugOrId) {
      console.error("No slug or ID provided")
      return notFound()
    }


    // Get the product using the slug or ID parameter
    const product = await getProduct(slugOrId)

    // If product doesn't have required fields, show 404
    if (!product || !product.id || !product.name) {
      return notFound()
    }


    // If the product has a proper slug and it's different from the current URL parameter,
    // redirect to the URL with the proper slug for better SEO
    if (product.slug && product.slug !== slugOrId && product.id === slugOrId) {
      return redirect(`/product/${product.slug}`)
    }

    // Fetch related products, but don't fail if this doesn't work
    let suggestProducts: Product[] = []
    try {
      const productsResult = await getProducts({})
      // Extract products array from the response object and filter out current product
      suggestProducts = productsResult.products ? productsResult.products.filter((p) => p.id !== product.id).slice(0, 8) : []
    } catch (error) {
      console.error("Error fetching suggested products:", error)
      suggestProducts = []
    }

    // Ensure images array exists and has a default structure
    const productImages = product.images || []
    const formattedImages: ProductImage[] = productImages.map((img: any, index: number) => ({
      id: img.id || img.imageId || `temp-${index}`,
      productId: product.id,
      imageId: img.imageId || img.id || `temp-${index}`,
      image: {
        id: img.image?.id || img.id || `temp-${index}`,
        url: img.url || img.image?.url || "/placeholder.svg",
        altText: img.altText || img.image?.altText || product.name,
        title: img.title || img.image?.title || product.name,
      },
      order: index,
      isPrimary: index === 0,
    }))

    const schemaArray = []

    if (product.schema) {
      try {
        const schemaData = typeof product.schema === "string" ? JSON.parse(product.schema) : product.schema

        if (schemaData && typeof schemaData === "object") {
          Object.values(schemaData).forEach((schema) => {
            if (schema && typeof schema === "object") {
              schemaArray.push(schema)
            }
          })
        }
      } catch (e) {
        console.error("Error processing schema:", e)
      }
    }

    if (schemaArray.length === 0) {
      const basicSchema: any = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || "",
        image: formattedImages.map(img => img.image.url),
        sku: product.sku || "",
        brand: {
          "@type": "Brand",
          name: product.brandName || "Brand Name",
        },
        offers: {
          "@type": "Offer",
          url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/product/${product.slug || slugOrId}`,
          priceCurrency: "USD",
          price: product.isDiscounted && product.salePrice ? product.salePrice : product.price,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
        },
      }

      
      if (product.ratingValue && product.reviewCount) {
        basicSchema.aggregateRating = {
          "@type": "AggregateRating",
          ratingValue: product.ratingValue,
          reviewCount: product.reviewCount,
        }
      }

      schemaArray.push(basicSchema)
    }

    return (
      <div className="min-h-screen bg-white" style={{scrollBehavior: 'smooth'}}>
        {/* Structured Data */}
        <StructuredData data={schemaArray} />
        
        {/* Client component to capture referrer */}
        <ProductPageClient />
        

        {/* Mobile and Tablet Layout */}
        <div className="block lg:hidden">
          {/* Mobile Breadcrumb */}
          <div className="pt-16 pb-2 px-4">
            <nav className="flex items-center justify-center text-xs">
              <span className="text-gray-500 hover:text-black uppercase font-medium">SHOP</span>
              <span className="mx-1 text-gray-500">/</span>
              <span className="text-gray-500 hover:text-black uppercase font-medium">LEATHER</span>
              <span className="mx-1 text-gray-500">/</span>
              <span className="text-black truncate max-w-[80px] uppercase font-medium" title={product.name}>
                {product.name.length > 12 ? `${product.name.substring(0, 12)}...` : product.name}
              </span>
            </nav>
          </div>
          
          <div className="w-full">
            <GalleryWrapper images={formattedImages} product={product} />
            <div className="mt-2 px-1 sm:px-8">
              <Info data={product} isMobile />
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="max-w-[1920px] w-full mx-auto">
            <div className="flex relative">
              <div className="w-[60%]">
                <GalleryWrapper images={formattedImages} product={product} />
              </div>
              <StickyProductDetails product={product} />
            </div>
          </div>
        </div>
        
        {/* Product Suggestions - Full Width Outside Grid */}
        <div className="w-full">
          <ProductSuggestionsSection
            suggestProducts={suggestProducts}
            isMobile={false}
          />
        </div>

      </div>
    
    )
  } catch (error) {
    console.error("Error rendering product page:", error)

    // Display error page with details
    return (
      <div className="min-h-screen bg-white p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h1>
        <p className="mb-4">We encountered an error while trying to load this product.</p>
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-bold mb-2">Technical Details:</h3>
          <p className="font-mono text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
        <div className="mt-8">
          <a href="/" className="text-blue-600 hover:underline">
            Return to Home Page
          </a>
        </div>
      </div>
    )
  }
}

export default ProductPage