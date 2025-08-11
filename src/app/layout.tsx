
import "./globals.css";
import Navbar from "@/src/app/components/navbar/Navbar";
import { FontProvider } from "@/src/components/font-provider";
import { CartProvider } from "@/src/app/contexts/CartContext";
import { avertaBold, avertaDefault } from "@/src/lib/fonts";

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
            <Navbar />
            {children}
          </CartProvider>
        </FontProvider>
      </body>
    </html>
  );
}