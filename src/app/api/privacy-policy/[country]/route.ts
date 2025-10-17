import { NextRequest, NextResponse } from 'next/server'
import { getPrivacyPolicyData } from '@/src/app/(routes)/[country]/privacy-policy/data/privacy-policy-data'


export async function GET(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  try {
    const { country } = params
    const countryCode = country.toLowerCase()

    const policyData = getPrivacyPolicyData(countryCode)

    return NextResponse.json(policyData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Failed to fetch privacy policy data' },
      { status: 500 }
    )
  }
}
