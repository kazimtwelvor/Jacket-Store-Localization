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

  ogTitle?: string
  ogDescription?: string

  twitterTitle?: string
  twitterDescription?: string

  canonicalUrl?: string
  indexPage?: boolean
  followLinks?: boolean

  enableSchema?: boolean
  schemaType?: string
  customSchema?: string

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

  seoTitle?: string
  seoDescription?: string
  focusKeyword?: string
  supportingKeywords?: string[]

  ogTitle?: string
  ogDescription?: string

  twitterTitle?: string
  twitterDescription?: string

  canonicalUrl?: string
  indexPage?: boolean
  followLinks?: boolean

  enableSchema?: boolean
  schemaType?: string
  customSchema?: string

  isPublished?: boolean
  publishedAt?: string | null

  createdAt?: string
  updatedAt?: string

  apiSlug?: string
  materials?: string[]
  styles?: string[]
  colors?: string[]
  genders?: string[]
  bannerImageUrl?: string

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

  description?: string | null
  careInstructions?: string
  sku?: string
  stockStatus?: string
  specifications?: any
  storeId?: string
  slug?: string

  colorDetails?: any[] | null
  sizeDetails?: any[] | null

  isDiscounted?: boolean
  material?: string[]
  style?: string[]
  tags?: string[]
  gender?: string
  colorLinks?: any | null
  productType?: string
  isVirtual?: boolean
  isDownloadable?: boolean

  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  additionalKeywords?: string[]
  keywords?: string[]
  noIndex?: boolean

  schema?: any

  brandName?: string
  ratingValue?: string
  reviewCount?: string

  menuOrder?: string | null
  weight?: string | null
  length?: string | null
  width?: string | null
  height?: string | null
  purchaseNote?: string

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
