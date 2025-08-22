import type { KeywordCategory } from "@/types";

const getKeywordCategory = async (
  slug: string
): Promise<KeywordCategory | null> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return null;
    }

    // Use direct external API call with proper error handling and caching
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category-pages`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      cache: "force-cache",
      headers: {
        "Accept": "application/json",
        "User-Agent": "Fineyst-App",
      },
    });

    if (!res.ok) {
      return null;
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const categoryPages = await res.json();

      const categoryPage = Array.isArray(categoryPages)
        ? categoryPages.find((page: any) => page.slug === slug)
        : null;

      if (categoryPage) {
        return categoryPage;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
};

export default getKeywordCategory;
