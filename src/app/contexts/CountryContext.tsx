"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

interface Country {
  code: string;
  name: string;
}

interface CountryContextType {
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country) => void;
  showCountryModal: boolean;
  setShowCountryModal: (show: boolean) => void;
  isFirstVisit: boolean;
  addCountryToUrl: (url: string) => string;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const countries: Country[] = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'DK', name: 'Denmark' },
  { code: 'NO', name: 'Norway' },
  { code: 'FI', name: 'Finland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'HR', name: 'Croatia' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'RO', name: 'Romania' },
  { code: 'EE', name: 'Estonia' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MT', name: 'Malta' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
  { code: 'IN', name: 'India' },
  { code: 'CN', name: 'China' },
  { code: 'TH', name: 'Thailand' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'PH', name: 'Philippines' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'IL', name: 'Israel' },
  { code: 'TR', name: 'Turkey' },
  { code: 'EG', name: 'Egypt' },
  { code: 'MA', name: 'Morocco' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'RU', name: 'Russia' },
  { code: 'UA', name: 'Ukraine' },
];

export function CountryProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const countryFromUrl = searchParams.get('country');
    if (countryFromUrl) {
      const country = countries.find(c => c.code.toLowerCase() === countryFromUrl.toLowerCase());
      if (country) {
        setSelectedCountry(country);
        Cookies.set('userCountry', country.code, { expires: 365 }); 
        setIsFirstVisit(false);
        return;
      }
    }

    const savedCountry = Cookies.get('userCountry');
    if (savedCountry) {
      const country = countries.find(c => c.code.toLowerCase() === savedCountry.toLowerCase());
      if (country) {
        setSelectedCountry(country);
        setIsFirstVisit(false);
        return;
      }
    }

    setTimeout(() => {
      setShowCountryModal(true);
    }, 1000);
  }, [searchParams, router, pathname]);

  useEffect(() => {
    const checkCookieChanges = () => {
      const savedCountry = Cookies.get('userCountry');
      if (!savedCountry && selectedCountry) {
        setSelectedCountry(null);
        setIsFirstVisit(true);
        setTimeout(() => {
          setShowCountryModal(true);
        }, 500);
      }
    };

    const interval = setInterval(checkCookieChanges, 2000);
    
    return () => clearInterval(interval);
  }, [selectedCountry]);

  const addCountryToUrl = (url: string): string => {
    if (!selectedCountry) return url;
    
    const urlObj = new URL(url, window.location.origin);
    urlObj.searchParams.set('country', selectedCountry.code.toLowerCase());
    return urlObj.pathname + urlObj.search;
  };

  const handleSetSelectedCountry = (country: Country) => {
    setSelectedCountry(country);
    Cookies.set('userCountry', country.code, { expires: 365 });
    setShowCountryModal(false);
    setIsFirstVisit(false);
    
    const url = new URL(window.location.href);
    url.searchParams.set('country', country.code.toLowerCase());
    router.replace(url.pathname + url.search);
  };

  return (
    <CountryContext.Provider
      value={{
        selectedCountry,
        setSelectedCountry: handleSetSelectedCountry,
        showCountryModal,
        setShowCountryModal,
        isFirstVisit,
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
