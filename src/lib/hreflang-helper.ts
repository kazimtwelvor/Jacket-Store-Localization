/**
 * Hreflang Helper Utility
 * Generates hreflang metadata for multi-country pages
 */

const BASE_URL = 'https://www.fineystjackets.com';
const COUNTRIES = ['us', 'uk', 'ca', 'au'];

const COUNTRY_LOCALE_MAP: Record<string, string> = {
  us: 'en-US',
  uk: 'en-GB',
  ca: 'en-CA',
  au: 'en-AU',
};

interface HreflangConfig {
  path: string;
  countries?: string[];
}

/**
 * Generate hreflang alternate links for a given path
 * @param config - Configuration with path and optional countries array
 * @returns Object with x-default and language alternates
 */
export function generateHreflangLinks(config: HreflangConfig) {
  const { path, countries = COUNTRIES } = config;
  
  const languages: Record<string, string> = {
    'x-default': `${BASE_URL}/us${path}`,
  };

  countries.forEach(country => {
    const locale = COUNTRY_LOCALE_MAP[country] || 'en-US';
    languages[locale] = `${BASE_URL}/${country}${path}`;
  });

  return languages;
}

/**
 * Get canonical URL for a given country and path
 * @param countryCode - The country code
 * @param path - The path (e.g., '/about-us', '/contact-us')
 * @returns Full canonical URL
 */
export function getCanonicalUrl(countryCode: string, path: string = ''): string {
  return `${BASE_URL}/${countryCode}${path}`;
}

