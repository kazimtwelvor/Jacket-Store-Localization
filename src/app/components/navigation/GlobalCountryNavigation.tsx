"use client"

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { countries } from '../../contexts/CountryContext';

export default function GlobalCountryNavigation() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || pathname.startsWith('/api')) return;

    const urlParams = new URLSearchParams(window.location.search);
    const countryFromUrl = urlParams.get('country');
    const countryFromCookie = Cookies.get('userCountry');

    if (!countryFromUrl && countryFromCookie) {
      const countryExists = countries.find(c => c.code.toLowerCase() === countryFromCookie.toLowerCase());
      if (countryExists) {
        const url = new URL(window.location.href);
        url.searchParams.set('country', countryFromCookie.toLowerCase());
        
        window.history.replaceState(null, '', url.pathname + url.search);
      }
    }
  }, [pathname]);

  return null;
}
