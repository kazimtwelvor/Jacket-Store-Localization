import { NextRequest, NextResponse } from 'next/server'
import { getTermsData } from '@/src/app/(routes)/[country]/terms-conditions/data/terms-data-by-country'

export async function GET(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  try {
    const { country } = params
    const countryCode = country.toLowerCase()

    const termsData = getTermsData(countryCode)

    return NextResponse.json(termsData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('[TERMS_CONDITIONS_API] Error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch terms and conditions data' },
      { status: 500 }
    )
  }
}
