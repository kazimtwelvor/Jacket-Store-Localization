import { unstable_cache } from "next/cache";
import JacketColorCollectionClient from "@/src/app/components/home-page-components/product-category/jacket-color-collection-client";

export const revalidate = 3600; 

interface ColorCategory {
  id: string;
  name: string;
  imageUrl: string;
  href: string;
}

const getCachedColorCollection = unstable_cache(
  async (countryCode: string): Promise<ColorCategory[]> => {
    return [
      {
        id: "color-black-men",
        name: "BLACK JACKETS",
        imageUrl: "/images/color-collection/Black.webp",
        href: `/${countryCode}/collections/leather-bomber-jacket-mens`,
      },
      {
        id: "color-brown-men",
        name: "BROWN JACKETS",
        imageUrl: "/images/color-collection/Brown .webp",
        href: `/${countryCode}/collections/mens-suede-jackets`,
      },
      {
        id: "color-red-women",
        name: "RED JACKETS",
        imageUrl: "/images/color-collection/Red.webp",
        href: `/${countryCode}/collections/mens-suede-jackets`,
      },
      {
        id: "color-white-men",
        name: "WHITE JACKETS",
        imageUrl: "/images/color-collection/White .webp",
        href: `/${countryCode}/collections/mens-denim-jackets`,
      },
      {
        id: "color-pink-men",
        name: "PINK JACKETS",
        imageUrl: "/images/color-collection/Pink.webp",
        href: `/${countryCode}/collections/mens-suede-jackets`,
      },
      {
        id: "color-blue-men",
        name: "BLUE JACKETS",
        imageUrl: "/images/color-collection/Blue.webp",
        href: `/${countryCode}/collections/mens-puffer-jackets`,
      },
      {
        id: "color-green-women",
        name: "GREEN JACKETS",
        imageUrl: "/images/color-collection/Green.webp",
        href: `/${countryCode}/collections/mens-suede-jackets`,
      },
      {
        id: "color-yellow-men",
        name: "YELLOW JACKETS",
        imageUrl: "/images/color-collection/Yellow .webp",
        href: `/${countryCode}/collections/mens-suede-jackets`,
      },
    ];
  },
  ['jacket-color-collection'],
  { revalidate: 3600, tags: ['color-collection'] }
);

interface JacketColorCollectionServerProps {
  countryCode: string;
}

export default async function JacketColorCollectionServer({ countryCode }: JacketColorCollectionServerProps) {
  const colorCollection = await getCachedColorCollection(countryCode);

  return <JacketColorCollectionClient colorCollection={colorCollection} />;
}
