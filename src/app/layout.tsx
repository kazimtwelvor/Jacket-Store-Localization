
import "./globals.css";
import "./styles/mobile-fixes.css";
import Navbar from "@/src/app/components/navbar/Navbar";
import { FontProvider } from "@/src/components/font-provider";
import { CartProvider } from "@/src/app/contexts/CartContext";
import { CountryProvider } from "@/src/app/contexts/CountryContext";
import { avertaBold, avertaDefault } from "@/src/lib/fonts";
import Footer from "./components/home-page-components/footer/footer";
import RouteLoadingOverlay from "@/src/app/components/layout/route-loading-overlay";
import CartSidebarWrapper from "./components/layout/cart-sidebar-wrapper";
import GlobalCountryNavigation from "./components/navigation/GlobalCountryNavigation";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${avertaDefault.variable} ${avertaBold.variable} w-full mx-0 px-0 bg-[#000000] min-h-screen flex flex-col`}>
        <FontProvider>
          <Suspense fallback={<div />}>
            <CountryProvider>
              <CartProvider>
              <noscript>
                <div style={{background:'#111', color:'#fff', padding:'8px 12px', textAlign:'center'}}>
                  For the best experience, enable JavaScript. Basic content is still available.
                </div>
              </noscript>
              <Suspense fallback={<div />}>
                <Navbar />
              </Suspense>
              <Suspense fallback={null}>
                <RouteLoadingOverlay />
              </Suspense>
              <main className="flex-1">
                <Suspense fallback={<div className="min-h-[50vh]" />}>
                  {children}
                </Suspense>
              </main>
              <Footer />
              <CartSidebarWrapper />
              <Suspense fallback={null}>
                <GlobalCountryNavigation />
              </Suspense>
              </CartProvider>
            </CountryProvider>
          </Suspense>
        </FontProvider>
      </body>
    </html>
  );
}