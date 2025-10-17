import { PrivacyPolicyData, getPrivacyPolicyData } from "../data/privacy-policy-data"


export function getPrivacyPolicyDataClient(countryCode: string): PrivacyPolicyData {
  return getPrivacyPolicyData(countryCode.toLowerCase())
}

export function getAvailableCountryCodes(): string[] {
  return ['us', 'uk', 'ca', 'au'] 
}

export function hasCustomPrivacyPolicy(countryCode: string): boolean {
  const normalizedCountryCode = countryCode.toLowerCase()
  return ['uk', 'ca', 'au'].includes(normalizedCountryCode)
}
