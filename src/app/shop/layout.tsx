import type { Metadata } from "next";
import { SHOP_ROBOTS, TITLE_TEMPLATE } from "@/lib/metadata";
import { ProductProvider } from "@/lib/product-context";
import { products } from "@/lib/product-data";

// Page is a client component, so its metadata lives here
export const metadata: Metadata = {
  title: { default: "Shop", template: TITLE_TEMPLATE },
  description: "Shop heavyweight, garment-dyed oversize tees, caps and totes from Undefined Department.",
  robots: SHOP_ROBOTS,
  alternates: { canonical: "/shop" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProductProvider initialProducts={products}>{children}</ProductProvider>;
}
