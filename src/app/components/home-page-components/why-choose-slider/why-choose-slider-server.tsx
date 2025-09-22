import { unstable_cache } from "next/cache";
import WhyChooseSliderClient from "@/src/app/components/home-page-components/why-choose-slider/why-choose-slider-client";

export const revalidate = 3600; 

interface Slide {
  id: number;
  title: string;
  description: string;
  features: string[];
  imageUrl: string;
}

const getCachedSlides = unstable_cache(
  async (): Promise<Slide[]> => {
    return [
      {
        id: 1,
        title: "UNMATCHED CRAFTSMANSHIP",
        description: "Hours of artisan detail go into every jacket. From reinforced stitching to premium hardware, we build jackets that stand the test of time.",
        features: [
          "Reinforced stitching techniques",
          "Premium YKK zippers",
          "Quality lining materials",   
          "Artisan-level attention to detail",
        ],
        imageUrl: "https://jacket.us.com/uploads/2025/craftmanship_banner_2.webp",
      },
      {
        id: 3,
        title: "PREMIUM MATERIALS",
        description: "We don't mass-produce. We craft. Every FINEYST jacket starts with ethically sourced full-grain leather, precision cuts, and hours of artisan detail.",
        features: [
          "Ethically sourced full-grain leather",
          "Premium lambskin and suede options",
          "Distressed finishes for authentic look",
          "Quality tested for durability",
        ],
        imageUrl: "/images/option_1.webp",
      },
      {
        id: 2,
        title: "TAILORED FIT",
        description: "Whether you're buying a ready-to-wear bomber or designing a custom jacket from scratch, you're investing in precision-crafted fit.",
        features: [
          "Standard sizes available",
          "Made-to-measure options",
          "Perfect fit guarantee",
          "Custom sizing consultations",
        ],
        imageUrl: "https://jacket.us.com/uploads/2025/Tailored_fit_section_1.webp",
      },
      {
        id: 4,
        title: "USA FULFILLMENT",
        description: "Fast, reliable shipping with hassle-free returns. We stand behind every jacket we make with comprehensive customer support.",
        features: [
          "Free shipping across USA",
          "24-48 hour processing",
          "14-day easy returns",
          "Dedicated customer support",
        ],
        imageUrl: "/images/usa_fulfillment_banner.webp",
      },
    ];
  },
  ['why-choose-slider'],
  { revalidate: 3600, tags: ['why-choose'] }
);

export default async function WhyChooseSliderServer() {
  const slides = await getCachedSlides();

  return <WhyChooseSliderClient slides={slides} />;
}
