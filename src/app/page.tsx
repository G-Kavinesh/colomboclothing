"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/lib/product-context";

export default function Home() {
  const { products } = useProducts();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1100,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "64px 48px",
          }}
        >
          {products.map((product) => (
            <div
              key={product.slug}
              className="shop-product-card"
              style={{ width: 300 }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
