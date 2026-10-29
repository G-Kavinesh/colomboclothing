import type { Metadata } from "next";
import ProductDetail from "@/components/ProductDetail";
import { products, getProduct } from "@/lib/products";
import { productJsonLd, productMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not Found" };
  return productMetadata(product, `/shop/${slug}`);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  return (
    <>
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)).replace(/</g, "\\u003c") }}
        />
      )}
      <ProductDetail slug={slug} />
    </>
  );
}
