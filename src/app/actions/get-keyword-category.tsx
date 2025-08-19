import type { KeywordCategory } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/category-pages`;

const getKeywordCategory = async (
  slug: string
): Promise<KeywordCategory | null> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return null;
    }

    const res = await fetch(URL, {
      next: { revalidate: 300 },
      headers: {
        "Content-Type": "application/json",
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
