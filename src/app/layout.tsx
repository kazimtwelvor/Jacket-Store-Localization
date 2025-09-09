
import "./globals.css";
import "./styles/mobile-fixes.css";
import Navbar from "@/src/app/components/navbar/Navbar";
import { FontProvider } from "@/src/components/font-provider";
import { CartProvider } from "@/src/app/contexts/CartContext";
import { avertaBold, avertaDefault } from "@/src/lib/fonts";
import Footer from "./components/home-page-components/footer/footer";
import RouteLoadingOverlay from "@/src/app/components/layout/route-loading-overlay";
import CartSidebarWrapper from "./components/layout/cart-sidebar-wrapper";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${avertaDefault.variable} ${avertaBold.variable} w-full mx-0 px-0 bg-[#000000]`}>
        <FontProvider>
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
            <Suspense fallback={<div />}>
              {children}
            </Suspense>
            <Footer />
            <CartSidebarWrapper />
          </CartProvider>
        </FontProvider>
      </body>
    </html>
  );
}