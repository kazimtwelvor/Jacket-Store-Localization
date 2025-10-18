import type { Metadata } from 'next'
import Script from 'next/script'
import SlideBanners from "@/src/app/components/home-page-components/banners/slide-banners-server";
import WelcomeAccordionSection from "@/src/app/components/home-page-components/welcome-section/welcome-section-server";
import ProductCategoryServer from "@/src/app/components/home-page-components/product-category/product-category-server";
import SignatureSectionServer from "@/src/app/components/home-page-components/signature-styles/signature-section-server";
import ProductCarouselServer from "@/src/app/components/home-page-components/product-category/product-carousel-server";
import JacketColorCollectionServer from "@/src/app/components/home-page-components/product-category/jacket-color-collection-server";
import AboutUsServer from "@/src/app/components/home-page-components/about-us/about-us-server";
import WhyChooseSliderServer from "@/src/app/components/home-page-components/why-choose-slider/why-choose-slider-server";
import FAQServer from "@/src/app/components/home-page-components/faqs/faq-server";
import BlogsShowcaseServer from "@/src/app/components/home-page-components/blog-showcase/blog-showcase-server";
import GlobalFashionPartnerServer from "@/src/app/components/home-page-components/global-fashion-partner/global-fashion-partner-server";
import AnimatedReviewSectionServer from "@/src/app/components/home-page-components/animated-review-section/animated-review-section-server";
import { getCountries } from "@/src/app/actions/get-countries";

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const countries = await getCountries()
    
    return countries.map((country) => ({
      country: country.countryCode,
    }))
  } catch (error) {
    return [
      { country: 'us' },
      { country: 'ca' },
      { country: 'uk' },
      { country: 'au' }
    ]
  }
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country: countryCode } = await params
  const title = "Premium Jackets & Outerwear | www.fineystjackets.com"
  const description = "Discover premium quality jackets and outerwear at www.fineystjackets.com. Shop leather jackets, winter coats, and stylish outerwear with fast shipping and excellent customer service."
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fineystjackets.com'
  const canonical = `${baseUrl}/${countryCode}`
  
  const hreflangLinks = {
    'x-default': `${baseUrl}/us`,
    'en-US': `${baseUrl}/us`,
    'en-GB': `${baseUrl}/uk`,
    'en-CA': `${baseUrl}/ca`,
    'en-AU': `${baseUrl}/au`,
  }
  
  return {
    title,
    description,
    alternates: { 
      canonical,
      languages: hreflangLinks
    },
    robots: 'index, follow',
    keywords: 'jackets, leather jackets, outerwear, winter coats, mens jackets, womens jackets',
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "FINEYST JACKETS",
      images: [{
        url: "https://www.fineystjackets.com/images/banner.webp"
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ["https://www.fineystjackets.com/images/banner.webp"],
    }
  }
}

export default async function CountryHome({ params }: { params: Promise<{ country: string }> }) {
  const { country: countryCode } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fineystjackets.com'
  
  const homePageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "FINEYST JACKETS",
        "url": `${siteUrl}/${countryCode}`,
        "logo": `${siteUrl}/logo.webp`,
        "image": `${siteUrl}/images/banner.webp`,
        "description": "www.fineystjackets.com is a brand specializing in premium leather jackets, offering biker, bomber, cropped, custom, and trench styles crafted from high-quality cowhide, lambskin, goatskin, and suede. Designed for durability and timeless style, our jackets deliver comfort, edge, and authenticity. Fast shipping, secure ordering, and dedicated customer service.",
        "email": "info@www.fineystjackets.com",
        "telephone": "+1 (888) 840-0885",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Address",
          "addressLocality": "Address",
          "addressRegion": "Address",
          "postalCode": "Address",
          "addressCountry": countryCode.toUpperCase()
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 43.67564012717867,
          "longitude": -76.16514538750089
        },
        "openingHours": "Mon-Fri 09:00-18:00",
        "priceRange": "$",
        "sameAs": [
          "https://www.instagram.com/fineystjackets/",
          "https://www.facebook.com/fineystjackets"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": 4.9,
          "reviewCount": 94
        }
      },
      {
        "@type": "WebSite",
        "url": `${siteUrl}/${countryCode}`,
        "name": "FINEYST JACKETS",
        "inLanguage": "en-US",
        "publisher": {
          "@type": "Organization",
          "name": "FINEYST JACKETS"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/${countryCode}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${siteUrl}/${countryCode}`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Men's Leather Jackets",
            "item": `${siteUrl}/${countryCode}/collections/mens-leather-jackets`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Women's Leather Jackets",
            "item": `${siteUrl}/${countryCode}/collections/womens-leather-jackets`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Men's Varsity Jackets",
            "item": `${siteUrl}/${countryCode}/collections/mens-varsity-jackets`
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "Women's Varsity Jackets",
            "item": `${siteUrl}/${countryCode}/collections/womens-varsity-jackets`
          }
        ]
      }
    ]
  }

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homePageSchema)
        }}
      />
      <section className="w-full mx-0 px-0 bg-[#efefef]">
        <SlideBanners />
      </section>
      <WelcomeAccordionSection />
      <ProductCategoryServer countryCode={countryCode} />
      <SignatureSectionServer countryCode={countryCode} />
      <ProductCarouselServer countryCode={countryCode} />
      <JacketColorCollectionServer countryCode={countryCode} />
      <AboutUsServer countryCode={countryCode} />
      <WhyChooseSliderServer />
      <FAQServer />
      <BlogsShowcaseServer countryCode={countryCode} />
      <GlobalFashionPartnerServer />
      <AnimatedReviewSectionServer />
    </>
  );
}

