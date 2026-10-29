import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/shop", "/contact", "/terms", "/privacy", "/cookies", "/accessibility"];
  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...products.map((p) => ({
      url: `${SITE_URL}/shop/${p.slug}`,
      images: [new URL(p.shareImage ?? p.images[0].src, SITE_URL).toString()],
    })),
  ];
}
