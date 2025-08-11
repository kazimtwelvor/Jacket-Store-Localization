export interface HeroImage {
  src: string
  alt: string
  priority?: boolean
}

export interface SlideBannerProps {
  heroImages?: HeroImage[]
  interval?: number
  className?: string
}

export interface AnimatedBackgroundProps {
  images: HeroImage[]
  currentIndex: number
}

export interface OptimizedBackgroundImageProps {
  image: HeroImage
  className?: string
  priority?: boolean
}

export interface LoadingBannerProps {
  heroImages: HeroImage[]
  currentImageIndex: number
}
