"use client";

import type React from "react";
import { avertaBlack } from "@/src/lib/fonts";
import ProductCategoryClient from "./product-category-client";

interface ColorCategory {
  id: string;
  name: string;
  imageUrl: string;
  href: string;
}

interface JacketColorCollectionClientProps {
  colorCollection: ColorCategory[];
}

export default function JacketColorCollectionClient({ 
  colorCollection 
}: JacketColorCollectionClientProps) {
  return (
    <section className="w-full bg-[#2B2B2B] text-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>
      <div className="w-full px-4 pt-10 pb-12 md:pb-20 relative z-10">
        <div className="text-center mb-20">
          <h2 className={`text-2xl text-white sm:text-3xl md:text-4xl mb-6 tracking-tight leading-tight ${avertaBlack.className}`}>
            OUR COLOR COLLECTION
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
            Discover our exclusive range of premium jackets across different styles.
          </p>
        </div>

        <ProductCategoryClient
          bg="bg-[#2B2B2B]"
          arrowBgColor="bg-white"
          arrowTextColor="text-black"
          arrowHoverBgColor="hover:bg-gray-200"
          tabTextColor="text-gray-600"
          tabActiveColor="border-black text-black"
          tabHoverColor="hover:text-black"
          showTabs={false}
          categories={{
            men: colorCollection,
            women: colorCollection
          }}
        />
      </div>
    </section>
  );
}
