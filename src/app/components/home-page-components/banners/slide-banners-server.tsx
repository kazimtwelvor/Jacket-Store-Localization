import { SlideBannerProps } from "./types"
import SlideBannersClient from "./slide-banners-client"

export const revalidate = 3600 

const defaultBannerData = {
    heroImages: [
        { src: "/images/hero-banner-2.webp", alt: "Hero banner showcasing fine jackets collection" },
        { src: "/images/banner.webp", alt: "Banner featuring premium leather jackets" }
    ],
    interval: 5000
}

export default function SlideBannersServer({
    heroImages = defaultBannerData.heroImages,
    interval = defaultBannerData.interval,
    className = ""
}: SlideBannerProps) {
    return (
        <SlideBannersClient
            heroImages={heroImages}
            interval={interval}
            className={className}
        />
    )
}
