export interface Billboard {
  id: string
  label: string
  imageUrl: string
}

export interface KeywordCategory {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  bannerImageUrl?: string
  materials?: string[]
  styles?: string[]
  colors?: string[]
  genders?: string[]
  seoTitle?: string
  seoDescription?: string
  focusKeyword?: string
  supportingKeywords?: string[]
  
  // Open Graph fields
  ogTitle?: string
  ogDescription?: string
  
  // Twitter fields
  twitterTitle?: string
  twitterDescription?: string
  
  // Technical SEO fields
  canonicalUrl?: string
  indexPage?: boolean
  followLinks?: boolean
  
  // Schema fields
  enableSchema?: boolean
  schemaType?: string
  customSchema?: string
  
  // Additional fields
  apiSlug?: string
  categoryContent?: any
  
  isPublished?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: string
  name: string
  slug?: string
  billboard?: Billboard
  imageUrl?: string
  href?: string
  gender?: string
  description?: string
  categoryContent?: any
  
  // SEO fields
  seoTitle?: string
  seoDescription?: string
  focusKeyword?: string
  supportingKeywords?: string[]
  
  // Open Graph fields
  ogTitle?: string
  ogDescription?: string
  
  // Twitter fields
  twitterTitle?: string
  twitterDescription?: string
  
  // Technical SEO fields
  canonicalUrl?: string
  indexPage?: boolean
  followLinks?: boolean
  
  // Schema fields
  enableSchema?: boolean
  schemaType?: string
  customSchema?: string
  
  // Publishing fields
  isPublished?: boolean
  publishedAt?: string | null
  
  // Timestamps
  createdAt?: string
  updatedAt?: string
  
  // Additional fields for keyword categories
  apiSlug?: string
  materials?: string[]
  styles?: string[]
  colors?: string[]
  genders?: string[]
  bannerImageUrl?: string
  
  // Current category info (for display purposes)
  currentCategory?: {
    categoryId: string
    categoryName: string
    imageUrl: string
  }
}

export interface Product {
  id: string
  category: Category
  name: string
  price: string
  originalPrice?: string
  salePrice?: string | null
  isFeatured: boolean
  isPublished: boolean
  isArchived?: boolean
  isDeleted?: boolean
  images: ProductImage[]

  // Basic product information
  description?: string | null
  careInstructions?: string
  sku?: string
  stockStatus?: string
  specifications?: any
  storeId?: string
  slug?: string

  // Product variants
  colorDetails?: any[] | null
  sizeDetails?: any[] | null

  // Product classification
  isDiscounted?: boolean
  material?: string[]
  style?: string[]
  tags?: string[]
  gender?: string
  colorLinks?: any | null
  productType?: string
  isVirtual?: boolean
  isDownloadable?: boolean

  // SEO fields
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  additionalKeywords?: string[]
  keywords?: string[]
  noIndex?: boolean

  // Structured data
  schema?: any

  // Brand and ratings
  brandName?: string
  ratingValue?: string
  reviewCount?: string

  // Additional fields
  menuOrder?: string | null
  weight?: string | null
  length?: string | null
  width?: string | null
  height?: string | null
  purchaseNote?: string

  // Timestamps
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

export interface Image {
  id: string
  url: string
  altText?: string
  title?: string
  caption?: string
  description?: string
  excludeFromSitemap?: boolean
}

export interface ProductImage {
  id: string
  productId: string
  imageId: string
  image: Image
  order: number
  isPrimary: boolean
}

export interface Size {
  id: string
  name: string
  value: string
}
export interface Color {
  id: string
  name: string
  value: string
}
