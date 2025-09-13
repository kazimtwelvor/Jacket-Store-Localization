"use client"
import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { countries } from '../contexts/CountryContext';

export function useGlobalCountryNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined' || pathname.startsWith('/api')) return;

    const countryFromUrl = searchParams.get('country');
    const countryFromCookie = Cookies.get('userCountry');

    if (!countryFromUrl && countryFromCookie) {
      const countryExists = countries.find(c => c.code.toLowerCase() === countryFromCookie.toLowerCase());
      if (countryExists) {
        const url = new URL(window.location.href);
        url.searchParams.set('country', countryFromCookie.toLowerCase());
        
        router.replace(url.pathname + url.search);
      }
    }

    if (countryFromUrl && countryFromCookie && countryFromUrl.toLowerCase() !== countryFromCookie.toLowerCase()) {
      const countryExists = countries.find(c => c.code.toLowerCase() === countryFromUrl.toLowerCase());
      if (countryExists) {
        Cookies.set('userCountry', countryExists.code, { expires: 365 });
      }
    }
  }, [pathname, searchParams, router]);

  const navigateWithCountry = (url: string) => {
    const countryFromCookie = Cookies.get('userCountry');
    if (countryFromCookie) {
      const urlObj = new URL(url, window.location.origin);
      if (!urlObj.searchParams.get('country')) {
        urlObj.searchParams.set('country', countryFromCookie.toLowerCase());
      }
      router.push(urlObj.pathname + urlObj.search);
    } else {
      router.push(url);
    }
  };

  return {
    navigateWithCountry,
  };
}
