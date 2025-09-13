"use client"

import { usePathname } from 'next/navigation';
import { countries } from '../contexts/CountryContext';

export function useCountryFromUrl() {
  const pathname = usePathname();
  
  const countryMatch = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  
  if (countryMatch) {
    const countryCode = countryMatch[1];
    const country = countries.find(c => c.code === countryCode);
    
    if (country) {
      return {
        country,
        hasCountryInUrl: true,
        pathWithoutCountry: countryMatch[2] || '/',
      };
    }
  }
  
  return {
    country: null,
    hasCountryInUrl: false,
    pathWithoutCountry: pathname,
  };
}

export function getCountrySpecificUrl(path: string, countryCode: string) {
  const cleanPath = path.replace(/^\/[a-z]{2}/, '') || '/';
  
  if (cleanPath === '/') {
    return `/${countryCode}`;
  }
  
  return `/${countryCode}${cleanPath}`;
}

export function removeCountryFromUrl(url: string) {
  return url.replace(/^\/[a-z]{2}/, '') || '/';
}
