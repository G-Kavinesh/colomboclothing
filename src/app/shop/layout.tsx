import type { Metadata } from "next";
import { TITLE_TEMPLATE } from "@/lib/metadata";

// Page is a client component, so its metadata lives here
export const metadata: Metadata = {
  title: { default: "Shop", template: TITLE_TEMPLATE },
  description: "Shop heavyweight, garment-dyed oversize tees, caps and totes from Colombo Clothing.",
  alternates: { canonical: "/shop" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
