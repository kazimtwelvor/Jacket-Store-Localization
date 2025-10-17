"use client"

interface CollectionSchemaProps {
  collectionName: string;
  collectionSlug: string;
}

import { useCountry } from "@/src/hooks/use-country"; 


export default function CollectionSchema({ collectionName, collectionSlug }: CollectionSchemaProps) {
  const { countryCode } = useCountry();
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://www.fineystjackets.com/${countryCode}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Collections",
        "item": `https://www.fineystjackets.com/${countryCode}/collections`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": collectionName,
        "item": `https://www.fineystjackets.com/${countryCode}/collections/${collectionSlug}`
      }
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Fineyst Jackets",
    "url": `https://www.fineystjackets.com/${countryCode}`,
    "logo": `https://www.fineystjackets.com/${countryCode}/images/logo.webp`,
    "description": "Experience the finest quality and timeless design. Your destination for luxury jackets and outerwear.",
    "foundingDate": "2020",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "122 Henderson Rd",
      "addressLocality": "Sandy Creek",
      "addressRegion": "NY",
      "postalCode": "13145",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-888-840-0885",
      "email": "info@fineystjackets.com",
      "contactType": "customer service",
      "areaServed": "US",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://facebook.com/fineyst",
      "https://instagram.com/fineyst",
      "https://twitter.com/fineyst",
      "https://linkedin.com/company/fineyst"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
    </>
  );
}