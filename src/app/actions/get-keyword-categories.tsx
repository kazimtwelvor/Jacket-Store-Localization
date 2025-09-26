const getKeywordCategories = async (): Promise<any[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn('API URL not configured, returning empty array');
      return [];
    }

    // Use direct external API call with proper error handling and caching
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category-pages?all=true`, {
      next: { revalidate: 0 }, 
      cache: "no-store",
      headers: {
        "Accept": "application/json",
        "User-Agent": "Fineyst-App",
      },
    });

    if (!res.ok) {
      return [];
    }

    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }

    return [];
  } catch (error) {
    return [];
  }
};

export default getKeywordCategories;
