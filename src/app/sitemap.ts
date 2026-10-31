import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { COMING_SOON, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// The shop and product pages are left out until launch (see SHOP_ROBOTS)
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", ...(COMING_SOON ? [] : ["/shop"]), "/contact", "/terms", "/privacy", "/cookies", "/accessibility"];
  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...(COMING_SOON ? [] : products).map((p) => ({
      url: `${SITE_URL}/shop/${p.slug}`,
      images: [new URL(p.shareImage ?? p.images[0].src, SITE_URL).toString()],
    })),
  ];
}
