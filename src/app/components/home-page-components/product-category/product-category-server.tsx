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

const menCategories: Category[] = [
  {
    id: "leather-men",
    name: "LEATHER JACKETS",
    imageUrl: "/images/leather.webp",
    href: "/collections/leather-bomber-jacket-mens",
  },
  {
    id: "puffer-men",
    name: "PUFFER JACKETS",
    imageUrl: "/images/category-carousel-men/Mens-Puffer.webp",
    href: "/collections/mens-puffer-jackets",
  },
  {
    id: "denim-men",
    name: "DENIM JACKETS",
    imageUrl: "/images/category-carousel-men/Mens-denim.webp",
    href: "/collections/mens-denim-jackets",
  },
  {
    id: "suede-men",
    name: "SUEDE JACKETS",
    imageUrl: "/images/category-carousel-men/mens-suede.webp",
    href: "/collections/mens-suede-jackets",
  },
  {
    id: "aviator-men",
    name: "AVIATOR JACKETS",
    imageUrl: "/images/category-carousel-men/mens-aviator.webp",
    href: "/collections/mens-aviator-jackets",
  },
  {
    id: "biker-men",
    name: "BIKER JACKETS",
    imageUrl: "/images/category-carousel-men/Mens-Biker.webp",
    href: "/collections/biker-jacket-men",
  },
  {
    id: "varsity-men",
    name: "VARSITY JACKETS",
    imageUrl: "/images/category-carousel-men/mens-varsity.webp",
    href: "/collections/mens-varsity-jackets",
  },
  {
    id: "letterman-men",
    name: "LETTERMAN JACKETS",
    imageUrl: "/images/letterman.webp",
    href: "/collections/mens-aviator-jackets",
  },
];

const womenCategories: Category[] = [
  {
    id: "leather-women",
    name: "LEATHER JACKETS",
    imageUrl: "/images/category-carousel-women/women-leather.webp",
    href: "/collections/womens-leather-bomber-jackets",
  },
  {
    id: "puffer-women",
    name: "PUFFER JACKETS",
    imageUrl: "/images/category-carousel-women/women-puffer.webp",
    href: "/collections/womens-puffer-vests",
  },
  {
    id: "denim-women",
    name: "DENIM JACKETS",
    imageUrl: "/images/category-carousel-women/women-denim.webp",
    href: "/collections/womens-denim-jackets",
  },
  {
    id: "suede-women",
    name: "SUEDE JACKETS",
    imageUrl: "/images/category-carousel-women/women-suede.webp",
    href: "/collections/womens-suede-leather-jackets",
  },
  {
    id: "aviator-women",
    name: "AVIATOR JACKETS",
    imageUrl: "/images/category-carousel-women/women-aviator.webp",
    href: "/collections/womens-pilot-jackets",
  },
  {
    id: "biker-women",
    name: "BIKER JACKETS",
    imageUrl: "/images/category-carousel-women/women-biker.webp",
    href: "/collections/womens-leather-biker-jackets",
  },
  {
    id: "varsity-women",
    name: "VARSITY JACKETS",
    imageUrl: "/images/category-carousel-women/women-varsity .webp",
    href: "/collections/womens-varsity-jackets",
  },
  {
    id: "letterman-women",
    name: "LETTERMAN JACKETS",
    imageUrl: "/images/category-carousel-women/women-letterman.webp",
    href: "/collections/womens-letterman-jackets",
  },
];

const getCachedCategories = unstable_cache(
  async () => {
    return {
      men: menCategories,
      women: womenCategories,
    };
  },
  ['product-categories'],
  { revalidate: 3600, tags: ['categories'] }
);

interface ProductCategoryServerProps {
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
  const categories = await getCachedCategories();

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
