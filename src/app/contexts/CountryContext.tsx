"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

interface Country {
  code: string;
  name: string;
}

interface CountryContextType {
  selectedCountry: Country;
  addCountryToUrl: (url: string) => string;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

// Only US country is supported
const defaultCountry: Country = { code: 'US', name: 'United States' };

export function CountryProvider({ children }: { children: ReactNode }) {
  const [selectedCountry] = useState<Country>(defaultCountry);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    Cookies.set('userCountry', 'US', { expires: 365 });
    
    const countryFromUrl = searchParams.get('cn');
    if (!countryFromUrl || countryFromUrl.toLowerCase() !== 'us') {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('cn', 'us');
      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      router.replace(newUrl);
    }
  }, [searchParams, router, pathname]);

  const addCountryToUrl = (url: string): string => {
    if (url.startsWith('?')) {
      const urlParams = new URLSearchParams(url.substring(1));
      urlParams.set('cn', 'us');
      return `${pathname}?${urlParams.toString()}`;
    }
    
    const urlObj = new URL(url, window.location.origin);
    urlObj.searchParams.set('cn', 'us');
    return urlObj.pathname + urlObj.search;
  };

  return (
    <CountryContext.Provider
      value={{
        selectedCountry,
        addCountryToUrl,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}
