import type { KeywordCategory } from "@/types";

const getKeywordCategory = async (
  slug: string,
  options?: { countryCode?: string }
): Promise<KeywordCategory | null> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return null;
    }

    // Build URL with country parameter if provided
    const url = options?.countryCode 
      ? `${process.env.NEXT_PUBLIC_API_URL}/category-pages?cn=${options.countryCode}` 
      : `${process.env.NEXT_PUBLIC_API_URL}/category-pages`

    const res = await fetch(url, {
      next: { revalidate: 0 }, 
      cache: "no-store",
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
