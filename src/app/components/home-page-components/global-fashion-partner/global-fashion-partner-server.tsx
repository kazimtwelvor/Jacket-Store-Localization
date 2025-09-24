import { unstable_cache } from "next/cache";
import GlobalFashionPartnerClient from "@/src/app/components/home-page-components/global-fashion-partner/global-fashion-partner-client";

export const revalidate = 3600;

interface Partner {
  brand: string;
  logoUrl: string;
  testimonial: string;
  specialty: string;
}

const getCachedPartnerData = unstable_cache(
  async (): Promise<Partner[]> => {
    return [
      { brand: "Forbes", logoUrl: "/images/featured-images/forbes.webp", testimonial: "Leading the luxury outerwear market with exceptional craftsmanship", specialty: "Business & Luxury" },
      { brand: "CNN", logoUrl: "/images/featured-images/CNN.webp", testimonial: "Premium quality jackets that define modern fashion", specialty: "Fashion & Style Coverage" },
      { brand: "New York Times", logoUrl: "/images/featured-images/newyork-times.webp", testimonial: "Setting trends in contemporary jacket design and quality", specialty: "Fashion Editorial" },
      { brand: "Reddit", logoUrl: "/images/featured-images/reddit.webp", testimonial: "Community favorite for quality and authentic fashion discussions", specialty: "Community Reviews" },
      { brand: "Google News", logoUrl: "/images/featured-images/google-news.webp", testimonial: "Breaking news in fashion with innovative jacket collections", specialty: "News & Updates" },
      { brand: "Blogger", logoUrl: "/images/featured-images/blogger.webp", testimonial: "Featured by top fashion bloggers for exceptional style", specialty: "Fashion Blogging" },
      { brand: "Medium", logoUrl: "/images/featured-images/medium.webp", testimonial: "In-depth stories about sustainable fashion and quality craftsmanship", specialty: "Fashion Stories" },
      { brand: "Bloom", logoUrl: "/images/featured-images/bloom.webp", testimonial: "Showcasing the finest in contemporary outerwear design", specialty: "Lifestyle & Fashion" }
    ];
  },
  ['global-fashion-partners'],
  { revalidate: 3600, tags: ['partners'] }
);

export default async function GlobalFashionPartnerServer() {
  const partners = await getCachedPartnerData();

  return <GlobalFashionPartnerClient partners={partners} />;
}
