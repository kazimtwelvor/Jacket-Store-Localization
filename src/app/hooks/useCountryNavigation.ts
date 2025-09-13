"use client"

import { useRouter } from 'next/navigation';
import { useCountry } from '../contexts/CountryContext';
import { addCountryToUrl } from '../utils/countryNavigation';

export function useCountryNavigation() {
  const router = useRouter();
  const { selectedCountry } = useCountry();

  const navigate = (path: string) => {
    const urlWithCountry = addCountryToUrl(path, selectedCountry?.code);
    router.push(urlWithCountry);
  };

  const replace = (path: string) => {
    const urlWithCountry = addCountryToUrl(path, selectedCountry?.code);
    router.replace(urlWithCountry);
  };

  const getUrlWithCountry = (path: string) => {
    return addCountryToUrl(path, selectedCountry?.code);
  };

  return {
    navigate,
    replace,
    getUrlWithCountry,
    selectedCountry
  };
}
