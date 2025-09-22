import type { Metadata } from 'next'
import SlideBanners from "@/src/app/components/home-page-components/banners/slide-banners-server";
import WelcomeAccordionSection from "./components/home-page-components/welcome-section/welcome-section-server";
import ProductCategoryServer from "./components/home-page-components/product-category/product-category-server";
import SignatureSectionServer from "./components/home-page-components/signature-styles/signature-section-server";
import ProductCarouselServer from "./components/home-page-components/product-category/product-carousel-server";
import JacketColorCollectionServer from "./components/home-page-components/product-category/jacket-color-collection-server";
import AboutUsServer from "./components/home-page-components/about-us/about-us-server";
import WhyChooseSliderServer from "./components/home-page-components/why-choose-slider/why-choose-slider-server";
import FAQServer from "./components/home-page-components/faqs/faq-server";
import BlogsShowcaseServer from "./components/home-page-components/blog-showcase/blog-showcase-server";
import GlobalFashionPartners from "./components/home-page-components/global-fashion-partner/global-fashion-partner";
import AnimatedReviewsSection from "./components/home-page-components/animated-review-section/animated-review-section";

export const metadata: Metadata = {
  title: 'Premium Jackets & Outerwear | Jacket.us.com',
  description: 'Discover premium quality jackets and outerwear at Jacket.us.com. Shop leather jackets, winter coats, and stylish outerwear with fast shipping and excellent customer service.',
  alternates: {
    canonical: 'https://jacket.us.com/us'
  }
}

export default function Home() {
  const homePageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "FINEYST JACKETS",
        "url": "https://jacket.us.com/us",
        "logo": "https://jacket.us.com/logo.webp",
        "image": "https://jacket.us.com/images/banner.webp",
        "description": "jacket.us.com/us is a U.S.-based brand specializing in premium leather jackets, offering biker, bomber, cropped, custom, and trench styles crafted from high-quality cowhide, lambskin, goatskin, and suede. Designed for durability and timeless style, our jackets deliver comfort, edge, and authenticity. Fast nationwide shipping, secure ordering, and dedicated customer service.",
        "email": "info@jacket.us.com",
        "telephone": "+1-888-000-0000",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Address",
          "addressLocality": "Address",
          "addressRegion": "Address",
          "postalCode": "Address",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 43.67564012717867,
          "longitude": -76.16514538750089
        },
        "openingHours": "Mon-Fri 09:00-18:00",
        "priceRange": "$",
        "sameAs": [
          "https://www.instagram.com/fineystpatches/",
          "https://www.facebook.com/fineystpatches/"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": 4.9,
          "reviewCount": 94
        }
      },
      {
        "@type": "WebSite",
        "url": "https://jacket.us.com/us",
        "name": "FINEYST JACKETS",
        "inLanguage": "en-US",
        "publisher": {
          "@type": "Organization",
          "name": "FINEYST JACKETS"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://jacket.us.com/us/search?q={search_term_string}",
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
            "item": "https://jacket.us.com/us"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Men's Leather Jackets",
            "item": "https://jacket.us.com/us/collections/mens-leather-jackets"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Women's Leather Jackets",
            "item": "https://jacket.us.com/us/collections/womens-leather-jackets"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Men's Varsity Jackets",
            "item": "https://jacket.us.com/us/collections/mens-varsity-jackets"
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "Women's Varsity Jackets",
            "item": "https://jacket.us.com/us/collections/womens-varsity-jackets"
          }
        ]
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <section className="w-full mx-0 px-0 bg-[#efefef]">
        <SlideBanners />
      </section>
      <WelcomeAccordionSection />
      <ProductCategoryServer />
      <SignatureSectionServer />
      <ProductCarouselServer />
      <JacketColorCollectionServer />
      <AboutUsServer />
      <WhyChooseSliderServer />
      <FAQServer />
      <BlogsShowcaseServer />
      <GlobalFashionPartners />
      <AnimatedReviewsSection />
    </>
  );
}
