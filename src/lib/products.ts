// Product type and price formatting, safe for any page. The product list itself is in
// product-data.ts, which only server code imports, so it never ships in browser
// scripts on its own.
export type ProductImage = { src: string; alt: string };

export type ProductColor = {
  name: string;
  // Swatch fill shown in the colour picker
  swatch: string;
  images: ProductImage[];
};

export type Product = {
  slug: string;
  name: string;
  price: number;
  category: string;
  description: string;
  sizes: string[];
  // Default gallery; for a product with colours, the first colour's photos
  images: ProductImage[];
  colors?: ProductColor[];
  // CSS aspect-ratio of the photos, e.g. "2 / 3" for portrait shots. Square by default.
  imageRatio?: string;
  // Image used for link previews when it differs from images[0]
  shareImage?: string;
  preorder?: boolean;
  preorderNote?: string;
};

export function formatPrice(price: number): string {
  return `LKR ${price.toLocaleString()}`;
}

// The photos for a colour, falling back to the default gallery
export function imagesFor(product: Product, color?: string): ProductImage[] {
  return product.colors?.find((c) => c.name === color)?.images ?? product.images;
}
