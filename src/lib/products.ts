export type Product = {
  slug: string;
  name: string;
  price: number;
  category: string;
  description: string;
  sizes: string[];
  images: { src: string; alt: string }[];
};

export const products: Product[] = [
  {
    slug: "ts-01-oversize-tee",
    name: "TS-01 OVERSIZE TEE",
    price: 3000,
    category: "TEES",
    description:
      "Heavyweight 240gsm cotton oversize tee. Drop shoulder, ribbed crew neck, relaxed boxy fit. Pre-shrunk garment-dyed fabric with a lived-in softness from day one.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      { src: "/images/tee-front.webp", alt: "TS-01 Oversize Tee — front" },
      { src: "/images/tee-back.webp", alt: "TS-01 Oversize Tee — back" },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(price: number): string {
  return `LKR ${price.toLocaleString()}`;
}
