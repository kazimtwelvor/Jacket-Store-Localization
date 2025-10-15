const getKeywordCategories = async (options?: { countryCode?: string }): Promise<any[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn('API URL not configured, returning empty array');
      return [];
    }

    // Build URL with country parameter if provided
    const url = options?.countryCode 
      ? `${process.env.NEXT_PUBLIC_API_URL}/category-pages?all=true&cn=${options.countryCode}` 
      : `${process.env.NEXT_PUBLIC_API_URL}/category-pages?all=true`

    // Use direct external API call with proper error handling and caching
    const res = await fetch(url, {
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
