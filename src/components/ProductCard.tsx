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
        color: "#111",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          mixBlendMode: "multiply",
          isolation: "isolate",
        }}
      >
        <Image
          src={product.images[0].src}
          alt={product.images[0].alt}
          fill
          style={{
            objectFit: "contain",
            filter: "brightness(1.06)",
          }}
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
          color: "#6b6b6b",
        }}
      >
        {formatPrice(product.price)}
      </div>
    </Link>
  );
}
