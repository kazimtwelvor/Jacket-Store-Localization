
import "./globals.css";
import Navbar from "@/src/app/components/navbar/Navbar";
import { avertaBold, avertaDefault } from "@/public/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${avertaDefault.variable} ${avertaBold.variable} w-full mx-0 px-0`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
