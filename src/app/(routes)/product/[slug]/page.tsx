import getProduct from "@/src/app/actions/get-product"
import getProducts from "@/src/app/actions/get-products"
import { notFound, redirect } from "next/navigation"
import type { Metadata, ResolvingMetadata } from "next"
import type { Product, ProductImage } from "@/types"
import GalleryWrapper from "@/src/app/components/product-page/gallery-wrapper"
import Info from "@/src/app/components/product-page/info"
import StickyProductDetails from "@/src/app/components/product-page/StickyProductDetails"
import { ProductSuggestionsSection } from "@/src/app/components/product-page/ProductSuggestionsSection"
import StructuredData from "@/src/app/components/layout/structured-data-layout"
import ProductPageClient from "./page-client"


export const dynamic = 'force-static';     // Force static generation
export const dynamicParams = true;         // Allow on-demand generation for missing routes
export const revalidate = false;           // No revalidation for pure static

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  try {
    let productsResult = null;
    try {
      productsResult = await getProducts({ limit: 100 });
    } catch (error) {
      console.warn('⚠️ Failed to fetch 100 products, trying smaller batch...');
      
      try {
        productsResult = await getProducts({ limit: 50 });
      } catch (error2) {
        console.warn('⚠️ Failed to fetch 50 products, trying minimal batch...');
        
        try {
          productsResult = await getProducts({ limit: 10 });
        } catch (error3) {
          return [];
        }
      }
    }
    
    if (!productsResult?.products?.length) {
      console.warn('⚠️ No products found, returning empty array');
      return [];
    }
    
    const params = productsResult.products.map((product: any) => ({
      slug: product.slug || product.id,
    }));
    
    return params;
    
  } catch (error) {
    return [];
  }
}


export async function generateMetadata({ params }: ProductPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    const { slug: slugOrId } = await params || {}

    if (!slugOrId) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      }
    }

    const product = await getProduct(slugOrId)

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      }
    }

    const previousImages = (await parent).openGraph?.images || []

    const productImages =
      product.images && product.images.length > 0
        ? product.images.map((img: any) => img.url || img.image?.url).filter(Boolean)
        : []

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
        url: `https://www.fineystjackets.com/us/product/${product.slug || slugOrId}`,
      },
      twitter: {
        card: "summary_large_image",
        title: product.metaTitle || product.name,
        description: product.metaDescription || product.description || `Buy ${product.name} online.`,
        images: productImages.length > 0 ? [productImages[0]] : undefined,
      },
      alternates: {
        canonical: `https://www.fineystjackets.com/us/product/${product.slug || slugOrId}`,
      },
      other: {
        "og:price:amount": product.isDiscounted && product.salePrice ? product.salePrice : product.price,
        "og:price:currency": "USD",
      },
    }
  } catch (error) {
    return {
      title: "Product",
      description: "View our product details",
    }
  }
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug: slugOrId } = await params || {}

  if (!slugOrId) {
    return notFound()
  }

  let product = null
  try {
    product = await getProduct(slugOrId)
  } catch (error) {
    try {
      const productsResult = await getProducts({ limit: 10000 })
      product = productsResult.products?.find(p => {
        const nameSlug = p.name?.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
        return p.id === slugOrId || p.slug === slugOrId || nameSlug === slugOrId
      }) || null
    } catch (fallbackError) {
    }
  }

  if (!product) {
    return notFound()
  }


  if (product?.slug && product.slug !== slugOrId && product.id === slugOrId) {
    redirect(`/product/${product.slug}`)
  }

  let suggestProducts: Product[] = []
  try {
    const productsResult = await getProducts({})
    suggestProducts = productsResult.products ? productsResult.products.filter((p) => p.id !== product.id).slice(0, 8) : []
  } catch (error) {
    suggestProducts = []
  }

  const productImages = product?.images || []
  const formattedImages: ProductImage[] = productImages.map((img: any, index: number) => ({
    id: img.id || img.imageId || `temp-${index}`,
    productId: product?.id,
    imageId: img.imageId || img.id || `temp-${index}`,
    image: {
      id: img.image?.id || img.id || `temp-${index}`,
      url: img.url || img.image?.url || "/placeholder.svg",
      altText: img.altText || img.image?.altText || product?.name,
      title: img.title || img.image?.title || product?.name,
    },
    order: index,
    isPrimary: index === 0,
  }))

  const schemaArray = []

  if (product?.schema) {
    try {
      const schemaData = typeof product.schema === "string" ? JSON.parse(product.schema) : product.schema

      if (schemaData && typeof schemaData === "object") {
        Object.values(schemaData).forEach((schema: any) => {
          if (schema && typeof schema === "object") {
            if (schema.offers && !schema.offers.hasRefundPolicy) {
              schema.offers.hasRefundPolicy = {
                "@type": "RefundPolicy",
                "refundType": "FullRefund",
                "refundMethod": "OriginalPaymentMethod",
                "returnFees": "FreeReturn"
              }
            }
            schemaArray.push(schema)
          }
        })
      }
    } catch (e) {
    }
  }

  if (schemaArray.length === 0) {
    const basicSchema: any = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product?.name,
      description: product?.description || "",
      image: formattedImages.map(img => img.image.url),
      sku: product?.sku || "",
      brand: {
        "@type": "Brand",
        name: product?.brandName || "Brand Name",
      },
      offers: {
        "@type": "Offer",
        url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/product/${product?.slug || slugOrId}`,
        priceCurrency: "USD",
        price: product?.isDiscounted && product?.salePrice ? product?.salePrice : product?.price,
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        hasRefundPolicy: {
          "@type": "RefundPolicy",
          "refundType": "FullRefund",
          "refundMethod": "OriginalPaymentMethod",
          "returnFees": "FreeReturn"
        },
      },
    }

    if (product?.ratingValue && product?.reviewCount) {
      basicSchema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: product?.ratingValue,
        reviewCount: product?.reviewCount,
      }
    }

    schemaArray.push(basicSchema)
  }

  return (
    <div className="min-h-screen bg-white" style={{ scrollBehavior: 'smooth' }}>
      <StructuredData data={schemaArray} />
      
      <div className="sr-only">
        <h1>{product?.name?.toUpperCase()}</h1>
        <h2>{product?.category?.name ? `${product.category.name} - ${product.name}` : `Details-${product.name}`}</h2>
      </div>

      <ProductPageClient productId={product.id} product={product} />


      <div className="block lg:hidden">
        <div className="pt-4 pb-2 px-4">
          <nav className="flex items-center justify-center text-xs">
            <span className="text-gray-500 hover:text-black uppercase font-medium">SHOP</span>
            <span className="mx-1 text-gray-500">/</span>
            <span className="text-gray-500 hover:text-black uppercase font-medium">LEATHER</span>
            <span className="mx-1 text-gray-500">/</span>
            <span className="text-black truncate max-w-[80px] uppercase font-medium" title={product?.name}>
              {product?.name?.length > 12 ? `${product?.name.substring(0, 12)}...` : product?.name}
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

      <div className="w-full">
        <ProductSuggestionsSection
          suggestProducts={suggestProducts}
          relatedProductIds={product?.relatedProducts}
          isMobile={false}
        />
      </div>

    </div>
  )
}

export default ProductPage