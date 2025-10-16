
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface Country {
  id: string
  name: string
  countryCode: string
  currency: string | null
  currencySymbol: string | null
  timezone: string | null
  isActive: boolean
  sortOrder: number
}

export async function getCountries(): Promise<Country[]> {
  try {
    if (!API_BASE_URL) {
      console.warn('[GET_COUNTRIES] API_BASE_URL not configured, using default countries')
      return getDefaultCountries()
    }

    const baseUrl = API_BASE_URL.replace(/\/api\/[a-f0-9-]+$/, '')
    
    const response = await fetch(`${baseUrl}/api/countries?isActive=true&sortBy=sortOrder&sortOrder=asc&limit=100`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextJS-Build',
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    if (data?.countries && Array.isArray(data.countries)) {
      return data.countries
    }
    
    return getDefaultCountries()
  } catch (error) {
    console.warn('[GET_COUNTRIES] Failed to fetch countries from API, using defaults:', error)
    return getDefaultCountries()
  }
}

function getDefaultCountries(): Country[] {
  return [
    {
      id: 'default-us',
      name: 'United States',
      countryCode: 'us',
      currency: 'USD',
      currencySymbol: '$',
      timezone: 'America/New_York',
      isActive: true,
      sortOrder: 0,
    },
    {
      id: 'default-ca',
      name: 'Canada',
      countryCode: 'ca',
      currency: 'CAD',
      currencySymbol: 'C$',
      timezone: 'America/Toronto',
      isActive: true,
      sortOrder: 1,
    },
    {
      id: 'default-uk',
      name: 'United Kingdom',
      countryCode: 'uk',
      currency: 'GBP',
      currencySymbol: '£',
      timezone: 'Europe/London',
      isActive: true,
      sortOrder: 2,
    },
    {
      id: 'default-au',
      name: 'Australia',
      countryCode: 'au',
      currency: 'AUD',
      currencySymbol: 'A$',
      timezone: 'Australia/Sydney',
      isActive: true,
      sortOrder: 3,
    }
  ]
}
