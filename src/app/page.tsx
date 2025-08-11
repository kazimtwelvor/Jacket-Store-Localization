import SlideBanners from "@/src/app/components/home-page-components/banners/slide-banners";
import WelcomeAccordionSection from "./components/home-page-components/welcome-section/welcome-section";
import ProductCategory from "./components/home-page-components/product-category/product-category";

export default function Home() {
  return (
    <>
      <section className="w-full mx-0 px-0 bg-[#efefef]">
        <SlideBanners />
      </section>
      <WelcomeAccordionSection />
      <ProductCategory />
    </>
  );
}
