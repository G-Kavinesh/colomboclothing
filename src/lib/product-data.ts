import type { Product, ProductColor } from "./products";

// Server-only: import this from server components, routes and metadata, never from a
// "use client" file. Pages that render the shop hand the list to ProductProvider as a
// prop, so it reaches the browser only when one of those pages is shown (and the
// proxy keeps them closed while the coming soon page is up).

// Photos live in public/images/products/<code>-<colour>-<n>.webp
function colorway(code: string, label: string, name: string, swatch: string): ProductColor {
  const views = ["back", "back, on model", "back, on model", "front", "front, on model"];
  return {
    name,
    swatch,
    images: views.map((view, i) => ({
      src: `/images/products/${code}-${name.toLowerCase()}-${i + 1}.webp`,
      alt: `${label} in ${name.toLowerCase()} — ${view}`,
    })),
  };
}

const teeColors = [
  colorway("ud-01", "UD-01 Undefined Tee", "BURGUNDY", "#5a1520"),
  colorway("ud-01", "UD-01 Undefined Tee", "BLACK", "#111111"),
];

export const products: Product[] = [
  {
    slug: "ud-01-undefined-tee",
    name: "UD-01 UNDEFINED TEE",
    price: 3000,
    category: "TEES",
    description:
      "Boxy, cropped tee in premium heavyweight cotton. Dropped shoulders, a ribbed crew neck and an arched \"undefined\" print across the back, with the UDFDPT. script on the chest.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: teeColors[0].images,
    colors: teeColors,
    imageRatio: "2 / 3",
    shareImage: teeColors[0].images[0].src,
    preorder: true,
    preorderNote: "Expected dispatch: 2–3 weeks",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
