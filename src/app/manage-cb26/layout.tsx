import type { Metadata } from "next";
import { ProductProvider } from "@/lib/product-context";
import { products } from "@/lib/product-data";
import { hasSession } from "@/lib/admin-session";

// Keep the admin out of search results and away from crawlers entirely
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// The product list is sent only to a signed-in admin, so the page's HTML doesn't
// reveal the pieces before launch. The key remounts the dashboard when that changes.
export default async function Layout({ children }: { children: React.ReactNode }) {
  const signedIn = await hasSession().catch(() => false);
  return (
    <ProductProvider key={signedIn ? "in" : "out"} initialProducts={signedIn ? products : []}>
      {children}
    </ProductProvider>
  );
}
