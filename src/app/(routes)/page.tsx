// import getBillboard from "@/actions/get-billboard"
// import getProducts from "@/actions/get-products"
// import HomePageClient from "../../components/home-page-components/home-page-client"
import { Suspense } from "react";
import getBillboard from "../actions/get-billboard";
import getProducts from "../actions/get-products";
import HomePageClient from "../components/homePageComponents/home-page-client";

// Enable dynamic rendering for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  try {
    // Fetch data in parallel for better performance
    const [billboard, productsData] = await Promise.all([
      getBillboard("2bab19ec-b52f-4a41-8288-b48d2789019a"),
      getProducts({ limit: 12 }),
    ]);

    const products = productsData.products;

    // Fashion showcase items with actual images and background colors
    const showcaseItems = [
      {
        id: "suit-jacket",
        title: "THE SUIT JACKET",
        image: "/images/suit-jacket.png",
        link: "/product/suit-jacket",
        bgColor: "bg-white",
      },
      {
        id: "everyday-jacket",
        title: "THE EVERYDAY JACKET",
        image: "/images/everyday-jacket.png",
        link: "/product/everyday-jacket",
        bgColor: "bg-[#B01E23]",
      },
      {
        id: "trousers",
        title: "THE TROUSERS",
        image: "/images/trousers.png",
        link: "/product/trousers",
        bgColor: "bg-gray-200",
      },
    ];

    const features = [
      {
        title: "Free Shipping",
        description: "Enjoy free shipping on orders over $100.",
        icon: "Truck",
        link: "/shipping",
      },
      {
        title: "Secure Payments",
        description: "Your data is protected with 256-bit SSL encryption.",
        icon: "CreditCard",
        link: "/payment",
      },
      {
        title: "Easy Returns",
        description: "Hassle-free returns within 30 days.",
        icon: "RefreshCw",
        link: "/returns",
      },
      {
        title: "Quality Guarantee",
        description:
          "We stand behind every product with our quality guarantee.",
        icon: "Shield",
        link: "/quality",
      },
      {
        title: "Gift Services",
        description:
          "Make your gift special with our premium gift wrapping service.",
        icon: "Gift",
        link: "/gift",
      },
      {
        title: "24/7 Support",
        description:
          "Our dedicated customer service team is available around the clock.",
        icon: "HeadphonesIcon",
        link: "/contact",
      },
    ];

    // Wrap the client component in Suspense for better loading experience
    return (
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <HomePageClient
          billboard={billboard}
          products={products}
          showcaseItems={showcaseItems}
          features={features}
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Error rendering HomePage:", error);
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-500">
          We're having trouble loading the store data. Please try again later.
        </p>
      </div>
    );
  }
}
