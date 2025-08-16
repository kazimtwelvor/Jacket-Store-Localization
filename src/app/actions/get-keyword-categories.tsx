const URL = `${process.env.NEXT_PUBLIC_API_URL}/category-pages?all=true`

const getKeywordCategories = async (): Promise<any[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error('NEXT_PUBLIC_API_URL is not defined')
      return []
    }

    console.log('Fetching keyword categories from:', URL)
    const res = await fetch(URL, {
      next: { revalidate: 0 },
      cache: "no-store",
    })
    
    if (!res.ok) {
      console.error(`Failed to fetch keyword categories: ${res.status} ${res.statusText}`)
      return []
    }

    const contentType = res.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json()
      console.log('Keyword categories fetched:', data.length || 0, 'items')
      return Array.isArray(data) ? data : []
    }
    
    console.error('Response is not JSON')
    return []
  } catch (error) {
    console.error('Error fetching keyword categories:', error)
    return []
  }
}

export default getKeywordCategories