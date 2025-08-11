
import "./globals.css";
import Navbar from "@/src/app/components/navbar/Navbar";
import { FontProvider } from "@/src/components/font-provider";
import { CartProvider } from "@/src/app/contexts/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full mx-0 px-0">
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