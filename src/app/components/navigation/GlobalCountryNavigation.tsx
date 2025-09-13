"use client"

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function GlobalCountryNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined' || pathname.startsWith('/api')) return;

    // Always ensure US is set in cookie
    Cookies.set('userCountry', 'US', { expires: 365 });

    const countryFromUrl = searchParams.get('country');

    // If no country parameter or not US, add it using router.replace
    if (!countryFromUrl || countryFromUrl.toLowerCase() !== 'us') {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('country', 'us');
      
      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      router.replace(newUrl);
    }
  }, [pathname, searchParams, router]);

  return null;
}
