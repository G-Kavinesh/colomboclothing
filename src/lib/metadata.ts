import type { Metadata } from "next";
import { formatPrice, type Product } from "@/lib/products";
import { COMING_SOON, OPEN_GRAPH_BASE, SITE_NAME, SITE_URL } from "@/lib/site";

// Pages that shouldn't show up in search results (bag, checkout, admin, etc).
// They still get a proper title so a shared link reads correctly.
export const NO_INDEX: Metadata["robots"] = { index: false, follow: true };

// The shop and product pages stay out of search results until launch, so Google
// doesn't show the pieces before Drop 01. They come back with the COMING_SOON flag.
export const SHOP_ROBOTS: Metadata["robots"] = COMING_SOON ? NO_INDEX : undefined;

// A layout that sets its own title must pass the template on, or the pages
// beneath it lose the " — Colombo Clothing" suffix.
export const TITLE_TEMPLATE = `%s — ${SITE_NAME}`;

// Share preview for a product, used by both its shop page and its pre-order page.
// Both point at the same generated card under /shop/[slug]/og.jpg.
export function productMetadata(product: Product, path: string, title = product.name): Metadata {
  const description = `${formatPrice(product.price)}${product.preorder ? " · Pre-order now" : ""}. ${product.description}`;
  return {
    title,
    description,
    robots: SHOP_ROBOTS,
    alternates: { canonical: path },
    openGraph: {
      ...OPEN_GRAPH_BASE,
      url: path,
      images: [
        {
          // Versioned like SITE_OG_IMAGE: the card's "pre-order" badge changes with this flag
          url: `/shop/${product.slug}/og.jpg?v=${product.preorder ? "preorder" : "live"}`,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: `${product.name} — ${formatPrice(product.price)}`,
        },
      ],
    },
  };
}

// Product structured data so Google can show price and availability in results.
export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    image: [product.shareImage ?? product.images[0].src, ...product.images.map((i) => i.src)]
      .filter((src, i, all) => all.indexOf(src) === i)
      .map((src) => new URL(src, SITE_URL).toString()),
    brand: { "@type": "Brand", name: "Colombo Clothing" },
    offers: {
      "@type": "Offer",
      url: new URL(`/shop/${product.slug}`, SITE_URL).toString(),
      price: product.price,
      priceCurrency: "LKR",
      availability: product.preorder ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
    },
  };
}
