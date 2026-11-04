// Product type and price formatting, safe for any page. The product list itself is in
// product-data.ts, which only server code imports, so it never ships in browser
// scripts on its own.
export type Product = {
  slug: string;
  name: string;
  price: number;
  category: string;
  description: string;
  sizes: string[];
  images: { src: string; alt: string }[];
  // Image used for link previews when it differs from images[0]
  shareImage?: string;
  preorder?: boolean;
  preorderNote?: string;
};

export function formatPrice(price: number): string {
  return `LKR ${price.toLocaleString()}`;
}
