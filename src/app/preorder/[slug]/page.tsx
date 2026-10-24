import { Suspense } from "react";
import PreorderForm from "@/components/PreorderForm";
import { products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function PreorderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense>
      <PreorderForm slug={slug} />
    </Suspense>
  );
}
