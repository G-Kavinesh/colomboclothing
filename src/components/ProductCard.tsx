import Link from "next/link";
import Image from "next/image";
import { Product, formatPrice } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textDecoration: "none",
        color: "var(--text)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          isolation: "isolate",
        }}
      >
        <Image
          src={product.images[0].src}
          alt={product.images[0].alt}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textAlign: "center",
        }}
      >
        {product.name}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 13,
          fontWeight: 500,
          color: "var(--text-muted)",
        }}
      >
        {formatPrice(product.price)}
      </div>
    </Link>
  );
}
