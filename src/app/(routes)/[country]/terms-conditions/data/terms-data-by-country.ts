export interface TermsSubsection {
  title: string
  content: string[]
  listItems?: string[]
}

export interface TermsSection {
  title: string
  content: string[]
  subsections?: TermsSubsection[]
}

export interface TermsData {
  title: string
  description: string
  lastUpdated: string
  contactEmail: string
  contactAddress: string
  sections: {
    [key: string]: TermsSection
  }
}

export interface TermsDataMap {
  [countryCode: string]: TermsData
}

import { termsData as existingTermsData } from "./terms-data"

export const termsDataByCountry: TermsDataMap = {
  us: {
    title: "Terms & Conditions",
    description: "Our commitment to transparency and fairness. These terms outline our relationship and responsibilities to each other.",
    lastUpdated: "April 20, 2025",
    contactEmail: "info@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, San Francisco, CA 94103, United States",
    sections: existingTermsData
  },

  uk: {
    title: "Terms & Conditions",
    description: "Our commitment to transparency and fairness. These terms outline our relationship and responsibilities to each other.",
    lastUpdated: "April 20, 2025",
    contactEmail: "legal@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, London, UK SW1A 1AA",
    sections: existingTermsData 
  },

  ca: {
    title: "Terms & Conditions",
    description: "Our commitment to transparency and fairness. These terms outline our relationship and responsibilities to each other.",
    lastUpdated: "April 20, 2025",
    contactEmail: "legal@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, Toronto, ON M5H 2N2, Canada",
    sections: existingTermsData 
  },

  au: {
    title: "Terms & Conditions",
    description: "Our commitment to transparency and fairness. These terms outline our relationship and responsibilities to each other.",
    lastUpdated: "April 20, 2025",
    contactEmail: "legal@fineystjackets.com",
    contactAddress: "123 Fashion Avenue, Suite 500, Sydney, NSW 2000, Australia",
    sections: existingTermsData 
  }
}

export function getTermsData(countryCode: string): TermsData {
  const normalizedCountryCode = countryCode.toLowerCase()
  
  return termsDataByCountry[normalizedCountryCode] || termsDataByCountry.us
}

export function getAvailableTermsCountryCodes(): string[] {
  return Object.keys(termsDataByCountry)
}
