import ProductDetail from "@/components/ProductDetail";
import { products, getProduct } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) return { title: "Not Found — Colombo Clothing" };
  return { title: `${product.name} — Colombo Clothing` };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductDetail slug={params.slug} />;
}
