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

    Cookies.set('userCountry', 'US', { expires: 365 });

    const countryFromUrl = searchParams.get('cn');

    if (!countryFromUrl || countryFromUrl.toLowerCase() !== 'us') {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('cn', 'us');
      
      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      router.replace(newUrl);
    }
  }, [pathname, searchParams, router]);

  return null;
}
