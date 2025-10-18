
import "./globals.css";
import "./styles/mobile-fixes.css";
import Navbar from "@/src/app/components/navbar/Navbar";
import { FontProvider } from "@/src/components/font-provider";
import { CartProvider } from "@/src/app/contexts/CartContext";
import { ClarityProvider } from "@/src/app/providers/clarity-provider";
import { CurrencyProvider } from "@/src/contexts/CurrencyContext";
import { ClarityScript } from "@/src/app/components/clarity-script";
import { avertaBold, avertaDefault } from "@/src/lib/fonts";
import Footer from "./components/home-page-components/footer/footer";
import RouteLoadingOverlay from "@/src/app/components/layout/route-loading-overlay";
import CartSidebarWrapper from "./components/layout/cart-sidebar-wrapper";
import { Suspense } from "react";
import type { Metadata } from "next";
import CustomChatButton from "./components/custom-chat-button";

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

        {/* Meta (Facebook) Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID || ''}');
              fbq('track', 'PageView');
            `
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID || ''}&ev=PageView&noscript=1`}
          />
        </noscript>
        {/* End Meta Pixel */}

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
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <FontProvider>
          <ClarityProvider>
            <CurrencyProvider>
              {/* <Suspense fallback={<div />}> */}
              <CartProvider>
              <noscript>
                <div style={{ background: '#111', color: '#fff', padding: '8px 12px', textAlign: 'center' }}>
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
              <CustomChatButton />
            </CurrencyProvider>
          </ClarityProvider>
        </FontProvider>
      </body>
    </html>
  );
}