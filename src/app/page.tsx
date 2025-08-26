import type { Metadata } from 'next'
import SlideBanners from "@/src/app/components/home-page-components/banners/slide-banners";
import WelcomeAccordionSection from "./components/home-page-components/welcome-section/welcome-section";
import ProductCategory from "./components/home-page-components/product-category/product-category";
import SignatureStylesSection from "./components/home-page-components/signature-styles/signature-section";
import ProductCarousel from "./components/home-page-components/product-category/product-carousel";
import JacketColorCollection from "./components/home-page-components/product-category/jacket-color-collection";
import AboutSection from "./components/home-page-components/about-us/about-us";
import WhyChooseSlider from "./components/home-page-components/why-choose-slider/why-choose-slider";
import FAQ from "./components/home-page-components/faqs/faq";
import BlogsShowcase from "./components/home-page-components/blog-showcase/blog-showcase";
import GlobalFashionPartners from "./components/home-page-components/global-fashion-partner/global-fashion-partner";
import AnimatedReviewsSection from "./components/home-page-components/animated-review-section/animated-review-section";

export const metadata: Metadata = {
  title: 'Premium Jackets & Outerwear | Jacket.us.com',
  description: 'Discover premium quality jackets and outerwear at Jacket.us.com. Shop leather jackets, winter coats, and stylish outerwear with fast shipping and excellent customer service.',
  alternates: {
    canonical: 'https://jacket.us.com/'
  }
}

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Fineyst",
    "url": "https://jacket.us.com",
    "logo": "https://jacket.us.com/logo.webp",
    "description": "Premium quality jackets and outerwear with fast shipping and excellent customer service.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-555-1234",
      "contactType": "customer service",
      "email": "support@storecopy.com"
    },
    "sameAs": [
      "https://facebook.com",
      "https://twitter.com",
      "https://instagram.com"
    ]
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Fineyst",
    "url": "https://jacket.us.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://jacket.us.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <section className="w-full mx-0 px-0 bg-[#efefef]">
        <SlideBanners />
      </section>
      <WelcomeAccordionSection />
      <ProductCategory />
      <SignatureStylesSection />
      <ProductCarousel />
      <JacketColorCollection />
      <AboutSection />
      <WhyChooseSlider />
      <FAQ />
      <BlogsShowcase />
      <GlobalFashionPartners />
      <AnimatedReviewsSection />
    </>
  );
}
