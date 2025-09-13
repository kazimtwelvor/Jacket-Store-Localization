"use client"

import Link from 'next/link';
import { useCountry } from '../../contexts/CountryContext';
import { ReactNode } from 'react';

interface CountryAwareLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  addCountryParam?: boolean; 
  [key: string]: any; 
}

export default function CountryAwareLink({ 
  href, 
  children, 
  className, 
  addCountryParam = true,
  ...props 
}: CountryAwareLinkProps) {
  const { selectedCountry, addCountryToUrl } = useCountry();

  const getFinalHref = () => {
    if (!addCountryParam || !selectedCountry) {
      return href;
    }

    return addCountryToUrl(href);
  };

  return (
    <Link href={getFinalHref()} className={className} {...props}>
      {children}
    </Link>
  );
}
