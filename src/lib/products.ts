export type Product = {
  slug: string;
  name: string;
  price: number;
  category: string;
  description: string;
  sizes: string[];
  images: { src: string; alt: string }[];
  preorder?: boolean;
  preorderNote?: string;
};

export const products: Product[] = [
  {
    slug: "ts-01-oversize-tee",
    name: "CMB-01 OVERSIZE TEE",
    price: 4000,
    category: "TEES",
    description:
      "Heavyweight 240gsm cotton oversize tee. Drop shoulder, ribbed crew neck, relaxed boxy fit. Pre-shrunk garment-dyed fabric with a lived-in softness from day one.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      { src: "/images/tee-front.webp", alt: "CMB-01 Oversize Tee — front" },
      { src: "/images/tee-back.webp", alt: "CMB-01 Oversize Tee — back" },
      { src: "/images/tee-side.png", alt: "CMB-01 Oversize Tee — side" },
    ],
    preorder: true,
    preorderNote: "Expected dispatch: 2–3 weeks",
  },
  {
    slug: "cmb-02-cap",
    name: "CMB-01 CAP",
    price: 3000,
    category: "CAPS",
    description:
      "Structured six-panel cap with embroidered Colombo branding. Adjustable strap closure, pre-curved brim, breathable cotton twill. One size fits all.",
    sizes: ["ONE SIZE"],
    images: [
      { src: "/images/cap-view01.webp", alt: "CMB-01 Cap — view 1" },
    ],
    preorder: true,
    preorderNote: "Expected dispatch: 2–3 weeks",
  },
  {
    slug: "cmb-01-tote",
    name: "CMB-01 TOTE",
    price: 2000,
    category: "BAGS",
    description:
      "Heavy-duty canvas tote with Colombo branding. Reinforced stitching, spacious interior, sturdy handles. Built to carry everything.",
    sizes: ["ONE SIZE"],
    images: [
      { src: "/images/tote-view01.webp", alt: "CMB-01 Tote — view 1" },
      { src: "/images/tote-view02.webp", alt: "CMB-01 Tote — view 2" },
    ],
    preorder: true,
    preorderNote: "Expected dispatch: 2–3 weeks",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(price: number): string {
  return `LKR ${price.toLocaleString()}`;
}
