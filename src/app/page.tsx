import SlideBanners from "@/src/app/components/home-page-components/banners/slide-banners";
import WelcomeAccordionSection from "./components/home-page-components/welcome-section/welcome-section";
import ProductCategory from "./components/home-page-components/product-category/product-category";
import SignatureStylesSection from "./components/home-page-components/signature-styles/signature-section";
import ProductCarousel from "./components/home-page-components/product-category/product-carousel";
import JacketColorCollection from "./components/home-page-components/product-category/jacket-color-collection";
import AboutSection from "./components/home-page-components/about-us/about-us";
import WhyChooseSlider from "./components/home-page-components/why-choose-slider/why-choose-slider";

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
    </>
  );
}
