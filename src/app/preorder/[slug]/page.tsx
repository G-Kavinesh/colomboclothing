import type { Metadata } from "next";
import { Suspense } from "react";
import PreorderForm from "@/components/PreorderForm";
import { products, getProduct } from "@/lib/products";
import { productMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not Found" };
  return productMetadata(product, `/preorder/${slug}`, `Pre-order ${product.name}`);
}

export default async function PreorderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense>
      <PreorderForm slug={slug} />
    </Suspense>
  );
}
