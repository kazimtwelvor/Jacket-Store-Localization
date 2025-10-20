/**
 * Hreflang Helper Utility
 * Generates hreflang metadata for multi-country pages following Google's best practices
 * 
 * Best Practices Implemented:
 * 1. Self-referencing tags (each page includes its own hreflang)
 * 2. ISO 639-1 for language codes (e.g., en, fr, ar)
 * 3. ISO 3166-1 Alpha 2 for regions (e.g., US, GB, CA, AU)
 * 4. x-default tag for fallback
 * 5. Bidirectional cross-referencing (all versions link to each other)
 * 
 * @see https://developers.google.com/search/docs/specialty/international/localized-versions
 */

const BASE_URL = 'https://www.fineystjackets.com';

/**
 * Supported countries with their ISO codes
 * ISO 3166-1 Alpha 2 country codes
 */
const COUNTRIES = ['us', 'uk', 'ca', 'au'] as const;

/**
 * Language-Region mapping following ISO standards
 * Format: language-REGION (ISO 639-1 + ISO 3166-1 Alpha 2)
 * 
 * Examples:
 * - en-US = English (language: en) in United States (region: US)
 * - en-GB = English (language: en) in Great Britain (region: GB)
 */
const COUNTRY_LOCALE_MAP: Record<string, string> = {
  us: 'en-US', // English - United States
  uk: 'en-GB', // English - Great Britain
  ca: 'en-CA', // English - Canada
  au: 'en-AU', // English - Australia
};

/**
 * Get the language code (ISO 639-1) from a country code
 */
const COUNTRY_LANGUAGE_MAP: Record<string, string> = {
  us: 'en',
  uk: 'en',
  ca: 'en',
  au: 'en',
};

export interface HreflangConfig {
  path: string;
  currentCountry: string;
  countries?: readonly string[];
}

/**
 * Generate complete hreflang alternate links for a given path
 * 
 * IMPORTANT: Includes self-referencing tag for the current page
 * All pages must reference themselves and all other language versions
 * 
 * @param config - Configuration object
 * @param config.path - The path (e.g., '/about-us', '/shop')
 * @param config.currentCountry - Current country code (for self-reference)
 * @param config.countries - Optional array of countries (defaults to all supported)
 * @returns Object with x-default and all language-region alternates
 * 
 * @example
 * // For US page at /us/shop
 * generateHreflangLinks({ path: '/shop', currentCountry: 'us' })
 * // Returns:
 * // {
 * //   'x-default': 'https://www.fineystjackets.com/us/shop',
 * //   'en-US': 'https://www.fineystjackets.com/us/shop', // Self-reference
 * //   'en-GB': 'https://www.fineystjackets.com/uk/shop',
 * //   'en-CA': 'https://www.fineystjackets.com/ca/shop',
 * //   'en-AU': 'https://www.fineystjackets.com/au/shop',
 * // }
 */
export function generateHreflangLinks(config: HreflangConfig): Record<string, string> {
  const { path, currentCountry, countries = COUNTRIES } = config;
  
  const languages: Record<string, string> = {
    'x-default': `${BASE_URL}/us${path}`,
  };

  countries.forEach(country => {
    const locale = COUNTRY_LOCALE_MAP[country] || 'en-US';
    languages[locale] = `${BASE_URL}/${country}${path}`;
  });

  const currentLocale = COUNTRY_LOCALE_MAP[currentCountry.toLowerCase()];
  if (currentLocale && !languages[currentLocale]) {
    console.warn(`[HREFLANG WARNING] Self-reference missing for ${currentCountry}. Adding now.`);
    languages[currentLocale] = `${BASE_URL}/${currentCountry.toLowerCase()}${path}`;
  }

  return languages;
}

/**
 * Get canonical URL for a given country and path
 * The canonical URL should point to the current page (self-referencing)
 * 
 * @param countryCode - The country code (ISO 3166-1 Alpha 2)
 * @param path - The path (e.g., '/about-us', '/contact-us')
 * @returns Full canonical URL
 * 
 * @example
 * getCanonicalUrl('us', '/shop') // 'https://www.fineystjackets.com/us/shop'
 */
export function getCanonicalUrl(countryCode: string, path: string = ''): string {
  return `${BASE_URL}/${countryCode.toLowerCase()}${path}`;
}

/**
 * Get locale string for a country code
 * @param countryCode - Country code
 * @returns Locale string (e.g., 'en-US')
 */
export function getLocaleForCountry(countryCode: string): string {
  return COUNTRY_LOCALE_MAP[countryCode.toLowerCase()] || 'en-US';
}

/**
 * Get language code for a country
 * @param countryCode - Country code
 * @returns Language code (ISO 639-1)
 */
export function getLanguageForCountry(countryCode: string): string {
  return COUNTRY_LANGUAGE_MAP[countryCode.toLowerCase()] || 'en';
}

/**
 * Get all supported countries
 * @returns Array of country codes
 */
export function getSupportedCountries(): readonly string[] {
  return COUNTRIES;
}

/**
 * Validate if a country code is supported
 * @param countryCode - Country code to validate
 * @returns True if supported
 */
export function isCountrySupported(countryCode: string): boolean {
  return COUNTRIES.includes(countryCode.toLowerCase() as any);
}

/**
 * Get hreflang configuration summary (for debugging)
 */
export function getHreflangConfig() {
  return {
    baseUrl: BASE_URL,
    countries: COUNTRIES,
    locales: COUNTRY_LOCALE_MAP,
    languages: COUNTRY_LANGUAGE_MAP,
  };
}

