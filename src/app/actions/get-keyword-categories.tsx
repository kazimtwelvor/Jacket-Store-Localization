const URL = `${process.env.NEXT_PUBLIC_API_URL}/category-pages?all=true`

const getKeywordCategories = async (): Promise<any[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {

      return []
    }


    const res = await fetch(URL, {
      next: { revalidate: 0 },
      cache: "no-store",
    })
    
    if (!res.ok) {

      return []
    }

    const contentType = res.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json()
      return Array.isArray(data) ? data : []
    }
    

    return []
  } catch (error) {

    return []
  }
}

export default getKeywordCategories