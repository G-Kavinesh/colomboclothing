import { productOgImage } from "@/lib/og";
import { getProduct, products } from "@/lib/products";

export const dynamic = "force-static";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return productOgImage(getProduct(slug)!);
}
