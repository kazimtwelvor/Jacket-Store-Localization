"use client"

import Cookies from 'js-cookie';

export function addCountryToUrl(url: string, country?: string): string {
  const countryCode = country || Cookies.get('userCountry');
  if (!countryCode) return url;

  try {
    const urlObj = new URL(url, window.location.origin);
    urlObj.searchParams.set('country', countryCode);
    return urlObj.pathname + urlObj.search;
  } catch {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}country=${countryCode}`;
  }
}

export function getCurrentCountry(): string | null {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const countryFromUrl = urlParams.get('country');
  if (countryFromUrl) return countryFromUrl;
  
  return Cookies.get('userCountry') || null;
}

export function navigateWithCountry(router: any, path: string) {
  const urlWithCountry = addCountryToUrl(path);
  router.push(urlWithCountry);
}

export function replaceWithCountry(router: any, path: string) {
  const urlWithCountry = addCountryToUrl(path);
  router.replace(urlWithCountry);
}
