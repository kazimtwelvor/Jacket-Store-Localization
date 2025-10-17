import { unstable_cache } from "next/cache";
import AboutUsClient from "@/src/app/components/home-page-components/about-us/about-us-client";

export const revalidate = 3600;

interface AboutData {
  title: string;
  subtitle: string;
  description: string;
  story: string;
  mission: string;
  values: string;
  ctaText: string;
  ctaLink: string;
}

const getCachedAboutData = unstable_cache(
  async (countryCode: string): Promise<AboutData> => {
    return {
      title: "ABOUT FINEYST",
      subtitle: "Premium streetwear that speaks your language",
      description: "Fineyst is a premium streetwear destination that brings together the best of contemporary urban style, sustainable practices, and exceptional customer experience.",
      story: "Founded with a passion for authentic street culture, we've grown from a small local brand to a recognized name in streetwear fashion. Our carefully curated collections feature exclusive designs and limited-edition collaborations with artists and designers, ensuring that our customers always have access to unique, high-quality streetwear that makes a statement.",
      mission: "What sets Fineyst apart is our unwavering commitment to quality, authenticity, and customer satisfaction. We believe that streetwear should be both expressive and responsibly made.",
      values: "We believe that streetwear should be both expressive and responsibly made.",
      ctaText: "Discover our full story",
      ctaLink: `/${countryCode}/about-us`
    };
  },
  ['about-section'],
  { revalidate: 3600, tags: ['about'] }
);

interface AboutUsServerProps {
  countryCode: string;
}

export default async function AboutUsServer({ countryCode }: AboutUsServerProps) {
  const aboutData = await getCachedAboutData(countryCode);

  return <AboutUsClient aboutData={aboutData} />;
}
