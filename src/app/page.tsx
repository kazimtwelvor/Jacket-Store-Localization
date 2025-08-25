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
  return (
    <>
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
