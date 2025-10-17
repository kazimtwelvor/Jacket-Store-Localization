"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { notFound, useRouter } from "next/navigation";
import ResponsiveContainer from "@/src/app/ui/responsive-container";
import { avertaBlack } from "@/src/lib/fonts";
import ShopButton from "@/src/app/components/shop-button";
import { useCountry } from "@/src/hooks/use-country";

export interface typeGender {
  male: string;
  female: string;
}
export const DesktopBannerContent = () => {
  const router = useRouter();
  const { countryCode } = useCountry();

  const handleShopClick = (gender: string) => {
    let url: string;
    if (gender === "men") {
      url = `/${countryCode}/collections/leather-bomber-jacket-mens`;
    } else if (gender === "women") {
      url = `/${countryCode}/collections/womens-leather-bomber-jackets`;
    } else {
      notFound();
      return;
    }
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('route-loading:start'));
    }
    router.push(url);
  };

  return (
    <ResponsiveContainer>
      <section className="py-24 sm:py-32 md:py-40 lg:py-48 text-center relative">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${avertaBlack.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6 md:mb-8 tracking-tight`}
          >
            FINEYST JACKETS
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: "var(--font-averta-default)" }}
            className="text-sm sm:text-base md:text-lg text-black lg:text-xl mb-8 md:mb-10 max-w-3xl mx-auto"
          >
            {" "}
            <span className={`${avertaBlack.className} font-black`}>
            Where Leather Meets Legacy.
            </span>{" "}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${avertaBlack.className} flex flex-col sm:flex-row justify-center gap-4 sm:gap-5`}
          >
            <ShopButton
              variant="filled"
              size="lg"
              showArrow={true}
              ariaLabel="Shop men's collection"
              className="w-full sm:w-auto min-w-[180px]"
              as="div"
              onClick={() => handleShopClick("men")}
            >
              Shop Men
            </ShopButton>
            <ShopButton
              variant="filled"
              size="lg"
              showArrow={true}
              ariaLabel="Shop women's collection"
              className="w-full sm:w-auto min-w-[180px]"
              as="div"
              onClick={() => handleShopClick("women")}
            >
              Shop Women
            </ShopButton>
          </motion.div>
        </div>
      </section>
    </ResponsiveContainer>
  );
};
