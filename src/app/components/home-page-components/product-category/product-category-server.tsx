import { unstable_cache } from "next/cache";
import ProductCategoryClient from "@/src/app/components/home-page-components/product-category/product-category-client";

export const revalidate = 3600; 

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  href: string;
  slug?: string;
}

const getMenCategories = (countryCode: string): Category[] => [
  {
    id: "leather-men",
    name: "LEATHER JACKETS",
    imageUrl: "/images/leather.webp",
    href: `/${countryCode}/collections/leather-bomber-jacket-mens`,
  },
  {
    id: "puffer-men",
    name: "PUFFER JACKETS",
    imageUrl: "/images/category-carousel-men/Mens-Puffer.webp",
    href: `/${countryCode}/collections/mens-puffer-jackets`,
  },
  {
    id: "denim-men",
    name: "DENIM JACKETS",
    imageUrl: "/images/category-carousel-men/Mens-denim.webp",
    href: `/${countryCode}/collections/mens-denim-jackets`,
  },
  {
    id: "suede-men",
    name: "SUEDE JACKETS",
    imageUrl: "/images/category-carousel-men/mens-suede.webp",
    href: `/${countryCode}/collections/mens-suede-jackets`,
  },
  {
    id: "aviator-men",
    name: "AVIATOR JACKETS",
    imageUrl: "/images/category-carousel-men/mens-aviator.webp",
    href: `/${countryCode}/collections/mens-aviator-jackets`,
  },
  {
    id: "biker-men",
    name: "BIKER JACKETS",
    imageUrl: "/images/category-carousel-men/Mens-Biker.webp",
    href: `/${countryCode}/collections/biker-jacket-men`,
  },
  {
    id: "varsity-men",
    name: "VARSITY JACKETS",
    imageUrl: "/images/category-carousel-men/mens-varsity.webp",
    href: `/${countryCode}/collections/mens-varsity-jackets`,
  },
  {
    id: "letterman-men",
    name: "LETTERMAN JACKETS",
    imageUrl: "/images/letterman.webp",
    href: `/${countryCode}/collections/mens-aviator-jackets`,
  },
];

const getWomenCategories = (countryCode: string): Category[] => [
  {
    id: "leather-women",
    name: "LEATHER JACKETS",
    imageUrl: "/images/category-carousel-women/women-leather.webp",
    href: `/${countryCode}/collections/womens-leather-bomber-jackets`,
  },
  {
    id: "puffer-women",
    name: "PUFFER JACKETS",
    imageUrl: "/images/category-carousel-women/women-puffer.webp",
    href: `/${countryCode}/collections/womens-puffer-vests`,
  },
  {
    id: "denim-women",
    name: "DENIM JACKETS",
    imageUrl: "/images/category-carousel-women/women-denim.webp",
    href: `/${countryCode}/collections/womens-denim-jackets`,
  },
  {
    id: "suede-women",
    name: "SUEDE JACKETS",
    imageUrl: "/images/category-carousel-women/women-suede.webp",
    href: `/${countryCode}/collections/womens-suede-leather-jackets`,
  },
  {
    id: "aviator-women",
    name: "AVIATOR JACKETS",
    imageUrl: "/images/category-carousel-women/women-aviator.webp",
    href: `/${countryCode}/collections/womens-pilot-jackets`,
  },
  {
    id: "biker-women",
    name: "BIKER JACKETS",
    imageUrl: "/images/category-carousel-women/women-biker.webp",
    href: `/${countryCode}/collections/womens-leather-biker-jackets`,
  },
  {
    id: "varsity-women",
    name: "VARSITY JACKETS",
    imageUrl: "/images/category-carousel-women/women-varsity .webp",
    href: `/${countryCode}/collections/womens-varsity-jackets`,
  },
  {
    id: "letterman-women",
    name: "LETTERMAN JACKETS",
    imageUrl: "/images/category-carousel-women/women-letterman.webp",
    href: `/${countryCode}/collections/womens-letterman-jackets`,
  },
];

const getCachedCategories = unstable_cache(
  async (countryCode: string) => {
    return {
      men: getMenCategories(countryCode),
      women: getWomenCategories(countryCode),
    };
  },
  ['product-categories'],
  { revalidate: 3600, tags: ['categories'] }
);

interface ProductCategoryServerProps {
  countryCode: string;
  bg?: string;
  arrowBgColor?: string;
  arrowTextColor?: string;
  arrowHoverBgColor?: string;
  tabTextColor?: string;
  tabActiveColor?: string;
  tabHoverColor?: string;
  showTabs?: boolean;
  onCategoryClick?: (slug: string) => void;
}

export default async function ProductCategoryServer({
  countryCode,
  bg = "bg-white",
  arrowBgColor = "bg-black",
  arrowTextColor = "text-white",
  arrowHoverBgColor = "hover:bg-black",
  tabTextColor = "text-gray-700",
  tabActiveColor = "border-[#2b2b2b] text-[#2b2b2b]",
  tabHoverColor = "hover:text-[#2b2b2b]",
  showTabs = true,
  onCategoryClick,
}: ProductCategoryServerProps) {
  const categories = await getCachedCategories(countryCode);

  return (
    <ProductCategoryClient
      bg={bg}
      arrowBgColor={arrowBgColor}
      arrowTextColor={arrowTextColor}
      arrowHoverBgColor={arrowHoverBgColor}
      tabTextColor={tabTextColor}
      tabActiveColor={tabActiveColor}
      tabHoverColor={tabHoverColor}
      showTabs={showTabs}
      categories={categories}
      onCategoryClick={onCategoryClick}
    />
  );
}
