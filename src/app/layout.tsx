
import "./globals.css";
import "./styles/mobile-fixes.css";
import Navbar from "@/src/app/components/navbar/Navbar";
import { FontProvider } from "@/src/components/font-provider";
import { CartProvider } from "@/src/app/contexts/CartContext";
import { ClarityProvider } from "@/src/app/providers/clarity-provider";
import { ClarityScript } from "@/src/app/components/clarity-script";
import { avertaBold, avertaDefault } from "@/src/lib/fonts";
import Footer from "./components/home-page-components/footer/footer";
import RouteLoadingOverlay from "@/src/app/components/layout/route-loading-overlay";
import CartSidebarWrapper from "./components/layout/cart-sidebar-wrapper";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Premium Jackets & Outerwear | Fineyst Jackets',
  description: 'Discover premium quality jackets and outerwear at Fineyst Jackets. Shop leather jackets, winter coats, and stylish outerwear with fast shipping and excellent customer service.',
  metadataBase: new URL('https://www.fineystjackets.com'),
  alternates: {
    canonical: 'https://www.fineystjackets.com/us',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5FDZTZJV');`
        }} />
        {/* End Google Tag Manager */}
        
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="7fzjFZWpRYLIz_L2sKypuvXyhyf44Na3by5X3a96l9g" />
        
        {/* Preload critical images */}
        <link
          rel="preload"
          href="/images/banner.webp"
          as="image"
          type="image/webp"
        />
        <link
          rel="preload"
          href="/images/leather.webp"
          as="image"
          type="image/webp"
        />

        {/* Font optimization */}
        <link
          rel="preload"
          href="/fonts/Averta-Regular.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Averta-Bold.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        
        {/* Initialize dataLayer */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];`
          }}
        />
        
        {/* Microsoft Clarity Script */}
        <ClarityScript />
      </head>
      <body className={`${avertaDefault.variable} ${avertaBold.variable} w-full mx-0 px-0 bg-[#000000] min-h-screen flex flex-col`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-5FDZTZJV"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        <FontProvider>
          <ClarityProvider>
            {/* <Suspense fallback={<div />}> */}
                <CartProvider>
                <noscript>
                  <div style={{background:'#111', color:'#fff', padding:'8px 12px', textAlign:'center'}}>
                    For the best experience, enable JavaScript. Basic content is still available.
                  </div>
                </noscript>
                {/* <Suspense fallback={<div />}> */}
                  <Navbar />
                {/* </Suspense> */}
                <Suspense fallback={null}>
                  <RouteLoadingOverlay />
                </Suspense>
                <main className="flex-1">
                  {/* <Suspense fallback={<div className="min-h-[50vh]" />}> */}
                    {children}
                  {/* </Suspense> */}
                </main>
                <Footer />
                <CartSidebarWrapper />
                </CartProvider>
            {/* </Suspense> */}
          </ClarityProvider>
        </FontProvider>
      </body>
    </html>
  );
}