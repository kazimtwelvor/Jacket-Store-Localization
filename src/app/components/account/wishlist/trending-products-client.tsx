"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import Currency from "@/src/app/ui/currency"
import Link from "next/link";

export default function TrendingProducts() {
  const [products, setProducts] = useState([
    {
      id: "product1",
      name: "GARY CRYSTAL-TRIM TRAINERS IN LEATHER",
      price: "399.00",
      images: [
        {
          id: "img1",
          url: "http://localhost:3001/uploads/2025/leather-jacket-1.jpg",
        },
      ],
      isFeatured: true,
      category: {
        id: "cat1",
        name: "Shoes",
        billboard: { id: "bill1", label: "Shoes", imageUrl: "" },
      },
      size: { id: "size1", name: "42", value: "42" },
      color: { id: "color1", name: "Black", value: "#000000" },
    },
    {
      id: "product2",
      name: "MERCERIZED-COTTON POLO SHIRT",
      price: "129.00",
      images: [
        {
          id: "img2",
          url: "http://localhost:3001/uploads/2025/leather-jacket-2.jpg",
        },
      ],
      isFeatured: true,
      category: {
        id: "cat2",
        name: "Shirts",
        billboard: { id: "bill2", label: "Shirts", imageUrl: "" },
      },
      size: { id: "size2", name: "M", value: "M" },
      color: { id: "color2", name: "White", value: "#FFFFFF" },
    },
    {
      id: "product3",
      name: "THREE-PACK OF STRETCH-COTTON BOXER BRIEFS",
      price: "49.00",
      images: [
        {
          id: "img3",
          url: "http://localhost:3001/uploads/2025/leather-jacket-3.jpg",
        },
      ],
      isFeatured: true,
      category: {
        id: "cat3",
        name: "Underwear",
        billboard: { id: "bill3", label: "Underwear", imageUrl: "" },
      },
      size: { id: "size3", name: "L", value: "L" },
      color: { id: "color3", name: "Black", value: "#000000" },
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        try {
          if (!process.env.NEXT_PUBLIC_API_URL) {
            console.warn('API URL not configured, using fallback products');
            return;
          }

          // Use direct external API call with proper error handling and caching
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products?isFeatured=true`,
            {
              next: { revalidate: 1800 }, // Cache for 30 minutes
              cache: "force-cache",
              headers: {
                "Accept": "application/json",
                "User-Agent": "Fineyst-App"
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              const updatedProducts = data
                .slice(0, 3)
                .map((product: any, index: number) => ({
                  ...product,
                  images: [
                    {
                      id: `img${index + 1}`,
                      url: products[index].images[0].url,
                    },
                  ],
                }));
              setProducts(updatedProducts);
            }
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return <div className="py-8 text-center">Loading trending products...</div>;
  }

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-6">TRENDING NOW</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product: any, index: number) => (
          <div key={product.id} className="group relative">
            {index === 0 && (
              <div className="absolute top-2 left-2 z-10 bg-[#2b2b2b] text-white text-xs font-bold px-2 py-1">
                Sale-20%
              </div>
            )}
            {index === 1 && (
              <div className="absolute top-2 left-2 z-10 bg-[#2b2b2b] text-white text-xs font-bold px-2 py-1">
                Sale-30%
              </div>
            )}
            {index === 2 && (
              <div className="absolute top-2 left-2 z-10 bg-black text-white text-xs font-bold px-2 py-1">
                Bestseller
              </div>
            )}

            <button className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md">
              <Heart className="h-5 w-5" />
            </button>

            <Link
              href={`/product/${product.id}`}
              className="block aspect-[3/4] w-full overflow-hidden bg-gray-100"
            >
              <Image
                src={product.images[0]?.url || "/placeholder.svg"}
                alt={product.name}
                width={400}
                height={600}
                className="w-full h-full object-cover"
              />
            </Link>

            <div className="mt-4">
              <div className="text-center font-bold">FINEYST</div>
              <h3 className="text-sm text-center mt-1 uppercase line-clamp-2">
                {product.name}
              </h3>

              <div className="flex justify-center items-center mt-2 gap-2">
                {index < 2 && (
                  <>
                    <span className="text-gray-500 line-through">
                      <Currency value={index === 0 ? "399.00" : "129.00"} />
                    </span>
                    <span className="text-red-600 font-bold">
                      <Currency value={index === 0 ? "300.00" : "89.00"} />
                    </span>
                  </>
                )}
                {index === 2 && (
                  <span className="font-bold">
                    <Currency value="49.00" />
                  </span>
                )}
              </div>

              <div className="flex justify-center mt-3">
                {index === 0 && (
                  <div className="border border-gray-300 px-3 py-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-black"></div>
                      <span>Black</span>
                    </div>
                  </div>
                )}
                {index === 1 && (
                  <div className="border border-gray-300 px-3 py-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                      <span>+ 4 Colors</span>
                    </div>
                  </div>
                )}
                {index === 2 && (
                  <div className="border border-gray-300 px-3 py-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-black"></div>
                      <span>+ 1 Color</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
