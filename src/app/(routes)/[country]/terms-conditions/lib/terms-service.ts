import { TermsData, getTermsData } from "../data/terms-data-by-country"

export function getTermsDataClient(countryCode: string): TermsData {
  return getTermsData(countryCode.toLowerCase())
}

export function getAvailableTermsCountryCodes(): string[] {
  return ['us', 'uk', 'ca', 'au'] 
}

export function hasCustomTerms(countryCode: string): boolean {
  const normalizedCountryCode = countryCode.toLowerCase()
  return ['uk', 'ca', 'au'].includes(normalizedCountryCode)
}
