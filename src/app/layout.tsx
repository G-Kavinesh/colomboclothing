import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Colombo Clothing",
  description: "Oversize essentials from Colombo — heavyweight, garment-dyed, built to last.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <body className={ibmPlexMono.className}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
